using DeliveryBackend.Dtos.Courier;
using DeliveryBackend.Interfaces;
using DeliveryBackend.Repositories;
using DeliveryBackend.Repositories.Models;
using Microsoft.EntityFrameworkCore;

namespace DeliveryBackend.Services
{
    public class CourierService : ICourierService
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _configuration;
        private const decimal EARNINGS_PERCENT = 0.15m;

        public CourierService(AppDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public async Task<CourierProfileDto> GetProfileAsync(Guid courierId)
        {
            var courier = await _dbContext.Users.FindAsync(courierId)
                ?? throw new Exception("Курьер не найден");

            var totalEarnings = await _dbContext.CourierEarnings
                .Where(e => e.CourierId == courierId)
                .SumAsync(e => e.Amount);

            var activeOrdersCount = await _dbContext.Orders
                .Where(o => o.CourierId == courierId && 
                           (o.Status == "Pending" || o.Status == "PickedUp" || o.Status == "InTransit"))
                .CountAsync();

            return new CourierProfileDto
            {
                Id = courier.Id,
                Email = courier.Email,
                FirstName = courier.FirstName,
                LastName = courier.LastName,
                IsAvailable = courier.IsAvailable,
                TotalEarnings = totalEarnings,
                ActiveOrdersCount = activeOrdersCount
            };
        }

        public async Task<List<CourierOrderDto>> GetMyOrdersAsync(Guid courierId, int page = 1, int pageSize = 10)
        {
            return await _dbContext.Orders
                .Include(o => o.PickupAddress)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .Where(o => o.CourierId == courierId)
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => MapToOrderDto(o))
                .ToListAsync();
        }

        public async Task<CourierOrderDto> GetOrderByIdAsync(Guid courierId, Guid orderId)
        {
            var order = await _dbContext.Orders
                .Include(o => o.PickupAddress)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.CourierId == courierId)
                ?? throw new Exception("Заказ не найден");

            return MapToOrderDto(order);
        }

        public async Task<CourierOrderDto> AcceptOrderAsync(Guid courierId, Guid orderId)
        {
            var order = await _dbContext.Orders.FindAsync(orderId)
                ?? throw new Exception("Заказ не найден");

            if (order.Status != "Pending")
                throw new Exception("Заказ уже назначен другому курьеру");

            const int maxActiveOrders = 3;
            var activeOrdersCount = await _dbContext.Orders
                .Where(o => o.CourierId == courierId &&
                           (o.Status == "Pending" || o.Status == "PickedUp" || o.Status == "InTransit"))
                .CountAsync();

            if (activeOrdersCount >= maxActiveOrders)
                throw new Exception($"У вас слишком много активны�� заказов (максимум {maxActiveOrders})");

            order.Status = "Pending";
            order.CourierId = courierId;

            await _dbContext.SaveChangesAsync();

            var result = await _dbContext.Orders
                .Include(o => o.PickupAddress)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            return MapToOrderDto(result!);
        }

        public async Task<CourierOrderDto> UpdateOrderStatusAsync(Guid courierId, Guid orderId, UpdateOrderStatusDto dto)
        {
            var order = await _dbContext.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.CourierId == courierId)
                ?? throw new Exception("Заказ не найден");

            var validTransitions = new Dictionary<string, string[]>
            {
                ["Pending"] = new[] { "PickedUp", "Cancelled" },
                ["PickedUp"] = new[] { "InTransit", "Cancelled" },
                ["InTransit"] = new[] { "Delivered", "Cancelled" }
            };

            if (!validTransitions.ContainsKey(order.Status) || !validTransitions[order.Status].Contains(dto.Status))
                throw new Exception($"Недопустимый переход статуса с {order.Status} на {dto.Status}");

            order.Status = dto.Status;

            if (dto.Status == "Delivered")
            {
                order.DeliveredAt = DateTime.UtcNow;
                await AddEarningsAsync(courierId, order);
            }

            await _dbContext.SaveChangesAsync();

            var result = await _dbContext.Orders
                .Include(o => o.PickupAddress)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            return MapToOrderDto(result!);
        }

        public async Task UpdateAvailabilityAsync(Guid courierId, bool isAvailable)
        {
            var courier = await _dbContext.Users.FindAsync(courierId)
                ?? throw new Exception("Курьер не найден");

            courier.IsAvailable = isAvailable;
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<CourierEarningDto>> GetEarningsAsync(Guid courierId)
        {
            return await _dbContext.CourierEarnings
                .Where(e => e.CourierId == courierId)
                .OrderByDescending(e => e.CreatedAt)
                .Select(e => new CourierEarningDto
                {
                    Id = e.Id,
                    OrderId = e.OrderId,
                    Amount = e.Amount,
                    CreatedAt = e.CreatedAt
                })
                .ToListAsync();
        }

        private async Task AddEarningsAsync(Guid courierId, Order order)
        {
            var earnings = order.TotalAmount * EARNINGS_PERCENT;

            var earning = new CourierEarning
            {
                Id = Guid.NewGuid(),
                CourierId = courierId,
                OrderId = order.Id,
                Amount = earnings,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.CourierEarnings.Add(earning);

            var courier = await _dbContext.Users.FindAsync(courierId);
            if (courier != null)
            {
                courier.Balance += earnings;
            }

            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = courierId,
                Type = "DeliveryEarning",
                Amount = earnings,
                Comment = $"Доставка заказа {order.Id}",
                CreatedAt = DateTime.UtcNow
            };
            _dbContext.Transactions.Add(transaction);
        }

        private static CourierOrderDto MapToOrderDto(Order order)
        {
            return new CourierOrderDto
            {
                Id = order.Id,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                DeliveryFee = order.DeliveryFee,
                CreatedAt = order.CreatedAt,
                PickupAddress = new AddressDto
                {
                    Id = order.PickupAddressId,
                    City = order.PickupAddress?.City,
                    Street = order.PickupAddress?.Street,
                    Building = order.PickupAddress?.Building,
                    Apartament = order.PickupAddress?.Apartament,
                    Comment = order.PickupAddress?.Comment,
                    LeaveAtDoor = order.PickupAddress?.LeaveAtDoor ?? false
                },
                DeliveryAddress = new AddressDto
                {
                    Id = order.DeliveryAddressId,
                    City = order.DeliveryAddress?.City,
                    Street = order.DeliveryAddress?.Street,
                    Building = order.DeliveryAddress?.Building,
                    Apartament = order.DeliveryAddress?.Apartament,
                    Comment = order.DeliveryAddress?.Comment,
                    LeaveAtDoor = order.DeliveryAddress?.LeaveAtDoor ?? false
                },
                Items = order.Items.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product?.Name,
                    Quantity = i.Quantity,
                    Price = i.CurrentPrice
                }).ToList()
            };
        }
    }
}