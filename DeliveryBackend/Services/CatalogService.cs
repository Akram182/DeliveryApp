using DeliveryBackend.Dtos;
using DeliveryBackend.Interfaces;
using DeliveryBackend.Repositories;
using DeliveryBackend.Repositories.Models;
using Microsoft.EntityFrameworkCore;

namespace DeliveryBackend.Services
{
    public class CatalogService : ICatalogService
    {
        private readonly AppDbContext _dbContext;
        public CatalogService(AppDbContext dbContext)
        {
            _dbContext = dbContext ;
        }
        public async Task<CatalogResultDto> GetCategories()
        {
            var categories = await _dbContext.Categories.ToListAsync();

            if (categories == null) throw new Exception("Нету категорий");

            return new CatalogResultDto
            {
                Categories = categories,
                Products = null
            };
        }

        public async Task<CatalogResultDto> GetProducts(string category, int chunkLength)
        {
            var products = await _dbContext.Products.Where(p => p.Category.Name == category).Take(chunkLength).ToListAsync();

            if (products == null) throw new Exception("Нету продуктов");

            return new CatalogResultDto
            {
                Categories = null,
                Products = products
            };
        }

        public async Task<CatalogResultDto> GetProductById(string productId)
        {
            var product = await _dbContext.Products.Where(p => p.Id.ToString() == productId).ToListAsync();

            if (product == null) throw new Exception("Нету продукта");

            return new CatalogResultDto
            {
                Categories = null,
                Products = product
            };
        }
    }
}
