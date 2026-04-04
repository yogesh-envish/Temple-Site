using System.Text.Json;
using TempleWebsite.Models;

namespace TempleWebsite.Services
{
    public class EventPersistenceService : IEventPersistenceService
    {
        private readonly string _filePath;

        public EventPersistenceService(IWebHostEnvironment env)
        {
            var dataDir = Path.Combine(env.WebRootPath, "data");
            Directory.CreateDirectory(dataDir);
            _filePath = Path.Combine(dataDir, "events.json");
        }

        public void Save(List<Event> events)
        {
            var json = JsonSerializer.Serialize(events, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(_filePath, json);
        }

        public List<Event>? Load()
        {
            if (!System.IO.File.Exists(_filePath)) return null;
            var json = System.IO.File.ReadAllText(_filePath);
            return JsonSerializer.Deserialize<List<Event>>(json);
        }
    }
}
