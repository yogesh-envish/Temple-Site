using Microsoft.AspNetCore.Authentication.Cookies;
using TempleWebsite.Models;
using TempleWebsite.Services;
using OfficeOpenXml;

ExcelPackage.License.SetNonCommercialPersonal("TempleWebsite");

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
builder.Services.Configure<TempleSettings>(builder.Configuration.GetSection("TempleSettings"));
builder.Services.AddMemoryCache();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddTransient<IExcelParserService, ExcelParserService>();
builder.Services.AddTransient<IEventValidatorService, EventValidatorService>();
builder.Services.AddSingleton<IEventPersistenceService, EventPersistenceService>();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
