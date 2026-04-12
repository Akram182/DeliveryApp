using System.Net;

namespace DeliveryBackend.Repositories.Models
{
    public class Order
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public Guid? CourierId { get; set; } // Null пока не взят курьером
        public Guid PickupAddressId { get; set; } // Value Object или ссылка
        public Guid DeliveryAddressId { get; set; }

        public string Status { get; set; } // Created, Assigned, PickedUp, Delivered, Cancelled
        public decimal TotalAmount { get; set; } 
        public decimal DeliveryFee { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime DeliveredAt { get; set; }

        public ICollection<OrderItem> Items { get; set; }
        public Address PickupAddress { get; set; } // Value Object или ссылка
        public Address DeliveryAddress { get; set; }
        public User Customer { get; set; }
        public User Courier{ get; set; }
    }
}

