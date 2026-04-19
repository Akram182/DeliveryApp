using DeliveryBackend.Dtos.Auth;

namespace DeliveryBackend.Interfaces
{
    public interface IAuthService
    {
        public Task<AuthResultDto> Registration(RegistrationDto registrationDto);
        public Task<AuthResultDto> Login(LoginDto loginDto);
    }
}
