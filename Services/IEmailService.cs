using TempleWebsite.Models;

namespace TempleWebsite.Services;

public interface IEmailService
{
    Task SendContactEmailAsync(ContactFormModel model);
}
