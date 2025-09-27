using System.ComponentModel.DataAnnotations;

namespace TempleWebsite.Models
{
    public class Event
    {
        public int Id { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [Display(Name = "Event Date")]
        public DateTime EventDate { get; set; }
        
        [Display(Name = "End Date")]
        public DateTime? EndDate { get; set; }
        
        [Display(Name = "Event Time")]
        public string? EventTime { get; set; }
        
        [Display(Name = "Image URL")]
        public string? ImageUrl { get; set; }
        
        [Display(Name = "Is Featured")]
        public bool IsFeatured { get; set; }
        
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}