using System.Security.Claims;
using DeliveryBackend.Dtos.Courier;
using DeliveryBackend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Courier")]
    public class CourierController : Controller
    {
        private readonly ICourierService _courierService;

        public CourierController(ICourierService courierService)
        {
            _courierService = courierService;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var courierId = GetUserId();
                var profile = await _courierService.GetProfileAsync(courierId);
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("availability")]
        public async Task<IActionResult> UpdateAvailability([FromBody] UpdateAvailabilityDto dto)
        {
            try
            {
                var courierId = GetUserId();
                await _courierService.UpdateAvailabilityAsync(courierId, dto.IsAvailable);
                return Ok(new { message = "Доступность обновлена" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetMyOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var courierId = GetUserId();
                var orders = await _courierService.GetMyOrdersAsync(courierId, page, pageSize);
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
                var courierId = GetUserId();
                var order = await _courierService.GetOrderByIdAsync(courierId, id);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("orders/{id}/accept")]
        public async Task<IActionResult> AcceptOrder(Guid id)
        {
            try
            {
                var courierId = GetUserId();
                var order = await _courierService.AcceptOrderAsync(courierId, id);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("orders/{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusDto dto)
        {
            try
            {
                var courierId = GetUserId();
                var order = await _courierService.UpdateOrderStatusAsync(courierId, id, dto);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("earnings")]
        public async Task<IActionResult> GetEarnings()
        {
            try
            {
                var courierId = GetUserId();
                var earnings = await _courierService.GetEarningsAsync(courierId);
                return Ok(earnings);
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

    public class UpdateAvailabilityDto
    {
        public bool IsAvailable { get; set; }
    }
}