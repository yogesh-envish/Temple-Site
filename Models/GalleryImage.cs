using System.ComponentModel.DataAnnotations;

namespace TempleWebsite.Models
{
    public class GalleryImage
    {
        public int Id { get; set; }

        /// <summary>Stored filename under wwwroot/images/gallery/ (GUID-prefixed).</summary>
        public string FileName { get; set; } = string.Empty;

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
