using DeliveryBackend.Repositories.Models;

namespace DeliveryBackend.Dtos
{
    public class CatalogResultDto
    {
        public List<Category> Categories { get; set; }
        public List<Product> Products { get; set; }
    }
}
