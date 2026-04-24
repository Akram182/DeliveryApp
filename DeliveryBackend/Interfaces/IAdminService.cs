using DeliveryBackend.Dtos;
using DeliveryBackend.Dtos.Admin;
using DeliveryBackend.Repositories.Models;

namespace DeliveryBackend.Interfaces
{
    public interface IAdminService
    {
        public Task<CatalogResultDto> GetCategories();
        public Task<Category> GetCategoryById(Guid id);
        public Task<Category> CreateCategory(CreateCategoryDto createCategoryDto);
        public Task<Category> UpdateCategory(UpdateCategoryDto updateCategoryDto);
        public Task<bool> DeleteCategory(string id);

        public Task<CatalogResultDto> GetProducts();
        public Task<Product> GetProductById(Guid id);
        public Task<Product> CreateProduct(CreateProductDto createProductDto);
        public Task<Product> UpdateProduct(UpdateProductDto updateProductDto);
        public Task<bool> DeleteProduct(string id);

        public Task<User> CreateCourierAsync(CreateCourierDto createCourierDto);
    }
}