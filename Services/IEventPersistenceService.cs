using TempleWebsite.Models;

namespace TempleWebsite.Services
{
    public interface IEventPersistenceService
    {
        void Save(List<Event> events);
        List<Event>? Load();
    }
}
