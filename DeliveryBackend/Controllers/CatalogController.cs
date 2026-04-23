
using DeliveryBackend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CatalogController : Controller
    {
        private readonly ICatalogService _catalogService;

        public CatalogController(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }


        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var result = await _catalogService.GetCategories();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("products")]
        public async Task<IActionResult> GetProducts([FromQuery] string category, [FromQuery] int chunkLength = 20)
        {
            try
            {
                var result = await _catalogService.GetProducts(category, chunkLength);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("products/all")]
        public async Task<IActionResult> GetAllProducts([FromQuery] int chunkLength = 20)
        {
            try
            {
                var result = await _catalogService.GetAllProducts(chunkLength);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("products/{id}")]
        public async Task<IActionResult> GetProductById([FromRoute] string id)
        {
            try
            {
                var result = await _catalogService.GetProductById(id);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
