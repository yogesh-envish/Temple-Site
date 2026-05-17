using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TempleWebsite.Models;
using TempleWebsite.Services;

namespace TempleWebsite.Controllers
{
    public class GalleryController : Controller
    {
        private readonly IGalleryService _galleryService;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<GalleryController> _logger;

        public GalleryController(
            IGalleryService galleryService,
            IWebHostEnvironment env,
            ILogger<GalleryController> logger)
        {
            _galleryService = galleryService;
            _env = env;
            _logger = logger;
        }

        // GET /Gallery
        public IActionResult Index()
        {
            var images = _galleryService.GetAll();

            var categories = images
                .Select(i => i.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            var viewModel = new GalleryIndexViewModel
            {
                Images = images,
                Categories = categories
            };

            return View(viewModel);
        }

        // POST /Gallery/Upload
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Upload(IFormFile? imageFile, string? title, string? description, string? category)
        {
            // Validate: no file
            if (imageFile == null || imageFile.Length == 0)
            {
                TempData["ErrorMessage"] = "Please select an image file.";
                return RedirectToAction(nameof(Index));
            }

            // Validate: wrong extension
            var extension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
            if (!GalleryConstants.AllowedExtensions.Contains(extension))
            {
                TempData["ErrorMessage"] = "Only .jpg, .jpeg, .png, .gif, and .webp files are allowed.";
                return RedirectToAction(nameof(Index));
            }

            // Validate: file > 5 MB
            if (imageFile.Length > GalleryConstants.MaxFileSizeBytes)
            {
                TempData["ErrorMessage"] = "Image file must not exceed 5 MB.";
                return RedirectToAction(nameof(Index));
            }

            // Validate: empty title
            if (string.IsNullOrWhiteSpace(title))
            {
                TempData["ErrorMessage"] = "Title is required.";
                return RedirectToAction(nameof(Index));
            }

            // Validate: empty category
            if (string.IsNullOrWhiteSpace(category))
            {
                TempData["ErrorMessage"] = "Category is required.";
                return RedirectToAction(nameof(Index));
            }

            // Generate GUID-prefixed filename
            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(imageFile.FileName)}";

            // Ensure wwwroot/images/gallery/ directory exists
            var galleryDir = Path.Combine(_env.WebRootPath, GalleryConstants.ImageDirectory);
            Directory.CreateDirectory(galleryDir);

            // Save file to wwwroot/images/gallery/{filename}
            var filePath = Path.Combine(galleryDir, fileName);
            try
            {
                using var stream = new FileStream(filePath, FileMode.Create);
                imageFile.CopyTo(stream);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to save uploaded image file '{FileName}'.", fileName);
                TempData["ErrorMessage"] = "Upload failed. Please try again.";
                return RedirectToAction(nameof(Index));
            }

            // Add metadata record via service
            _galleryService.Add(new GalleryImage
            {
                FileName = fileName,
                Title = title.Trim(),
                Description = string.IsNullOrWhiteSpace(description) ? null : description.Trim(),
                Category = category.Trim(),
                UploadedAt = DateTime.UtcNow
            });

            TempData["SuccessMessage"] = "Image uploaded successfully.";
            return RedirectToAction(nameof(Index));
        }

        // POST /Gallery/Delete
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(int id, string? fileName)
        {
            // Remove metadata record; returns false if not found
            var deleted = _galleryService.Delete(id);
            if (!deleted)
            {
                TempData["ErrorMessage"] = "Image not found.";
                return RedirectToAction(nameof(Index));
            }

            // Delete physical file (log warning if missing, do not fail)
            if (!string.IsNullOrWhiteSpace(fileName))
            {
                var filePath = Path.Combine(_env.WebRootPath, GalleryConstants.ImageDirectory, fileName);
                if (System.IO.File.Exists(filePath))
                {
                    try
                    {
                        System.IO.File.Delete(filePath);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Could not delete image file '{FilePath}' from disk.", filePath);
                    }
                }
                else
                {
                    _logger.LogWarning("Image file '{FilePath}' was not found on disk during delete.", filePath);
                }
            }

            TempData["SuccessMessage"] = "Image deleted successfully.";
            return RedirectToAction(nameof(Index));
        }
    }
}
