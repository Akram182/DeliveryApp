using System.Reflection.Metadata.Ecma335;

namespace DeliveryBackend.Repositories.Models
{
    public class Product
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public bool IsActive { get; set; }
        public string ImageUrl { get; set; }

        public ICollection<OrderItem> Items { get; set; }

        public Category Category { get; set; }
    }
}
