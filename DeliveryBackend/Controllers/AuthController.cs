using System.Net;
using DeliveryBackend.Dtos.Auth;
using DeliveryBackend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly ILogger<AuthController> _logger;
        private readonly IAuthService _authService;
        public AuthController(ILogger<AuthController> logger,IAuthService authService) 
        {
            _logger = logger;   
            _authService = authService; 
        }


        [HttpGet("ping")]
        public async Task<IActionResult> Ping()
        {
            _logger.LogInformation("Get:api/auth/ping");
            var mesg = Environment.GetEnvironmentVariable("HELLO");
            return Ok( new { message = "Service is working",env = mesg});
        }


        [HttpPost("register")]
        public async Task<IActionResult> Registeration([FromBody] RegistrationDto registrationDto)
        {
            try
            {
                var result = await _authService.Registration(registrationDto);
                return Ok(result);
            }
            catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message });

            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var result = await _authService.Login(loginDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });

            }
        }

    }
}
