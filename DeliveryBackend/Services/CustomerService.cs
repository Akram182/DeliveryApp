using DeliveryBackend.Dtos.Customer;
using DeliveryBackend.Interfaces;
using DeliveryBackend.Repositories;
using DeliveryBackend.Repositories.Models;
using Microsoft.EntityFrameworkCore;

namespace DeliveryBackend.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public CustomerService(AppDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public async Task<UserDto> GetUserAsync(Guid userId)
        {
            var user = await _dbContext.Users.FindAsync(userId)
                ?? throw new Exception("Пользователь не найден");

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role,
                Balance = user.Balance
            };
        }

        public async Task<UserDto> UpdateUserAsync(Guid userId, UpdateUserDto updateUserDto)
        {
            var user = await _dbContext.Users.FindAsync(userId)
                ?? throw new Exception("Пользователь не найден");

            // if (!string.IsNullOrEmpty(updateUserDto.FirstName))
            //     user.FirstName = updateUserDto.FirstName;
            // if (!string.IsNullOrEmpty(updateUserDto.LastName))
            //     user.LastName = updateUserDto.LastName;

            user.FirstName = updateUserDto.FirstName;
            user.LastName = updateUserDto.LastName;

            await _dbContext.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Balance = user.Balance
            };
        }

        public async Task<List<AddressDto>> GetAddressesAsync(Guid userId)
        {
            return await _dbContext.Addresses
                .Where(a => a.UserId == userId)
                .Select(a => new AddressDto
                {
                    Id = a.Id,
                    City = a.City,
                    Street = a.Street,
                    Building = a.Building,
                    Apartament = a.Apartament,
                    Comment = a.Comment,
                    LeaveAtDoor = a.LeaveAtDoor
                })
                .ToListAsync();
        }

        public async Task<AddressDto> AddAddressAsync(Guid userId, CreateAddressDto createAddressDto)
        {
            var address = new Address
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                City = createAddressDto.City,
                Street = createAddressDto.Street,
                Building = createAddressDto.Building,
                Apartament = createAddressDto.Apartament,
                Comment = createAddressDto.Comment,
                LeaveAtDoor = createAddressDto.LeaveAtDoor
            };

            _dbContext.Addresses.Add(address);
            await _dbContext.SaveChangesAsync();

            return new AddressDto
            {
                Id = address.Id,
                City = address.City,
                Street = address.Street,
                Building = address.Building,
                Apartament = address.Apartament,
                Comment = address.Comment,
                LeaveAtDoor = address.LeaveAtDoor
            };
        }

        public async Task DeleteAddressAsync(Guid userId, Guid addressId)
        {
            var address = await _dbContext.Addresses
                .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId)
                ?? throw new Exception("Адрес не найден");

            _dbContext.Addresses.Remove(address);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<CartItemDto>> GetCartAsync(Guid userId)
        {
            return await _dbContext.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == userId)
                .Select(c => new CartItemDto
                {
                    Id = c.Id,
                    ProductId = c.ProductId,
                    ProductName = c.Product.Name,
                    ProductPrice = c.Product.Price,
                    Quantity = c.Quantity
                })
                .ToListAsync();
        }

        public async Task<CartItemDto> AddToCartAsync(Guid userId, AddToCartDto addToCartDto)
        {
            var product = await _dbContext.Products.FindAsync(addToCartDto.ProductId)
                ?? throw new Exception("Товар не найден");

            if (!product.IsActive)
                throw new Exception("Товар не активен");

            var existingItem = await _dbContext.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == addToCartDto.ProductId);

            if (existingItem != null)
            {
                existingItem.Quantity += addToCartDto.Quantity;
                await _dbContext.SaveChangesAsync();

                return new CartItemDto
                {
                    Id = existingItem.Id,
                    ProductId = existingItem.ProductId,
                    ProductName = product.Name,
                    ProductPrice = product.Price,
                    Quantity = existingItem.Quantity
                };
            }

            var cartItem = new CartItem
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ProductId = addToCartDto.ProductId,
                Quantity = addToCartDto.Quantity
            };

            _dbContext.CartItems.Add(cartItem);
            await _dbContext.SaveChangesAsync();

            return new CartItemDto
            {
                Id = cartItem.Id,
                ProductId = cartItem.ProductId,
                ProductName = product.Name,
                ProductPrice = product.Price,
                Quantity = cartItem.Quantity
            };
        }

        public async Task<CartItemDto> UpdateCartItemAsync(Guid userId, Guid cartItemId, UpdateCartItemDto updateCartItemDto)
        {
            var cartItem = await _dbContext.CartItems
                .Include(c => c.Product)
                .FirstOrDefaultAsync(c => c.Id == cartItemId && c.UserId == userId)
                ?? throw new Exception("Товар в корзине не найден");

            cartItem.Quantity = updateCartItemDto.Quantity;
            await _dbContext.SaveChangesAsync();

            return new CartItemDto
            {
                Id = cartItem.Id,
                ProductId = cartItem.ProductId,
                ProductName = cartItem.Product.Name,
                ProductPrice = cartItem.Product.Price,
                Quantity = cartItem.Quantity
            };
        }

        public async Task DeleteCartItemAsync(Guid userId, Guid cartItemId)
        {
            var cartItem = await _dbContext.CartItems
                .FirstOrDefaultAsync(c => c.Id == cartItemId && c.UserId == userId)
                ?? throw new Exception("Товар в корзине не найден");

            _dbContext.CartItems.Remove(cartItem);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<TopUpResultDto> TopUpBalanceAsync(Guid userId, TopUpDto topUpDto)
        {
            if (topUpDto.Amount <= 0)
                throw new Exception("Сумма должна быть положительной");

            var user = await _dbContext.Users.FindAsync(userId)
                ?? throw new Exception("Пользователь не найден");

            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                user.Balance += topUpDto.Amount;

                var transactionRecord = new Transaction
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Type = "TopUp",
                    Amount = topUpDto.Amount,
                    Comment = "Пополнение баланса",
                    CreatedAt = DateTime.UtcNow
                };

                _dbContext.Transactions.Add(transactionRecord);
                await _dbContext.SaveChangesAsync();

                await transaction.CommitAsync();

                return new TopUpResultDto { NewBalance = user.Balance };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<List<TransactionDto>> GetTransactionHistoryAsync(Guid userId)
        {
            return await _dbContext.Transactions
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TransactionDto
                {
                    Id = t.Id,
                    Type = t.Type,
                    Amount = t.Amount,
                    Comment = t.Comment,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<List<OrderDto>> GetOrdersAsync(Guid userId, int page = 1, int pageSize = 10)
        {
            return await _dbContext.Orders
                .Include(o => o.PickupAddress)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .Where(o => o.CustomerId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => MapToOrderDto(o))
                .ToListAsync();
        }

        public async Task<OrderDto> GetOrderByIdAsync(Guid userId, Guid orderId)
        {
            var order = await _dbContext.Orders
                .Include(o => o.PickupAddress)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.CustomerId == userId)
                ?? throw new Exception("Заказ не найден");

            return MapToOrderDto(order);
        }

        public async Task<OrderDto> CreateOrderAsync(Guid userId, CreateOrderDto createOrderDto)
        {
            var user = await _dbContext.Users.FindAsync(userId)
                ?? throw new Exception("Пользователь не найден");


            var deliveryAddress = await _dbContext.Addresses.FindAsync(createOrderDto.DeliveryAddressId)
                ?? throw new Exception("Адрес доставки не найден");

            if (deliveryAddress.UserId != userId)
                throw new Exception("Адреса должны принадлежать пользователю");

            var cartItems = await _dbContext.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (!cartItems.Any())
                throw new Exception("Корзина пуста");

            
            var totalAmount = cartItems.Sum(c => c.Product.Price * c.Quantity);

            if (user.Balance < totalAmount)
                throw new Exception("Недостаточно средств на балансе");

            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var order = new Order
                {
                    Id = Guid.NewGuid(),
                    CustomerId = userId,
                    PickupAddressId = createOrderDto.DeliveryAddressId,
                    DeliveryAddressId = createOrderDto.DeliveryAddressId,
                    Status = "Created",
                    TotalAmount = totalAmount,
                    DeliveryFee = 0,
                    CreatedAt = DateTime.UtcNow,
                    Items = new List<OrderItem>()
                };

                foreach (var item in cartItems)
                {
                    if (item.Product.Stock < item.Quantity)
                        throw new Exception($"Недостаточно товара {item.Product.Name} на складе");

                    item.Product.Stock -= item.Quantity;

                    order.Items.Add(new OrderItem
                    {
                        Id = Guid.NewGuid(),
                        OrderId = order.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        CurrentPrice = item.Product.Price
                    });
                }

                _dbContext.Orders.Add(order);

                user.Balance -= (totalAmount);

                var transactionRecord = new Transaction
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Type = "Payment",
                    Amount = -(totalAmount),
                    Comment = $"Оплата заказа {order.Id}",
                    CreatedAt = DateTime.UtcNow
                };
                _dbContext.Transactions.Add(transactionRecord);

                _dbContext.CartItems.RemoveRange(cartItems);

                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();

                await AssignCourierToOrderAsync(order.Id);

                var result = await _dbContext.Orders
                    .Include(o => o.PickupAddress)
                    .Include(o => o.DeliveryAddress)
                    .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                    .FirstOrDefaultAsync(o => o.Id == order.Id);

                return MapToOrderDto(result!);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        private static OrderDto MapToOrderDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                Status = order.Status,
                PickupAddress = new AddressDto
                {
                    Id = order.PickupAddressId,
                    City = order.PickupAddress.City,
                    Street = order.PickupAddress.Street,
                    Building = order.PickupAddress.Building,
                    Apartament = order.PickupAddress.Apartament,
                    Comment = order.PickupAddress.Comment,
                    LeaveAtDoor = order.PickupAddress.LeaveAtDoor
                },
                DeliveryAddress = new AddressDto
                {
                    Id = order.DeliveryAddressId,
                    City = order.DeliveryAddress.City,
                    Street = order.DeliveryAddress.Street,
                    Building = order.DeliveryAddress.Building,
                    Apartament = order.DeliveryAddress.Apartament,
                    Comment = order.DeliveryAddress.Comment,
                    LeaveAtDoor = order.DeliveryAddress.LeaveAtDoor
                },
                TotalAmount = order.TotalAmount,
                DeliveryFee = order.DeliveryFee,
                CreatedAt = order.CreatedAt,
                Items = order.Items.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Quantity = i.Quantity,
                    Price = i.CurrentPrice
                }).ToList()
            };
        }

        private async Task AssignCourierToOrderAsync(Guid orderId)
        {
            var availableCouriers = await _dbContext.Users
                .Where(u => u.Role == "Courier" && u.IsAvailable)
                .ToListAsync();

            if (!availableCouriers.Any())
                return;

            var activeOrderCountsList = await _dbContext.Orders
                .Where(o => o.CourierId != null &&
                          (o.Status == "Pending" || o.Status == "PickedUp" || o.Status == "InTransit"))
                .GroupBy(o => o.CourierId)
                .Select(g => new { CourierId = g.Key, Count = g.Count() })
                .ToListAsync();

            var activeOrderCounts = activeOrderCountsList
                .Where(c => c.CourierId.HasValue)
                .ToDictionary(c => c.CourierId!.Value, c => c.Count);

            var minCount = activeOrderCounts.Any()
                ? activeOrderCounts.Values.Min()
                : 0;

            var courierIdsWithMinOrders = activeOrderCounts
                .Where(kv => kv.Value == minCount)
                .Select(kv => kv.Key)
                .ToHashSet();

            User? courier = null;
            
            if (courierIdsWithMinOrders.Any())
            {
                courier = availableCouriers
                    .FirstOrDefault(c => courierIdsWithMinOrders.Contains(c.Id));
            }

            if (courier == null)
                courier = availableCouriers.First();

            var order = await _dbContext.Orders.FindAsync(orderId);
            if (order != null && courier != null)
            {
                order.CourierId = courier.Id;
                order.Status = "Pending";
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}