using TempleWebsite.Models;

namespace TempleWebsite.Services
{
    public interface IGalleryService
    {
        /// <summary>Returns all gallery images, loading from disk if cache is cold.</summary>
        List<GalleryImage> GetAll();

        /// <summary>Adds a new image record, persists to disk, and updates the cache.</summary>
        void Add(GalleryImage image);

        /// <summary>
        /// Removes the image record with the given id, persists to disk, and invalidates the cache.
        /// Returns false if no record with that id exists.
        /// </summary>
        bool Delete(int id);
    }
}
