using System.Security.Claims;
using DeliveryBackend.Dtos.Customer;
using DeliveryBackend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CustomerController : Controller
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet("users/me")]
        public async Task<IActionResult> GetMe()
        {
            try
            {
                var userId = GetUserId();
                var user = await _customerService.GetUserAsync(userId);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("users/me")]
        public async Task<IActionResult> UpdateMe([FromBody] UpdateUserDto updateUserDto)
        {
            try
            {
                var userId = GetUserId();
                var user = await _customerService.UpdateUserAsync(userId, updateUserDto);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("users/me/addresses")]
        public async Task<IActionResult> GetAddresses()
        {
            try
            {
                var userId = GetUserId();
                var addresses = await _customerService.GetAddressesAsync(userId);
                return Ok(addresses);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("users/me/addresses")]
        public async Task<IActionResult> AddAddress([FromBody] CreateAddressDto createAddressDto)
        {
            try
            {
                var userId = GetUserId();
                var address = await _customerService.AddAddressAsync(userId, createAddressDto);
                return Ok(address);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("users/me/addresses/{id}")]
        public async Task<IActionResult> DeleteAddress(Guid id)
        {
            try
            {
                var userId = GetUserId();
                await _customerService.DeleteAddressAsync(userId, id);
                return Ok(new { message = "Адрес удалён" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("cart")]
        public async Task<IActionResult> GetCart()
        {
            try
            {
                var userId = GetUserId();
                var cart = await _customerService.GetCartAsync(userId);
                return Ok(cart);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("cart/items")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDto addToCartDto)
        {
            try
            {
                var userId = GetUserId();
                var item = await _customerService.AddToCartAsync(userId, addToCartDto);
                return Ok(item);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("cart/items/{id}")]
        public async Task<IActionResult> UpdateCartItem(Guid id, [FromBody] UpdateCartItemDto updateCartItemDto)
        {
            try
            {
                var userId = GetUserId();
                var item = await _customerService.UpdateCartItemAsync(userId, id, updateCartItemDto);
                return Ok(item);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("cart/items/{id}")]
        public async Task<IActionResult> DeleteCartItem(Guid id)
        {
            try
            {
                var userId = GetUserId();
                await _customerService.DeleteCartItemAsync(userId, id);
                return Ok(new { message = "Товар удалён из корзины" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("balance/top-up")]
        public async Task<IActionResult> TopUpBalance([FromBody] TopUpDto topUpDto)
        {
            try
            {
                var userId = GetUserId();
                var result = await _customerService.TopUpBalanceAsync(userId, topUpDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("balance/history")]
        public async Task<IActionResult> GetBalanceHistory()
        {
            try
            {
                var userId = GetUserId();
                var history = await _customerService.GetTransactionHistoryAsync(userId);
                return Ok(history);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var userId = GetUserId();
                var orders = await _customerService.GetOrdersAsync(userId, page, pageSize);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("orders/{id}")]
        public async Task<IActionResult> GetOrder(Guid id)
        {
            try
            {
                var userId = GetUserId();
                var order = await _customerService.GetOrderByIdAsync(userId, id);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("orders")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto createOrderDto)
        {
            try
            {
                var userId = GetUserId();
                var order = await _customerService.CreateOrderAsync(userId, createOrderDto);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value;
            return Guid.Parse(userIdClaim!);
        }
    }

}