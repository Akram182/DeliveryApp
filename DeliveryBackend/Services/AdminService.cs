using System.Diagnostics;
using DeliveryBackend.Dtos;
using DeliveryBackend.Interfaces;
using DeliveryBackend.Repositories;
using DeliveryBackend.Repositories.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DeliveryBackend.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _dbContext;

        public AdminService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Category> CreateCategory(CreateCategoryDto createCategoryDto)
        {
            var category = new Category
            {
                Id = Guid.NewGuid(),
                Name = createCategoryDto.Name,
                Description = createCategoryDto.Description
            };

            await _dbContext.Categories.AddAsync(category);
            await _dbContext.SaveChangesAsync();

            return category;
        }

        public async Task<Product> CreateProduct(CreateProductDto createProductDto)
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                CategoryId = createProductDto.CategoryId,
                Name = createProductDto.Name,
                Price = createProductDto.Price,
                Stock = createProductDto.Stock,
                IsActive = createProductDto.IsActive,
                ImageUrl = createProductDto.ImageUrl
            };

            await _dbContext.Products.AddAsync(product);
            await _dbContext.SaveChangesAsync();


            return product;

        }

        public async Task<bool> DeleteCategory(string id)
        {
            var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id.ToString() == id);

            if (category == null) throw new Exception("Нету такого категория");

            _dbContext.Categories.Remove(category);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteProduct(string id)
        {
            var product = await _dbContext.Products.FirstOrDefaultAsync(c => c.Id.ToString() == id);

            if (product == null) throw new Exception("Нету такого категория");

            _dbContext.Products.Remove(product);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<CatalogResultDto> GetCategories()
        {
            var categories = await _dbContext.Categories.ToListAsync();

            return new CatalogResultDto
            {
                Categories = categories,
                Products = null
            };
        }

        public async Task<CatalogResultDto> GetProducts()
        {
            var products = await _dbContext.Products.ToListAsync();

            return new CatalogResultDto
            {
                Categories = null,
                Products = products
            };
        }

        public async Task<Category> UpdateCategory(UpdateCategoryDto updateCategoryDto)
        {
            var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id == updateCategoryDto.Id);

            if (category == null) throw new Exception("Нету такого категория");

            category.Name = updateCategoryDto.Name;
            category.Description = updateCategoryDto.Description;

            await _dbContext.SaveChangesAsync();

            return category;    
        }

        public async Task<Product> UpdateProduct(UpdateProductDto updateProductDto)
        {
            var product = await _dbContext.Products.FirstOrDefaultAsync(c => c.Id == updateProductDto.Id);

            if (product == null) throw new Exception("Нету такого продукта");

            product.Name = updateProductDto.Name;
            product.Price = updateProductDto.Price;
            product.Stock = updateProductDto.Stock;
            product.IsActive = updateProductDto.IsActive;
            product.ImageUrl = updateProductDto.ImageUrl;
            product.CategoryId = updateProductDto.CategoryId;

            await _dbContext.SaveChangesAsync();

            return product;
        }
    }
}
