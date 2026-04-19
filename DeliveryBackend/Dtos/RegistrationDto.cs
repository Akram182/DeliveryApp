using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DeliveryBackend.Dtos
{
    public class RegistrationDto
    {
        [Required]
        [EmailAddress]
        [StringLength(254,ErrorMessage ="Максимальная длина email - 254")]
        public string Email { get; set; }

        [Required]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?=.{8,}$).*$",
        ErrorMessage = "Пароль должен содержать минимум 8 символов, хотя бы одну заглавную букву, хотя бы одну цифру и хотя бы один специальный символ")]
        public string Password { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Максимальная длина фамилии - 254")]
        public string FirstName { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Максимальная длина имени - 254")]
        public string LastName { get; set; }
    }
}
