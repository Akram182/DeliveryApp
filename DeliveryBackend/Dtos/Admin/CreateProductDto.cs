
using System.ComponentModel.DataAnnotations;

namespace DeliveryBackend.Dtos.Admin
{
    public class CreateProductDto
    {
        [Required]
        [StringLength(20, ErrorMessage = "Максимальная длина Name - 20")]
        public string Name { get; set; }

        [Required]
        [Range(1, 99999999, ErrorMessage = "Значение от 1 до 100 000 000")]
        public decimal Price { get; set; }

        [Required]
        [Range(1, 999999, ErrorMessage = "Значение от 1 до 1 000 000")]
        public int Stock { get; set; }

        [Required]
        public bool IsActive { get; set; }

        
        public string ImageUrl { get; set; }

        [Required]
        public Guid CategoryId { get; set; }
    }
}
