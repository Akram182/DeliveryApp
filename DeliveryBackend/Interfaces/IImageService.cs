using Microsoft.AspNetCore.Http;

namespace DeliveryBackend.Interfaces
{
    public interface IImageService
    {
        Task<string> SaveImageAsync(IFormFile file);
        Task DeleteImageAsync(string imageUrl);
    }
}