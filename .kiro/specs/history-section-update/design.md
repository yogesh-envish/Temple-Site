# Design Document: History Section Update

## Overview

This design document outlines the approach for updating the About Us page of the Sri Kaliyuga Ranganathar Temple website. The update will replace all existing content with a focused presentation of the temple's divine history and a temple image. The implementation will modify the existing ASP.NET Core MVC Razor view while maintaining the site's visual identity and responsive design.

## Architecture

### Current Architecture
- **Framework**: ASP.NET Core MVC
- **View Engine**: Razor
- **Frontend**: Bootstrap 5.3.0, Custom CSS
- **Fonts**: Cinzel (headings), Lora (body text), Google Fonts
- **Icons**: Font Awesome 6.4.0

### Modified Components
- **View**: `Views/Home/About.cshtml` - Complete content replacement
- **CSS**: `wwwroot/css/site.css` - Add new styles for history section
- **Controller**: `Controllers/HomeController.cs` - No changes required (simple view return)

## Components and Interfaces

### 1. About.cshtml View Structure

The redesigned About page will have a simplified structure:

```
About.cshtml
├── Page Header (existing breadcrumb navigation)
└── History Section
    ├── Temple Image Container
    │   └── Temple Image (temple-facade.jpg.jpeg)
    └── History Content Container
        └── Divine History Text
```

**Key Changes**:
- Remove all existing sections: mission-section, significance-section, temple-stats
- Remove the two-column layout with stats
- Create a single focused section with the temple image and history text
- Maintain the page header for navigation consistency

### 2. CSS Styling Strategy

**New CSS Classes to Add**:

```css
.history-section {
    /* Main container for the history content */
    - Padding: 5rem vertical, responsive
    - Background: White or subtle cream
    - Center-aligned content
}

.history-content {
    /* Container for the text content */
    - Max-width: 900px for readability
    - Centered with auto margins
    - Appropriate line-height for long-form text
}

.divine-text {
    /* Specific styling for the sacred text */
    - Font: Traditional, spiritual aesthetic
    - Font-size: 1.1rem - 1.2rem for emphasis
    - Line-height: 1.8 - 2.0 for readability
    - Color: Dark, dignified tone
    - Text-align: Justified or left-aligned
}

.history-temple-image {
    /* Styling for the temple image */
    - Max-width: 600px
    - Centered display
    - Rounded corners
    - Shadow for depth
    - Margin-bottom for spacing
}
```

### 3. Typography Selection

**Font Choice for Divine Text**:
The existing site uses:
- **Cinzel**: Elegant serif for headings (already loaded)
- **Lora**: Traditional serif for body text (already loaded)

**Recommendation**: Use **Lora** for the history text with increased font-size and line-height to convey spiritual significance while maintaining consistency with the existing design system.

**Alternative Consideration**: If a more traditional spiritual aesthetic is desired, consider adding:
- **Crimson Text**: Classical, book-like appearance
- **EB Garamond**: Traditional, elegant serif
- **Gentium Book Basic**: Readable, dignified

For this implementation, we'll use the existing **Lora** font with enhanced styling to avoid additional font loading and maintain site performance.

## Data Models

No new data models are required. The content will be static HTML within the Razor view.

**Content Storage**:
- **Location**: Hardcoded in `Views/Home/About.cshtml`
- **Format**: HTML paragraph elements with the divine text
- **Future Enhancement**: Could be moved to a CMS or database if dynamic content management is needed

## Error Handling

### Image Loading
- **Issue**: Temple image may fail to load
- **Solution**: 
  - Ensure `temple-facade.jpg.jpeg` exists in `wwwroot/images/`
  - Add alt text for accessibility
  - Consider adding a fallback image or placeholder

### Responsive Design
- **Issue**: Long text may not display well on mobile devices
- **Solution**:
  - Use responsive padding and margins
  - Adjust font-size for smaller screens
  - Ensure image scales appropriately
  - Test on multiple device sizes

