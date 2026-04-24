namespace DeliveryBackend.Dtos.Courier
{
    public class CourierEarningDto
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public decimal Amount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}