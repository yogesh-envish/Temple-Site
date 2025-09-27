using System.ComponentModel.DataAnnotations;

namespace TempleWebsite.Models
{
    public class SevaBooking
    {
        public int Id { get; set; }
        
        [Required]
        [Display(Name = "Full Name")]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [Phone]
        public string Phone { get; set; } = string.Empty;
        
        [Required]
        [Display(Name = "Seva Type")]
        public string SevaType { get; set; } = string.Empty;
        
        [Required]
        [Display(Name = "Preferred Date")]
        public DateTime PreferredDate { get; set; }
        
        [Display(Name = "Special Instructions")]
        public string? SpecialInstructions { get; set; }
        
        public DateTime BookingDate { get; set; } = DateTime.Now;
        
        public decimal Amount { get; set; }
        
        public string Status { get; set; } = "Pending";
    }
}