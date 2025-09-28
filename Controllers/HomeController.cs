using Microsoft.AspNetCore.Mvc;
using TempleWebsite.Models;

namespace TempleWebsite.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            var featuredEvents = new List<Event>
            {
                new Event { Id = 1, Title = "Maha Shivaratri", Description = "Great night of Lord Shiva with special abhishekam", EventDate = DateTime.Now.AddDays(15), IsFeatured = true, EventTime = "6:00 PM - 6:00 AM" },
                new Event { Id = 2, Title = "Sri Rama Navami", Description = "Birth celebration of Lord Rama with Sita, Lakshmana", EventDate = DateTime.Now.AddDays(45), IsFeatured = true, EventTime = "6:00 AM - 9:00 PM" },
                new Event { Id = 3, Title = "Krishna Janmashtami", Description = "Birth celebration of Lord Krishna with Radha", EventDate = DateTime.Now.AddDays(75), IsFeatured = true, EventTime = "11:30 PM - 12:30 AM" }
            };
            
            return View(featuredEvents);
        }

        public IActionResult About()
        {
            return View();
        }

        public IActionResult Contact()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }
    }
}