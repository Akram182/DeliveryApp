namespace DeliveryBackend.Dtos.Courier
{
    public class CourierProfileDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsAvailable { get; set; }
        public decimal TotalEarnings { get; set; }
        public int ActiveOrdersCount { get; set; }
    }
}