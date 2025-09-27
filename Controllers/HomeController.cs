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
                new Event { Id = 1, Title = "Brahmotsavam Festival", Description = "Annual grand festival celebrating Lord Balaji", EventDate = DateTime.Now.AddDays(30), IsFeatured = true, EventTime = "6:00 AM - 10:00 PM" },
                new Event { Id = 2, Title = "Vaikunta Ekadashi", Description = "Sacred day dedicated to Lord Vishnu", EventDate = DateTime.Now.AddDays(60), IsFeatured = true, EventTime = "4:00 AM - 12:00 PM" }
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