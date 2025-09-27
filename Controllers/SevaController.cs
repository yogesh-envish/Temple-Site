using Microsoft.AspNetCore.Mvc;
using TempleWebsite.Models;

namespace TempleWebsite.Controllers
{
    public class SevaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Book()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Book(SevaBooking booking)
        {
            if (ModelState.IsValid)
            {
                booking.Amount = GetSevaAmount(booking.SevaType);
                TempData["Success"] = "Your seva booking has been submitted successfully. We will contact you soon.";
                return RedirectToAction(nameof(Index));
            }
            return View(booking);
        }

        private decimal GetSevaAmount(string sevaType)
        {
            return sevaType switch
            {
                "Suprabhatam" => 51,
                "Archana" => 21,
                "Abhishekam" => 101,
                "Sahasranamam" => 151,
                "Kalyanam" => 501,
                "Brahmotsavam" => 1001,
                _ => 21
            };
        }
    }
}