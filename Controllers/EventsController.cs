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
                new Event { Id = 1, Title = "Brahmotsavam Festival", Description = "Annual grand festival celebrating Lord Balaji", EventDate = DateTime.Now.AddDays(30), EventTime = "6:00 AM - 10:00 PM", IsFeatured = true },
                new Event { Id = 2, Title = "Vaikunta Ekadashi", Description = "Sacred day dedicated to Lord Vishnu", EventDate = DateTime.Now.AddDays(60), EventTime = "4:00 AM - 12:00 PM", IsFeatured = true }
            };
            return View(events);
        }
    }
}