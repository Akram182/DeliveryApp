namespace DeliveryBackend.Repositories.Models
{
    public class CourierEarning
    {
        public Guid Id { get; set; }
        public Guid CourierId { get; set; }
        public Guid OrderId { get; set; }
        public decimal Amount { get; set; }
        public DateTime CreatedAt { get; set; }

        public User Courier { get; set; }
        public Order Order { get; set; }
    }
}