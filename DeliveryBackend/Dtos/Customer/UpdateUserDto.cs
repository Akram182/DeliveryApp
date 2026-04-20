using System.ComponentModel.DataAnnotations;

namespace DeliveryBackend.Dtos.Customer
{
    public class UpdateUserDto
    {
        [Required]
        [StringLength(100, ErrorMessage = "Максимальная длина фамилии - 254")]
        public string? FirstName { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Максимальная длина имени - 254")]
        public string? LastName { get; set; }
    }
}
