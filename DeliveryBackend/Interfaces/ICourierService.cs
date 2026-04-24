using DeliveryBackend.Dtos.Courier;

namespace DeliveryBackend.Interfaces
{
    public interface ICourierService
    {
        public Task<CourierProfileDto> GetProfileAsync(Guid courierId);
        public Task<List<CourierOrderDto>> GetMyOrdersAsync(Guid courierId, int page = 1, int pageSize = 10);
        public Task<CourierOrderDto> GetOrderByIdAsync(Guid courierId, Guid orderId);
        public Task<CourierOrderDto> AcceptOrderAsync(Guid courierId, Guid orderId);
        public Task<CourierOrderDto> UpdateOrderStatusAsync(Guid courierId, Guid orderId, UpdateOrderStatusDto dto);
        public Task UpdateAvailabilityAsync(Guid courierId, bool isAvailable);
        public Task<List<CourierEarningDto>> GetEarningsAsync(Guid courierId);
    }
}