### Browser Compatibility
- **Issue**: Font rendering may vary across browsers
- **Solution**:
  - Use web-safe font fallbacks
  - Test in major browsers (Chrome, Firefox, Safari, Edge)
  - Ensure CSS is compatible with modern browsers

## Testing Strategy

### Visual Testing
1. **Desktop Testing**
   - Verify layout on 1920px, 1366px, and 1024px widths
   - Check font rendering and readability
   - Ensure image displays correctly
   - Verify spacing and alignment

2. **Mobile Testing**
   - Test on 768px (tablet), 375px (mobile) widths
   - Verify text is readable without horizontal scrolling
   - Check image scaling
   - Test navigation breadcrumb

3. **Cross-Browser Testing**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)

### Content Verification
1. **Text Accuracy**
   - Verify the divine text matches the provided content exactly
   - Check for typos or formatting issues
   - Ensure all punctuation is preserved

2. **Accessibility Testing**
   - Verify alt text on image
   - Check heading hierarchy
   - Test with screen reader
   - Verify color contrast ratios

### Functional Testing
1. **Navigation**
   - Verify breadcrumb links work correctly
   - Test navigation from other pages
   - Ensure page loads without errors

2. **Performance**
   - Check page load time
   - Verify image optimization
   - Test on slower connections

## Implementation Approach

### Phase 1: Content Replacement
1. Back up existing `About.cshtml`
2. Remove all existing sections except page header
3. Add new history section structure
4. Insert temple image
5. Add divine history text content

### Phase 2: Styling
1. Add new CSS classes to `site.css`
2. Apply styling to history section
3. Ensure responsive behavior
4. Test across devices

### Phase 3: Testing & Refinement
1. Visual testing on multiple devices
2. Content accuracy verification
3. Accessibility testing
4. Performance optimization
5. Final review and approval

## Design Decisions and Rationales

### Decision 1: Single Column Layout
**Rationale**: A single-column, centered layout focuses attention on the sacred text and creates a meditative, respectful presentation appropriate for divine content.

### Decision 2: Use Existing Fonts
**Rationale**: Using the existing Lora font maintains design consistency, avoids additional HTTP requests, and ensures fast page loading while still providing an elegant, traditional appearance.

### Decision 3: Maintain Page Header
**Rationale**: Keeping the breadcrumb navigation maintains site-wide consistency and provides users with clear navigation context.

### Decision 4: Static Content in View
**Rationale**: For this initial implementation, hardcoding the content in the view is the simplest approach. If content needs to be updated frequently, it can be moved to a database or CMS in a future iteration.

### Decision 5: Centered Image Above Text
**Rationale**: Placing the temple image above the text creates a visual hierarchy where visitors first see the temple, then read its divine history, creating a natural flow of information.

## Responsive Breakpoints

```
- Desktop (>= 1200px): Full layout, larger fonts
- Tablet (768px - 1199px): Adjusted padding, slightly smaller fonts
- Mobile (< 768px): Stacked layout, optimized font sizes, reduced padding
```

## Color Scheme

Maintain existing temple color scheme:
- **Primary**: #FF6B35 (Saffron)
- **Secondary**: #D4AF37 (Gold)
- **Accent**: #8B0000 (Maroon)
- **Light**: #FFF8DC (Cream)
- **Dark**: #2C1810 (Dark Brown)
- **Text**: #333 (Dark Gray) for body text

## Accessibility Considerations

1. **Semantic HTML**: Use proper heading hierarchy (h1, h2)
2. **Alt Text**: Descriptive alt text for temple image
3. **Color Contrast**: Ensure text meets WCAG AA standards (4.5:1 ratio)
4. **Font Size**: Minimum 16px for body text
5. **Focus States**: Maintain visible focus indicators for keyboard navigation
6. **Screen Reader**: Ensure content is logically structured for screen readers
