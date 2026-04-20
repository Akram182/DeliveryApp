namespace DeliveryBackend.Dtos.Customer
{
    public class TransactionDto
    {
        public Guid Id { get; set; }
        public string Type { get; set; }
        public decimal Amount { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}