using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;
using TempleWebsite.Models;
using TempleWebsite.Services;

namespace TempleWebsite.Controllers
{
    public class EventsController : Controller
    {
        private readonly IMemoryCache _cache;
        private readonly IExcelParserService _excelParserService;
        private readonly IEventValidatorService _eventValidatorService;
        private readonly IEventPersistenceService _persistence;

        public EventsController(
            IMemoryCache cache,
            IExcelParserService excelParserService,
            IEventValidatorService eventValidatorService,
            IEventPersistenceService persistence)
        {
            _cache = cache;
            _excelParserService = excelParserService;
            _eventValidatorService = eventValidatorService;
            _persistence = persistence;
        }

        public IActionResult Index()
        {
            if (_cache.TryGetValue(EventsConstants.EventsCacheKey, out List<Event>? cachedEvents) && cachedEvents != null)
                return View(cachedEvents);

            // Cache miss — try loading from disk (survives restarts)
            var persisted = _persistence.Load();
            if (persisted != null)
            {
                _cache.Set(EventsConstants.EventsCacheKey, persisted,
                    new MemoryCacheEntryOptions { SlidingExpiration = TimeSpan.FromHours(24) });
                return View(persisted);
            }

            return View(new List<Event>());
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Upload(IFormFile? file)
        {
            if (file == null || file.Length == 0)
            {
                TempData["ErrorMessage"] = "Please select a file to upload.";
                return RedirectToAction(nameof(Index));
            }

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (extension != ".xls" && extension != ".xlsx")
            {
                TempData["ErrorMessage"] = "Only .xls and .xlsx files are supported.";
                return RedirectToAction(nameof(Index));
            }

            if (file.Length > 10 * 1024 * 1024)
            {
                TempData["ErrorMessage"] = "File size must not exceed 10 MB.";
                return RedirectToAction(nameof(Index));
            }

            IReadOnlyList<Models.RawEventRow> rows;
            try
            {
                rows = _excelParserService.Parse(file.OpenReadStream());
            }
            catch (ExcelParseException)
            {
                TempData["ErrorMessage"] = "The uploaded file could not be read. Please ensure it is a valid Excel file.";
                return RedirectToAction(nameof(Index));
            }

            var result = _eventValidatorService.Validate(rows);

            if (!result.IsSuccess)
            {
                TempData["ErrorMessages"] = JsonSerializer.Serialize(
                    result.Errors.Select(e => e.Message).ToList());
                return RedirectToAction(nameof(Index));
            }

            var sortedEvents = result.ValidEvents.OrderBy(e => e.EventDate).ToList();

            var cacheOptions = new MemoryCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromHours(24)
            };
            _cache.Set(EventsConstants.EventsCacheKey, sortedEvents, cacheOptions);
            _persistence.Save(sortedEvents); // persist to disk so events survive restarts

            TempData["SuccessMessage"] = $"{result.ValidEvents.Count} event(s) loaded successfully.";
            return RedirectToAction(nameof(Index));
        }
    }
}
