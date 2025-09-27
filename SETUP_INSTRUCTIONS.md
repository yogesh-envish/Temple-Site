# Quick Setup Guide for Sri Balaji Temple Website

## Prerequisites
- .NET 8.0 SDK (Download from https://dotnet.microsoft.com/download)
- Visual Studio 2022 or VS Code
- SQL Server LocalDB (included with Visual Studio)

## Quick Start

1. **Open Command Prompt/Terminal in the Temple_Site folder**

2. **Restore packages and build**
   ```bash
   dotnet restore
   dotnet build
   ```

3. **Setup Database**
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

4. **Run the application**
   ```bash
   dotnet run
   ```

5. **Open your browser and go to:**
   - HTTP: http://localhost:5000
   - HTTPS: https://localhost:5001

## Adding Temple Images

Replace these placeholder images in `wwwroot/images/` folder:
- `balaji-idol.jpg` - Main Lord Balaji image (recommended: 800x600px)
- `temple-facade.jpg` - Temple building exterior (recommended: 1200x800px)  
- `temple-bg.jpg` - Hero section background (recommended: 1920x1080px)

## Customizing Temple Information

Edit these files to customize for your temple:

### 1. Temple Details (`appsettings.json`)
```json
{
  "TempleSettings": {
    "TempleName": "Your Temple Name",
    "Address": "Your Complete Address",
    "Phone": "Your Phone Number",
    "Email": "your-email@temple.org"
  }
}
```

### 2. Seva Pricing (`Controllers/SevaController.cs`)
Update the `GetSevaAmount` method with your seva prices.

### 3. Colors and Branding (`wwwroot/css/site.css`)
Modify CSS variables at the top of the file:
```css
:root {
    --temple-primary: #FF6B35;     /* Main temple color */
    --temple-secondary: #D4AF37;   /* Gold accent */
    --temple-accent: #8B0000;      /* Dark accent */
}
```

## Features Included

✅ **Home Page** - Hero section, timings, featured events
✅ **About Us** - Temple history and significance  
✅ **Seva Booking** - Online seva booking with pricing
✅ **Events** - Festival calendar and event listings
✅ **Donations** - Secure donation forms
✅ **Contact** - Temple info, map, contact form
✅ **Responsive Design** - Works on all devices
✅ **Traditional Design** - Indian temple aesthetics

## Next Steps for Production

1. **Add Real Images** - Replace placeholder images
2. **Payment Gateway** - Integrate Razorpay/PayPal/Stripe
3. **Email Service** - Setup SMTP for confirmations
4. **SSL Certificate** - For secure HTTPS
5. **Hosting** - Deploy to Azure/AWS/hosting provider

## Support

For technical support:
- Check the README.md file for detailed documentation
- Review the code comments for customization guidance
- Test all features before going live

**Ready to serve your devotees! 🙏**