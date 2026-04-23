using DeliveryBackend.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace DeliveryBackend.Services
{
    public class ImageService : IImageService
    {
        private readonly IWebHostEnvironment _environment;
        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private const long MaxFileSize = 5 * 1024 * 1024;

        public ImageService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> SaveImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;

            if (file.Length > MaxFileSize)
                throw new Exception("Файл слишком большой. Максимальный размер - 5MB");

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
                throw new Exception("Недопустимый формат файла. Разрешены: jpg, jpeg, png, webp");

            var uploadsFolder = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "images");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/images/{fileName}";
        }

        public Task DeleteImageAsync(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
                return Task.CompletedTask;

            var fileName = Path.GetFileName(imageUrl);
            var filePath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "images", fileName);

            if (File.Exists(filePath))
                File.Delete(filePath);

            return Task.CompletedTask;
        }
    }
}