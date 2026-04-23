using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace DeliveryBackend.Dtos.Admin
{
    public class UpdateCategoryDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        public IFormFile? Image { get; set; }
        public string? ImageUrl { get; set; }
    }
}