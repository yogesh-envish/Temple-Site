using System.ComponentModel.DataAnnotations;

namespace TempleWebsite.Models;

public class ContactFormModel
{
    [Required(ErrorMessage = "Full name is required.")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "A valid email address is required.")]
    [EmailAddress(ErrorMessage = "A valid email address is required.")]
    public string Email { get; set; } = string.Empty;

    [RegularExpression(@"^[\d\s\-\+\(\)]*$",
        ErrorMessage = "Phone number may only contain digits, spaces, hyphens, plus signs, and parentheses.")]
    public string? PhoneNumber { get; set; }

    [Required(ErrorMessage = "Subject is required.")]
    public string Subject { get; set; } = string.Empty;

    [Required(ErrorMessage = "Message is required.")]
    public string Message { get; set; } = string.Empty;

    // Honeypot - must remain empty for legitimate submissions
    public string? Trap { get; set; }
}
