namespace DeliveryBackend.Repositories.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } // Enum: Customer, Courier, Admin
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public decimal Balance { get; set; }
        public DateTime Created_At { get; set; }

        public ICollection<Address>? Addresses { get; set; }
        public ICollection<Order>? OrdersAsCustomer { get; set; }
        public ICollection<Order>? OrdersAsCourier { get; set; }
    }

}
