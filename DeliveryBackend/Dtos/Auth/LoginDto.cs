using System.ComponentModel.DataAnnotations;

namespace DeliveryBackend.Dtos.Auth
{
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        [StringLength(254, ErrorMessage = "Максимальная длина email - 254")]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
