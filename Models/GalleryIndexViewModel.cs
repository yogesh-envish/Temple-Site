namespace TempleWebsite.Models
{
    public class GalleryIndexViewModel
    {
        public List<GalleryImage> Images { get; set; } = new();
        public List<string> Categories { get; set; } = new();
    }
}
