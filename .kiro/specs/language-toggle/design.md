# Design Document: Language Toggle Feature

## Overview

The language toggle feature will enable users to switch between English and Tamil languages on the About Us page. The implementation will use client-side JavaScript for immediate language switching, with content stored in JSON format for easy maintenance and future expansion.

## Architecture

### Component Structure
```
Language Toggle System
├── UI Components
│   ├── Language Toggle Button (Navigation Bar)
│   └── Language Indicator Icons
├── Content Management
│   ├── Language Content JSON Files
│   └── Content Loading Service
├── State Management
│   ├── Language Preference Storage (localStorage)
│   └── Active Language Tracking
└── Translation Engine
    ├── Content Replacement Logic
    └── DOM Update Handlers
```

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Browser localStorage for persistence
- **Content Format**: JSON for language data
- **Framework**: ASP.NET Core MVC (existing)

## Components and Interfaces

### 1. Language Toggle UI Component

**Location**: Navigation bar (top-right corner)

**Design Specifications**:
```html
<div class="language-toggle">
    <button class="lang-btn active" data-lang="en">
        <span class="flag-icon">🇺🇸</span>
        <span class="lang-text">EN</span>
    </button>
    <button class="lang-btn" data-lang="ta">
        <span class="flag-icon">🇮🇳</span>
        <span class="lang-text">தமிழ்</span>
    </button>
</div>
```

**CSS Styling**:
- Consistent with existing temple theme colors
- Hover and active states for better UX
- Responsive design for mobile devices
- Accessibility-compliant focus indicators

### 2. Content Management System

**Language Content Structure**:
```json
{
  "en": {
    "pageTitle": "About Us",
    "breadcrumb": {
      "home": "Home",
      "about": "About Us"
    },
    "sectionTitle": "Divine History",
    "historyContent": "Hari Om Namo Narayanaya Namaha. Our Sri Adisesha Thiruthalam...",
    "imageAlt": "Front view of Sri Adisesha Thiruthalam, Kaliyuga Ranganathar Temple..."
  },
  "ta": {
    "pageTitle": "எங்களைப் பற்றி",
    "breadcrumb": {
      "home": "முகப்பு",
      "about": "எங்களைப் பற்றி"
    },
    "sectionTitle": "தெய்வீக வரலாறு",
    "historyContent": "ஹரி ஓம் நமோ நாராயணாய நமஹ. எங்கள் ஸ்ரீ ஆதிசேஷ திருத்தலம்...",
    "imageAlt": "ஸ்ரீ ஆதிசேஷ திருத்தலம், கலியுக ரங்கநாதர் கோயிலின் முன் காட்சி..."
  }
}
```

### 3. Translation Engine

**Core Functions**:
```javascript
class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.contentData = {};
        this.init();
    }

    async loadLanguageData() {
        // Load JSON content for both languages
    }

    switchLanguage(langCode) {
        // Update UI with selected language content
    }

    updateContent(langCode) {
        // Replace text content in DOM elements
    }

    saveLanguagePreference(langCode) {
        // Store preference in localStorage
    }

    getLanguagePreference() {
        // Retrieve stored language preference
    }
}
```

## Implementation Strategy

### Phase 1: Core Infrastructure
1. Create language content JSON files
2. Implement basic language switching logic
3. Add language toggle UI to navigation
4. Set up localStorage for persistence

### Phase 2: Content Integration
1. Extract existing About page content to JSON
2. Add Tamil translations
3. Implement content replacement system
4. Test language switching functionality

### Phase 3: Enhancement & Polish
1. Add smooth transition animations
2. Implement keyboard accessibility
3. Add loading states for content switching
4. Optimize for performance

## User Experience Flow

### Default Page Load
1. User navigates to About page
2. System checks localStorage for language preference
3. If no preference exists, default to English
4. Load appropriate content and display page
5. Show language toggle with current selection highlighted

### Language Switching
1. User clicks Tamil language button
2. System shows loading indicator (optional)
3. Content is replaced with Tamil translations
4. Language toggle updates to show Tamil as active
5. Preference is saved to localStorage
6. Page layout remains unchanged

## Testing Strategy

### Unit Tests
- Language switching logic
- Content replacement functions
- localStorage operations
- Error handling scenarios

### Integration Tests
- Full language switching workflow
- Content loading and display
- UI state management
- Cross-browser compatibility

### User Acceptance Tests
- Language toggle visibility and functionality
- Content accuracy in both languages
- Layout preservation during switching
- Accessibility compliance (WCAG 2.1 AA)