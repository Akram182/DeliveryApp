using System.ComponentModel.DataAnnotations;

namespace DeliveryBackend.Dtos
{
    public class UpdateCategoryDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }
    }
}
