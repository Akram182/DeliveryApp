namespace DeliveryBackend.Repositories.Models
{
    public class Address
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string Building { get; set; }
        public string Apartament { get; set; }
        public string Comment { get; set; }
        public bool LeaveAtDoor { get; set; }
        public User User { get; set; }
    }
}
