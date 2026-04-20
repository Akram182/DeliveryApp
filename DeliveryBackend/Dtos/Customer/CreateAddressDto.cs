namespace DeliveryBackend.Dtos.Customer
{
    public class CreateAddressDto
    {
        public string City { get; set; }
        public string Street { get; set; }
        public string Building { get; set; }
        public string Apartament { get; set; }
        public string? Comment { get; set; }
        public bool LeaveAtDoor { get; set; }
    }
}