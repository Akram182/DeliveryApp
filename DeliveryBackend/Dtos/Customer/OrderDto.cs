namespace DeliveryBackend.Dtos.Customer
{
    public class OrderDto
    {
        public Guid Id { get; set; }
        public string Status { get; set; }
        public AddressDto PickupAddress { get; set; }
        public AddressDto DeliveryAddress { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal DeliveryFee { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }

    public class OrderItemDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}