using DeliveryBackend.Dtos;

namespace DeliveryBackend.Interfaces
{
    public interface ICatalogService
    {
        public Task<CatalogResultDto> GetCategories();
        public Task<CatalogResultDto> GetProducts(string category,int chunkLength);
        public Task<CatalogResultDto> GetProductById(string productId);
    }
}
