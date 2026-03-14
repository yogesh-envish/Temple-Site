using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using TempleWebsite.Models;
using TempleWebsite.Services;

namespace TempleWebsite.Controllers
{
    public class HomeController : Controller
    {
        private readonly IEmailService _emailService;
        private readonly IMemoryCache _cache;
        private readonly TempleSettings _templeSettings;

        public HomeController(IEmailService emailService, IMemoryCache cache, IOptions<TempleSettings> templeOptions)
        {
            _emailService = emailService;
            _cache = cache;
            _templeSettings = templeOptions.Value;
        }

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

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Contact(ContactFormModel model)
        {
            // Honeypot check
            if (!string.IsNullOrEmpty(model.Trap))
            {
                ViewBag.SuccessMessage = "Your message has been sent. We will get back to you within 24 hours.";
                return View(new ContactFormModel());
            }

            // Rate-limit check: 5 per IP per hour
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var cacheKey = $"ratelimit_{ip}";
            _cache.TryGetValue(cacheKey, out int count);
            if (count >= 5)
            {
                ViewBag.ErrorMessage = "Too many requests. Please try again later.";
                return View(model);
            }
            var options = new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromHours(1));
            _cache.Set(cacheKey, count + 1, options);

            // ModelState validation
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Send email
            try
            {
                await _emailService.SendContactEmailAsync(model);
                ViewBag.SuccessMessage = "Your message has been sent. We will get back to you within 24 hours.";
                return View(new ContactFormModel());
            }
            catch (Exception)
            {
                ViewBag.ErrorMessage = $"We were unable to send your message. Please try again or contact us directly at {_templeSettings.Email}.";
                return View(model);
            }
        }

        public IActionResult Privacy()
        {
            return View();
        }
    }
}