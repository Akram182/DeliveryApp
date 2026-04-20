namespace DeliveryBackend.Dtos.Customer
{
    public class CreateOrderDto
    {
        public Guid PickupAddressId { get; set; }
        public Guid DeliveryAddressId { get; set; }
    }
}