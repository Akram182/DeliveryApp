using DeliveryBackend.Dtos.Admin;
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
        private readonly IImageService _imageService;

        public AdminController(IAdminService adminService, IImageService imageService)
        {
            _adminService = adminService;
            _imageService = imageService;
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
        public async Task<IActionResult> CreateCategory([FromForm] CreateCategoryDto categoryDto)
        {
            try
            {
                if (categoryDto.Image != null)
                {
                    categoryDto.ImageUrl = await _imageService.SaveImageAsync(categoryDto.Image);
                }
                var result = await _adminService.CreateCategory(categoryDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPut("category")]
        public async Task<IActionResult> UpdateCategory([FromForm] UpdateCategoryDto categoryDto)
        {
            try
            {
                var existingCategory = await _adminService.GetCategoryById(categoryDto.Id);
                if (existingCategory == null)
                    return NotFound(new { message = "Категория не найдена" });

                if (categoryDto.Image != null)
                {
                    if (!string.IsNullOrEmpty(existingCategory.ImageUrl))
                        await _imageService.DeleteImageAsync(existingCategory.ImageUrl);
                    categoryDto.ImageUrl = await _imageService.SaveImageAsync(categoryDto.Image);
                }
                else
                {
                    categoryDto.ImageUrl = existingCategory.ImageUrl;
                }

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
                var category = await _adminService.GetCategoryById(Guid.Parse(id));
                if (category != null && !string.IsNullOrEmpty(category.ImageUrl))
                    await _imageService.DeleteImageAsync(category.ImageUrl);

                var result = await _adminService.DeleteCategory(id);
                return Ok(new { message = "true" });
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
        public async Task<IActionResult> CreateProduct([FromForm] CreateProductDto productDto)
        {
            try
            {
                if (productDto.Image != null)
                {
                    productDto.ImageUrl = await _imageService.SaveImageAsync(productDto.Image);
                }
                var result = await _adminService.CreateProduct(productDto);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPut("product")]
        public async Task<IActionResult> UpdateProduct([FromForm] UpdateProductDto productDto)
        {
            try
            {
                var existingProduct = await _adminService.GetProductById(productDto.Id);
                if (existingProduct == null)
                    return NotFound(new { message = "Продукт не найден" });

                if (productDto.Image != null)
                {
                    if (!string.IsNullOrEmpty(existingProduct.ImageUrl))
                        await _imageService.DeleteImageAsync(existingProduct.ImageUrl);
                    productDto.ImageUrl = await _imageService.SaveImageAsync(productDto.Image);
                }
                else
                {
                    productDto.ImageUrl = existingProduct.ImageUrl;
                }

                var result = await _adminService.UpdateProduct(productDto);

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
                var product = await _adminService.GetProductById(Guid.Parse(id));
                if (product != null && !string.IsNullOrEmpty(product.ImageUrl))
                    await _imageService.DeleteImageAsync(product.ImageUrl);

                var result = await _adminService.DeleteProduct(id);

                return Ok(new { message = "true" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("courier")]
        public async Task<IActionResult> CreateCourier([FromBody] CreateCourierDto createCourierDto)
        {
            try
            {
                var courier = await _adminService.CreateCourierAsync(createCourierDto);
                return Ok(new { message = "Курьер создан", id = courier.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


    }
}