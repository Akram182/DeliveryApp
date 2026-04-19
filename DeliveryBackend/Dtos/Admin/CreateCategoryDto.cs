using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata.Ecma335;

namespace DeliveryBackend.Dtos.Admin
{
    public class CreateCategoryDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
    }
}
