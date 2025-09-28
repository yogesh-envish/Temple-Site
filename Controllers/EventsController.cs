using Microsoft.AspNetCore.Mvc;
using TempleWebsite.Models;

namespace TempleWebsite.Controllers
{
    public class EventsController : Controller
    {
        public IActionResult Index()
        {
            var events = new List<Event>
            {
                // Ranganathar/Vishnu Events
                new Event { Id = 1, Title = "Vaikunta Ekadashi", Description = "Sacred day for Lord Ranganathar with special darshan", EventDate = DateTime.Now.AddDays(10), EventTime = "4:00 AM - 12:00 PM", IsFeatured = true },
                new Event { Id = 2, Title = "Ranganathar Brahmotsavam", Description = "Annual grand festival for Lord Ranganathar", EventDate = DateTime.Now.AddDays(25), EventTime = "6:00 AM - 10:00 PM", IsFeatured = true },
                new Event { Id = 3, Title = "Narasimha Jayanti", Description = "Birth celebration of Lord Narasimha", EventDate = DateTime.Now.AddDays(40), EventTime = "6:00 AM - 9:00 PM", IsFeatured = true },
                
                // Shiva Events
                new Event { Id = 4, Title = "Maha Shivaratri", Description = "Great night of Lord Shiva with special abhishekam", EventDate = DateTime.Now.AddDays(15), EventTime = "6:00 PM - 6:00 AM", IsFeatured = true },
                new Event { Id = 5, Title = "Pradosham", Description = "Bi-monthly Shiva worship", EventDate = DateTime.Now.AddDays(8), EventTime = "6:00 PM - 8:00 PM", IsFeatured = false },
                
                // Rama Events
                new Event { Id = 6, Title = "Sri Rama Navami", Description = "Birth celebration of Lord Rama with Sita, Lakshmana", EventDate = DateTime.Now.AddDays(45), EventTime = "6:00 AM - 9:00 PM", IsFeatured = true },
                
                // Hanuman Events
                new Event { Id = 7, Title = "Hanuman Jayanti", Description = "Birth celebration of Lord Hanuman", EventDate = DateTime.Now.AddDays(50), EventTime = "6:00 AM - 9:00 PM", IsFeatured = true },
                new Event { Id = 8, Title = "Hanuman Chalisa Parayanam", Description = "Special Hanuman prayers every Tuesday", EventDate = DateTime.Now.AddDays(5), EventTime = "7:00 PM - 8:00 PM", IsFeatured = false },
                
                // Krishna Events
                new Event { Id = 9, Title = "Krishna Janmashtami", Description = "Birth celebration of Lord Krishna with Radha", EventDate = DateTime.Now.AddDays(75), EventTime = "11:30 PM - 12:30 AM", IsFeatured = true },
                new Event { Id = 10, Title = "Radha Ashtami", Description = "Birth celebration of Goddess Radha", EventDate = DateTime.Now.AddDays(80), EventTime = "6:00 AM - 9:00 PM", IsFeatured = false },
                
                // Varaha Events
                new Event { Id = 11, Title = "Varaha Jayanti", Description = "Celebration of Lord Varaha with Lakshmi", EventDate = DateTime.Now.AddDays(70), EventTime = "6:00 AM - 9:00 PM", IsFeatured = false },
                
                // Navagraha Events
                new Event { Id = 12, Title = "Navagraha Homam", Description = "Special prayers for nine planets including Rahu-Ketu", EventDate = DateTime.Now.AddDays(20), EventTime = "10:00 AM - 12:00 PM", IsFeatured = false },
                
                // Shani Events
                new Event { Id = 13, Title = "Shani Amavasya", Description = "Special prayers for Lord Shaneeshwara", EventDate = DateTime.Now.AddDays(30), EventTime = "6:00 AM - 8:00 PM", IsFeatured = false },
                
                // Ganesha Events
                new Event { Id = 14, Title = "Vinayaka Chaturthi", Description = "Monthly celebration of Lord Ganesha", EventDate = DateTime.Now.AddDays(12), EventTime = "6:00 AM - 9:00 PM", IsFeatured = false },
                new Event { Id = 15, Title = "Ganesh Chaturthi", Description = "Grand celebration of Lord Vinayagar", EventDate = DateTime.Now.AddDays(85), EventTime = "6:00 AM - 10:00 PM", IsFeatured = true },
                
                // Devi Events
                new Event { Id = 16, Title = "Navaratri", Description = "Nine nights celebrating Mahasakthi and Varahi Devi", EventDate = DateTime.Now.AddDays(90), EventTime = "6:00 AM - 10:00 PM", IsFeatured = true },
                new Event { Id = 17, Title = "Devi Navaratri", Description = "Spring festival for Divine Mother", EventDate = DateTime.Now.AddDays(35), EventTime = "6:00 AM - 9:00 PM", IsFeatured = false },
                
                // Ayyappa Events
                new Event { Id = 18, Title = "Makaravilakku", Description = "Special celebration for Lord Ayyappa", EventDate = DateTime.Now.AddDays(60), EventTime = "6:00 PM - 10:00 PM", IsFeatured = true },
                
                // Murugan Events
                new Event { Id = 19, Title = "Skanda Sashti", Description = "Six-day festival for Lord Murugan with Valli Devasena", EventDate = DateTime.Now.AddDays(95), EventTime = "6:00 AM - 9:00 PM", IsFeatured = true },
                new Event { Id = 20, Title = "Thai Pusam", Description = "Grand festival for Lord Murugan", EventDate = DateTime.Now.AddDays(55), EventTime = "4:00 AM - 10:00 PM", IsFeatured = true },
                
                // Dakshinamurthy Events
                new Event { Id = 21, Title = "Guru Purnima", Description = "Celebration of Lord Dakshinamurthy as supreme teacher", EventDate = DateTime.Now.AddDays(65), EventTime = "6:00 AM - 9:00 PM", IsFeatured = false },
                
                // Bhairava Events
                new Event { Id = 22, Title = "Bhairava Ashtami", Description = "Monthly celebration of Bhairava with Bhairavi", EventDate = DateTime.Now.AddDays(18), EventTime = "11:00 PM - 1:00 AM", IsFeatured = false },
                
                // Adisesha Events
                new Event { Id = 23, Title = "Ananta Chaturdashi", Description = "Celebration of Adisesha, the cosmic serpent", EventDate = DateTime.Now.AddDays(88), EventTime = "6:00 AM - 9:00 PM", IsFeatured = false },
                
                // Karuppu Swamy Events
                new Event { Id = 24, Title = "Karuppu Swamy Thiruvizha", Description = "Annual festival for village deity Karuppu Swamy", EventDate = DateTime.Now.AddDays(42), EventTime = "10:00 PM - 2:00 AM", IsFeatured = false }
            };
            
            // Sort by date and return all events (they're all future now)
            var sortedEvents = events.OrderBy(e => e.EventDate).ToList();
            return View(sortedEvents);
        }
    }
}