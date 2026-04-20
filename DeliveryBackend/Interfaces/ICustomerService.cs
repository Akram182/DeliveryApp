using DeliveryBackend.Dtos.Customer;

namespace DeliveryBackend.Interfaces
{
    public interface ICustomerService
    {
        Task<UserDto> GetUserAsync(Guid userId);
        Task<UserDto> UpdateUserAsync(Guid userId, UpdateUserDto updateUserDto);
        
        Task<List<AddressDto>> GetAddressesAsync(Guid userId);
        Task<AddressDto> AddAddressAsync(Guid userId, CreateAddressDto createAddressDto);
        Task DeleteAddressAsync(Guid userId, Guid addressId);
        
        Task<List<CartItemDto>> GetCartAsync(Guid userId);
        Task<CartItemDto> AddToCartAsync(Guid userId, AddToCartDto addToCartDto);
        Task<CartItemDto> UpdateCartItemAsync(Guid userId, Guid cartItemId, UpdateCartItemDto updateCartItemDto);
        Task DeleteCartItemAsync(Guid userId, Guid cartItemId);
        
        Task<TopUpResultDto> TopUpBalanceAsync(Guid userId, TopUpDto topUpDto);
        Task<List<TransactionDto>> GetTransactionHistoryAsync(Guid userId);
        
        Task<List<OrderDto>> GetOrdersAsync(Guid userId, int page = 1, int pageSize = 10);
        Task<OrderDto> GetOrderByIdAsync(Guid userId, Guid orderId);
        Task<OrderDto> CreateOrderAsync(Guid userId, CreateOrderDto createOrderDto);
    }

    public class TopUpResultDto
    {
        public decimal NewBalance { get; set; }
    }
}