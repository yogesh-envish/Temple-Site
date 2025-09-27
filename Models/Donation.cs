using System.ComponentModel.DataAnnotations;

namespace TempleWebsite.Models
{
    public class Donation
    {
        public int Id { get; set; }
        
        [Required]
        [Display(Name = "Donor Name")]
        public string DonorName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [Phone]
        public string Phone { get; set; } = string.Empty;
        
        [Required]
        [Range(1, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }
        
        [Display(Name = "Donation Purpose")]
        public string? Purpose { get; set; }
        
        [Display(Name = "Anonymous Donation")]
        public bool IsAnonymous { get; set; }
        
        public DateTime DonationDate { get; set; } = DateTime.Now;
        
        public string PaymentStatus { get; set; } = "Pending";
        
        public string? TransactionId { get; set; }
    }
}