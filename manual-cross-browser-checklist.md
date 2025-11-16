# Manual Cross-Browser Testing Checklist
## History Section Update - Sri Kaliyuga Ranganathar Temple

**Date:** November 16, 2025  
**Tester:** _________________  
**Requirements:** 2.1, 2.2

---

## Testing Instructions

1. Start the application: `dotnet run`
2. Test in each browser listed below
3. Check each item and mark as ✓ (Pass) or ✗ (Fail)
4. Add notes for any issues found

---

## Browser 1: Google Chrome (Latest)

**Version:** _________________  
**Date Tested:** _________________

### Font Rendering
- [ ] Divine history text displays in Lora font
- [ ] Section title "Divine History" displays in Cinzel font
- [ ] Font size appears appropriate (readable, not too small/large)
- [ ] Line spacing provides good readability
- [ ] Text is smooth and anti-aliased
- [ ] No font loading flicker or FOUT (Flash of Unstyled Text)

### Visual Styling
- [ ] Page header gradient displays correctly (orange to gold)
- [ ] Temple image has rounded corners
- [ ] Temple image has shadow effect
- [ ] Text color is dark gray (#333)
- [ ] Background is white
- [ ] Breadcrumb navigation is visible and styled

### Layout
- [ ] Two-column layout on desktop (image left, text right)
- [ ] Content is centered and properly aligned
- [ ] Appropriate spacing between elements
- [ ] No overlapping content
- [ ] No horizontal scrolling

### Responsive Design
- [ ] Desktop (1920px): Layout looks good
- [ ] Desktop (1366px): Layout looks good
- [ ] Desktop (1024px): Layout looks good
- [ ] Tablet (768px): Stacked layout, readable
- [ ] Mobile (375px): Stacked layout, no horizontal scroll

### Functionality
- [ ] Page loads without errors (check console - F12)
- [ ] Breadcrumb links work
- [ ] Image loads correctly
- [ ] No JavaScript errors in console

**Notes:**
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

**Overall Status:** [ ] PASS  [ ] FAIL

---

## Browser 2: Mozilla Firefox (Latest)

**Version:** _________________  
**Date Tested:** _________________

### Font Rendering
- [ ] Divine history text displays in Lora font
- [ ] Section title "Divine History" displays in Cinzel font
- [ ] Font size appears appropriate (readable, not too small/large)
- [ ] Line spacing provides good readability
- [ ] Text is smooth and anti-aliased
- [ ] No font loading flicker or FOUT

### Visual Styling
- [ ] Page header gradient displays correctly (orange to gold)
- [ ] Temple image has rounded corners
- [ ] Temple image has shadow effect
- [ ] Text color is dark gray (#333)
- [ ] Background is white
- [ ] Breadcrumb navigation is visible and styled

### Layout
- [ ] Two-column layout on desktop (image left, text right)
- [ ] Content is centered and properly aligned
- [ ] Appropriate spacing between elements
- [ ] No overlapping content
- [ ] No horizontal scrolling

### Responsive Design
- [ ] Desktop (1920px): Layout looks good
- [ ] Desktop (1366px): Layout looks good
- [ ] Desktop (1024px): Layout looks good
- [ ] Tablet (768px): Stacked layout, readable
- [ ] Mobile (375px): Stacked layout, no horizontal scroll

### Functionality
- [ ] Page loads without errors (check console - F12)
- [ ] Breadcrumb links work
- [ ] Image loads correctly
- [ ] No JavaScript errors in console

**Notes:**
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

**Overall Status:** [ ] PASS  [ ] FAIL

---

## Browser 3: Apple Safari (Latest)

**Version:** _________________  
**Platform:** [ ] macOS  [ ] iOS  
**Date Tested:** _________________

### Font Rendering
- [ ] Divine history text displays in Lora font
- [ ] Section title "Divine History" displays in Cinzel font
- [ ] Font size appears appropriate (readable, not too small/large)
- [ ] Line spacing provides good readability
- [ ] Text is smooth and anti-aliased
- [ ] No font loading flicker or FOUT

### Visual Styling
- [ ] Page header gradient displays correctly (orange to gold)
- [ ] Temple image has rounded corners
- [ ] Temple image has shadow effect
- [ ] Text color is dark gray (#333)
- [ ] Background is white
- [ ] Breadcrumb navigation is visible and styled

### Layout
- [ ] Two-column layout on desktop (image left, text right)
- [ ] Content is centered and properly aligned
- [ ] Appropriate spacing between elements
- [ ] No overlapping content
- [ ] No horizontal scrolling

### Responsive Design
- [ ] Desktop (1920px): Layout looks good
- [ ] Desktop (1366px): Layout looks good
- [ ] Desktop (1024px): Layout looks good
- [ ] Tablet (768px): Stacked layout, readable
- [ ] Mobile (375px): Stacked layout, no horizontal scroll

### Functionality
- [ ] Page loads without errors (check console)
- [ ] Breadcrumb links work
- [ ] Image loads correctly
- [ ] No JavaScript errors in console

**Notes:**
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

**Overall Status:** [ ] PASS  [ ] FAIL

---

## Browser 4: Microsoft Edge (Latest)

**Version:** _________________  
**Date Tested:** _________________

### Font Rendering
- [ ] Divine history text displays in Lora font
- [ ] Section title "Divine History" displays in Cinzel font
- [ ] Font size appears appropriate (readable, not too small/large)
- [ ] Line spacing provides good readability
- [ ] Text is smooth and anti-aliased
- [ ] No font loading flicker or FOUT

### Visual Styling
- [ ] Page header gradient displays correctly (orange to gold)
- [ ] Temple image has rounded corners
- [ ] Temple image has shadow effect
- [ ] Text color is dark gray (#333)
- [ ] Background is white
- [ ] Breadcrumb navigation is visible and styled

### Layout
- [ ] Two-column layout on desktop (image left, text right)
- [ ] Content is centered and properly aligned
- [ ] Appropriate spacing between elements
- [ ] No overlapping content
- [ ] No horizontal scrolling

### Responsive Design
- [ ] Desktop (1920px): Layout looks good
- [ ] Desktop (1366px): Layout looks good
- [ ] Desktop (1024px): Layout looks good
- [ ] Tablet (768px): Stacked layout, readable
- [ ] Mobile (375px): Stacked layout, no horizontal scroll

### Functionality
- [ ] Page loads without errors (check console - F12)
- [ ] Breadcrumb links work
- [ ] Image loads correctly
- [ ] No JavaScript errors in console

**Notes:**
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

**Overall Status:** [ ] PASS  [ ] FAIL

---

## Font Rendering Comparison

Take screenshots of the divine history text in each browser and compare:

| Browser | Font Weight | Clarity | Anti-aliasing | Overall |
|---------|-------------|---------|---------------|---------|
| Chrome  | ___________ | _______ | _____________ | _______ |
| Firefox | ___________ | _______ | _____________ | _______ |
| Safari  | ___________ | _______ | _____________ | _______ |
| Edge    | ___________ | _______ | _____________ | _______ |

**Are fonts consistent across browsers?** [ ] YES  [ ] NO

**Notes on font differences:**
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

---

## Automated Test Results

Run the automated test page in each browser: `http://localhost:5000/test-cross-browser.html`

| Browser | Tests Passed | Pass Rate | Status |
|---------|--------------|-----------|--------|
| Chrome  | _____ / 10   | _____%    | ______ |
| Firefox | _____ / 10   | _____%    | ______ |
| Safari  | _____ / 10   | _____%    | ______ |
| Edge    | _____ / 10   | _____%    | ______ |

---

## Issues Found

List any issues discovered during testing:

### Issue 1
**Browser:** _________________  
**Severity:** [ ] Critical  [ ] Major  [ ] Minor  
**Description:**
```
_________________________________________________________________
_________________________________________________________________
```

### Issue 2
**Browser:** _________________  
**Severity:** [ ] Critical  [ ] Major  [ ] Minor  
**Description:**
```
_________________________________________________________________
_________________________________________________________________
```

### Issue 3
**Browser:** _________________  
**Severity:** [ ] Critical  [ ] Major  [ ] Minor  
**Description:**
```
_________________________________________________________________
_________________________________________________________________
```

---

## Final Summary

**Total Browsers Tested:** _____  
**Browsers Passed:** _____  
**Browsers Failed:** _____  

**Requirements Status:**
- [ ] Requirement 2.1: Spiritual font aesthetic achieved
- [ ] Requirement 2.2: Cross-device readability confirmed

**Overall Test Status:** [ ] PASS  [ ] FAIL

**Recommendations:**
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

**Tester Signature:** _________________  
**Date:** _________________

---

## Quick Reference: How to Test

### Open Browser DevTools
- **Chrome/Edge:** Press F12 or Ctrl+Shift+I
- **Firefox:** Press F12 or Ctrl+Shift+I
- **Safari:** Enable Developer menu in Preferences, then press Cmd+Option+I

### Test Responsive Design
1. Open DevTools (F12)
2. Click "Toggle Device Toolbar" icon (or Ctrl+Shift+M)
3. Select different device sizes from dropdown
4. Or manually enter width values (1920, 1366, 1024, 768, 375)

### Check Console for Errors
1. Open DevTools (F12)
2. Click "Console" tab
3. Look for red error messages
4. Verify no errors are present

### Verify Font Loading
1. Open DevTools (F12)
2. Go to "Network" tab
3. Reload page
4. Filter by "Font" or search for "Lora" and "Cinzel"
5. Verify fonts loaded successfully (status 200)

### Take Screenshots
- **Windows:** Win+Shift+S (Snipping Tool)
- **macOS:** Cmd+Shift+4
- **Browser:** Right-click > Inspect > Device Toolbar > Screenshot icon
