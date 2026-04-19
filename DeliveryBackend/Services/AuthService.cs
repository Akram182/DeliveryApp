using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using DeliveryBackend.Dtos.Auth;
using DeliveryBackend.Interfaces;
using DeliveryBackend.Repositories;
using DeliveryBackend.Repositories.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace DeliveryBackend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _dbContext;

        public AuthService(IConfiguration configuration, AppDbContext dbContext)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public async Task<AuthResultDto> Registration(RegistrationDto registrationDto)
        {
            if (await _dbContext.Users.AnyAsync(u => u.Email == registrationDto.Email))
            {
                throw new Exception("Пользователь уже существует");
            }

            var passwordHash = GeneratePasswordHash(registrationDto.Password);

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = registrationDto.Email,
                PasswordHash = passwordHash,
                Role = "Customer",
                FirstName = registrationDto.FirstName,
                LastName = registrationDto.LastName,
                Balance = decimal.Zero,
                Created_At = DateTime.UtcNow
            };

            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();


            return new AuthResultDto() { 
                AccessToken = GenerateJwtToken(user.Id, user.Role),
                Email = user.Email,
                LastName = user.LastName,
                FirstName = user.FirstName,
                Balance = user.Balance,
                CreatedAt = user.Created_At
            };
        }

        public async Task<AuthResultDto> Login(LoginDto loginDto)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user ==null || CheckPassword(user.PasswordHash,loginDto.Password)) throw new Exception("Нету пользователя с таким email или неправильный пароль");

            return new AuthResultDto()
            {
                AccessToken = GenerateJwtToken(user.Id, user.Role),
                Email = user.Email,
                LastName = user.LastName,
                FirstName = user.FirstName,
                Balance = user.Balance,
                CreatedAt = user.Created_At
            };
        }





        private string GeneratePasswordHash(string password)
        {
            using var hmac = new HMACSHA512();
            var passwordSalt = hmac.Key;
            var passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

            return Convert.ToBase64String(passwordSalt) + ':' + Convert.ToBase64String(passwordHash);
        }

        private string GenerateJwtToken(Guid userId, string userRole)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[] {
                new Claim("sub",userId.ToString()),
                new Claim("role",userRole),
                new Claim("iat",DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),ClaimValueTypes.Integer64),
                new Claim("exp",DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeSeconds().ToString(),ClaimValueTypes.Integer64)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims:claims,
                expires:DateTime.UtcNow.AddHours(1),
                signingCredentials:creds
                );


            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool CheckPassword(string storedPasswordHash,string password)
        {
            string[] parts = storedPasswordHash.Split(":");

            if (parts.Length != 2) return false;

            var passwordSalt = Convert.FromBase64String(parts[0]);
            var passwordHash = Convert.FromBase64String(parts[1]);

            using var hmac = new HMACSHA256(passwordSalt);
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

            return hash.SequenceEqual(passwordHash);
        }
    }
}
