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
        private readonly IEventPersistenceService _persistence;

        public HomeController(IEmailService emailService, IMemoryCache cache, IOptions<TempleSettings> templeOptions, IEventPersistenceService persistence)
        {
            _emailService = emailService;
            _cache = cache;
            _templeSettings = templeOptions.Value;
            _persistence = persistence;
        }

        public IActionResult Index()
        {
            List<Event> featuredEvents;

            if (_cache.TryGetValue(EventsConstants.EventsCacheKey, out List<Event>? cachedEvents) && cachedEvents != null)
            {
                featuredEvents = cachedEvents
                    .Where(e => e.EventDate >= DateTime.Today)
                    .OrderBy(e => e.EventDate)
                    .Take(3)
                    .ToList();
            }
            else
            {
                var persisted = _persistence.Load();
                if (persisted != null)
                {
                    _cache.Set(EventsConstants.EventsCacheKey, persisted,
                        new MemoryCacheEntryOptions { SlidingExpiration = TimeSpan.FromHours(24) });
                    featuredEvents = persisted
                        .Where(e => e.EventDate >= DateTime.Today)
                        .OrderBy(e => e.EventDate)
                        .Take(3)
                        .ToList();
                }
                else
                {
                    featuredEvents = new List<Event>();
                }
            }

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