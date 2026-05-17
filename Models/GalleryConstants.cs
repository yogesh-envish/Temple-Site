namespace TempleWebsite.Models
{
    public static class GalleryConstants
    {
        public const string CacheKey = "GalleryImages";
        public const string ImageDirectory = "images/gallery";
        public const string DataFile = "gallery.json";
        public const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

        public static readonly string[] AllowedExtensions =
            { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

        public static readonly string[] PredefinedCategories =
            { "Ranganathar", "Shiva", "Ganesha", "Murugan", "Devi", "General" };
    }
}
