using DeliveryBackend.Dtos;
using DeliveryBackend.Interfaces;
using DeliveryBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]

    public class AdminController : Controller
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        //Category EndPoints
        [HttpGet("category")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var result = await _adminService.GetCategories();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("category")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto categoryDto)
        {
            try
            {
                var result = await _adminService.CreateCategory(categoryDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPut("category")]
        public async Task<IActionResult> UpdateCategory([FromBody] UpdateCategoryDto categoryDto)
        {
            try
            {
                var result = await _adminService.UpdateCategory(categoryDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpDelete("category/{id}")]
        public async Task<IActionResult> DeleteCategory(string id)
        {
            try
            {
                var result = await _adminService.DeleteCategory(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        //Product EndPoints
        [HttpGet("product")]
        public async Task<IActionResult> GetProduct()
        {
            try
            {
                var result = await _adminService.GetProducts();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("product")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto categoryDto)
        {
            try
            {
                var result = await _adminService.CreateProduct(categoryDto);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPut("product")]
        public async Task<IActionResult> UpdateProduct([FromBody] UpdateProductDto categoryDto)
        {
            try
            {
                var result = await _adminService.UpdateProduct(categoryDto);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpDelete("product/{id}")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            try
            {
                var result = await _adminService.DeleteProduct(id);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


    }
}
