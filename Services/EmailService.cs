using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using TempleWebsite.Models;

namespace TempleWebsite.Services;

public class EmailService : IEmailService
{
    private const string TempleEmail = "kalkiavatharasthalam@gmail.com";

    private readonly SmtpSettings _smtp;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IOptions<SmtpSettings> smtpOptions, ILogger<EmailService> logger)
    {
        _smtp = smtpOptions.Value;
        _logger = logger;
    }

    public async Task SendContactEmailAsync(ContactFormModel model)
    {
        try
        {
            using var message = new MailMessage();
            message.From = new MailAddress(_smtp.SenderEmail, _smtp.SenderName);
            message.To.Add(new MailAddress(TempleEmail));
            message.ReplyToList.Add(new MailAddress(model.Email));
            message.Subject = $"Contact Form: {model.Subject}";
            message.Body = ComposeBody(model);
            message.IsBodyHtml = false;

            using var client = new SmtpClient(_smtp.Host, _smtp.Port);
            client.EnableSsl = true;

            if (!string.IsNullOrEmpty(_smtp.Password))
            {
                client.Credentials = new NetworkCredential(_smtp.Username, _smtp.Password);
            }

            await client.SendMailAsync(message);

            _logger.LogInformation("Contact email sent at {Timestamp}. Status: success.", DateTimeOffset.UtcNow);
        }
        catch (Exception ex)
        {
            _logger.LogError("Contact email failed at {Timestamp}. Status: failure. Type: {ExType} Msg: {ExMsg}", 
                DateTimeOffset.UtcNow, ex.GetType().Name, ex.Message);
            throw new InvalidOperationException("Failed to send contact email via SMTP.", ex);
        }
    }

    private static string ComposeBody(ContactFormModel model)
    {
        var phone = string.IsNullOrWhiteSpace(model.PhoneNumber) ? "(not provided)" : model.PhoneNumber;

        return $"""
            Name:    {model.FullName}
            Email:   {model.Email}
            Phone:   {phone}
            Subject: {model.Subject}

            {model.Message}
            """;
    }
}
