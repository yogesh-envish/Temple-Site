using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;
using TempleWebsite.Models;

namespace TempleWebsite.Services
{
    public class GalleryService : IGalleryService
    {
        private readonly string _filePath;
        private readonly IMemoryCache _cache;

        public GalleryService(IWebHostEnvironment env, IMemoryCache cache)
        {
            var dataDir = Path.Combine(env.WebRootPath, "data");
            Directory.CreateDirectory(dataDir);
            _filePath = Path.Combine(dataDir, GalleryConstants.DataFile);
            _cache = cache;
        }

        public List<GalleryImage> GetAll()
        {
            if (_cache.TryGetValue(GalleryConstants.CacheKey, out List<GalleryImage>? cached) && cached != null)
                return cached;

            var images = LoadFromDisk();

            _cache.Set(GalleryConstants.CacheKey, images, new MemoryCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromHours(24)
            });

            return images;
        }

        public void Add(GalleryImage image)
        {
            var images = LoadFromDisk();
            image.Id = images.Count > 0 ? images.Max(i => i.Id) + 1 : 1;
            images.Add(image);
            SaveToDisk(images);
            _cache.Set(GalleryConstants.CacheKey, images, new MemoryCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromHours(24)
            });
        }

        public bool Delete(int id)
        {
            var images = LoadFromDisk();
            var record = images.FirstOrDefault(i => i.Id == id);
            if (record == null)
                return false;

            images.Remove(record);
            SaveToDisk(images);
            _cache.Set(GalleryConstants.CacheKey, images, new MemoryCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromHours(24)
            });
            return true;
        }

        private List<GalleryImage> LoadFromDisk()
        {
            if (!File.Exists(_filePath))
                return new List<GalleryImage>();

            var json = File.ReadAllText(_filePath);
            return JsonSerializer.Deserialize<List<GalleryImage>>(json) ?? new List<GalleryImage>();
        }

        private void SaveToDisk(List<GalleryImage> images)
        {
            var json = JsonSerializer.Serialize(images, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_filePath, json);
        }
    }
}
