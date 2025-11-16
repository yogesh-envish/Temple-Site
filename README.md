# Sri Balaji Temple Website

A modern, responsive website for Lord Ranganathar temple built with ASP.NET Core MVC, featuring traditional Indian design aesthetics and comprehensive temple management features.

## Features

### 🏛️ Core Pages
- **Home Page**: Hero section with temple image, daily timings, featured events, and services overview
- **About Us**: Temple history, significance, mission, and spiritual importance
- **Seva & Pooja**: Detailed seva descriptions with online booking system
- **Events & Festivals**: Event listings with annual festival calendar
- **Donation**: Secure online donation system with multiple payment options
- **Contact**: Temple information, timings, map integration, and contact form

### 🎨 Design Features
- Traditional Indian color scheme (saffron, gold, maroon)
- Elegant typography with spiritual fonts (Cinzel, Lora)
- Responsive design for all devices
- Smooth animations and hover effects
- Temple-inspired decorative elements

### 💻 Technical Features
- ASP.NET Core MVC 8.0 framework
- Entity Framework Core for data management
- Bootstrap 5 for responsive layout
- Font Awesome icons
- Google Fonts integration
- SEO optimized structure
- Accessibility compliant

### 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly navigation
- Optimized images and performance

## Project Structure

```
TempleWebsite/
├── Controllers/
│   ├── HomeController.cs
│   ├── SevaController.cs
│   ├── EventsController.cs
│   └── DonationController.cs
├── Models/
│   ├── SevaBooking.cs
│   ├── Donation.cs
│   └── Event.cs
├── Views/
│   ├── Shared/
│   │   └── _Layout.cshtml
│   ├── Home/
│   │   ├── Index.cshtml
│   │   ├── About.cshtml
│   │   └── Contact.cshtml
│   ├── Seva/
│   │   ├── Index.cshtml
│   │   └── Book.cshtml
│   ├── Events/
│   │   └── Index.cshtml
│   └── Donation/
│       └── Index.cshtml
├── wwwroot/
│   ├── css/
│   │   └── site.css
│   ├── js/
│   │   └── site.js
│   └── images/
├── Data/
│   └── ApplicationDbContext.cs
└── Program.cs
```

## Setup Instructions

### Prerequisites
- .NET 8.0 SDK
- SQL Server or SQL Server LocalDB
- Visual Studio 2022 or VS Code

### Installation

1. **Clone or download the project**
   ```bash
   cd Temple_Site
   ```

2. **Restore NuGet packages**
   ```bash
   dotnet restore
   ```

3. **Update database connection string**
   - Edit `appsettings.json`
   - Update the `DefaultConnection` string as needed

4. **Create and update database**
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

5. **Run the application**
   ```bash
   dotnet run
   ```

6. **Access the website**
   - Open browser and navigate to `https://localhost:5001`

## Configuration

### Database Configuration
The application uses Entity Framework Core with SQL Server. Update the connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Your_Connection_String_Here"
  }
}
```

### Temple Settings
Customize temple information in `appsettings.json`:

```json
{
  "TempleSettings": {
    "TempleName": "Your Temple Name",
    "Address": "Your Temple Address",
    "Phone": "Your Phone Number",
    "Email": "Your Email Address"
  }
}
```

## Customization

### Adding Temple Images
1. Add images to `wwwroot/images/` folder
2. Update image references in views:
   - `balaji-idol.jpg` - Main deity image for hero section
   - `temple-facade.jpg` - Temple building image for about page
   - `temple-bg.jpg` - Background image for hero section

### Seva Types and Pricing
Update seva information in `SevaController.cs`:

```csharp
private decimal GetSevaAmount(string sevaType)
{
    return sevaType switch
    {
        "YourSeva" => YourAmount,
        // Add more seva types
        _ => DefaultAmount
    };
}
```

### Color Scheme
Modify CSS variables in `site.css`:

```css
:root {
    --temple-primary: #FF6B35;     /* Your primary color */
    --temple-secondary: #D4AF37;   /* Your secondary color */
    --temple-accent: #8B0000;      /* Your accent color */
}
```

## Features to Implement

### Payment Integration
- Integrate with payment gateways (Razorpay, PayPal, Stripe)
- Add payment confirmation and receipt generation
- Implement donation tracking and reporting

### Advanced Features
- User authentication and profiles
- Seva booking management system
- Event registration system
- Newsletter subscription
- Multi-language support
- Admin panel for content management

### SEO Enhancements
- Add meta tags for all pages
- Implement structured data markup
- Add sitemap.xml
- Optimize images with alt tags
- Add Open Graph tags for social sharing

## Security Considerations

1. **Input Validation**: All forms include server-side validation
2. **CSRF Protection**: Anti-forgery tokens implemented
3. **SQL Injection**: Entity Framework prevents SQL injection
4. **XSS Protection**: Razor engine provides automatic encoding

## Performance Optimization

1. **Image Optimization**: Compress and optimize all images
2. **CSS/JS Minification**: Minify CSS and JavaScript files
3. **Caching**: Implement response caching for static content
4. **CDN**: Use CDN for Bootstrap and Font Awesome

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for educational and religious purposes. Feel free to use and modify for your temple's needs.

## Support

For support and questions:
- Email: support@templename.org
- Phone: +1 (555) 123-4567

## Acknowledgments

- Bootstrap team for the responsive framework
- Font Awesome for the icon library
- Google Fonts for typography
- ASP.NET Core team for the excellent framework

---

**Om Namo Venkatesaya** 🙏
