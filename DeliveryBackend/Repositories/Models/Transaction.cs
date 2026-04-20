namespace DeliveryBackend.Repositories.Models
{
    public class Transaction
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Type { get; set; } // TopUp, Payment, Refund, Earnings
        public decimal Amount { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }

        public User User { get; set; }
    }
}