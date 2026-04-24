namespace DeliveryBackend.Dtos.Courier
{
    public class CourierOrderDto
    {
        public Guid Id { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal DeliveryFee { get; set; }
        public DateTime CreatedAt { get; set; }
        public AddressDto PickupAddress { get; set; }
        public AddressDto DeliveryAddress { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }

    public class AddressDto
    {
        public Guid Id { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string Building { get; set; }
        public string Apartament { get; set; }
        public string Comment { get; set; }
        public bool LeaveAtDoor { get; set; }
    }

    public class OrderItemDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}