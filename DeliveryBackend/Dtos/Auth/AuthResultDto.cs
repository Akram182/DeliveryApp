namespace DeliveryBackend.Dtos.Auth
{
    public class AuthResultDto
    {
        public string AccessToken { get; set; }
        public string Email { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public decimal Balance { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
