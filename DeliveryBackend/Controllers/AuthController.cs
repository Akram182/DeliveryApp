using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly ILogger<AuthController> _logger;

        public AuthController(ILogger<AuthController> logger) 
        {
            _logger = logger;   
        }


        [HttpGet("ping")]
        public async Task<IActionResult> Ping()
        {
            _logger.LogInformation("Get:api/auth/ping");
            var mesg = Environment.GetEnvironmentVariable("HELLO");
            return Ok( new { message = "Service is working",env = mesg});
        }
    }
}
