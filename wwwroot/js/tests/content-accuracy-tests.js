/**
 * Content Accuracy and Layout Preservation Tests
 * Tests content accuracy in both languages and layout preservation during switching
 */

class ContentAccuracyTests {
    constructor() {
        this.testResults = [];
        this.originalLayout = {};
    }

    async runAllTests() {
        console.log('📝 Starting Content Accuracy and Layout Preservation Tests...');
        
        // Wait for LanguageManager to be ready
        await this.waitForLanguageManager();
        
        // Test 1: English content accuracy
        this.testEnglishContentAccuracy();
        
        // Test 2: Tamil content accuracy
        await this.testTamilContentAccuracy();
        
        // Test 3: Content completeness
        this.testContentCompleteness();
        
        // Test 4: Layout preservation during language switch
        await this.testLayoutPreservation();
        
        // Test 5: Image alt text accuracy
        this.testImageAltTextAccuracy();
        
        // Test 6: Breadcrumb navigation accuracy
        this.testBreadcrumbAccuracy();
        
        // Test 7: Page title accuracy
        this.testPageTitleAccuracy();
        
        // Test 8: Text encoding and special characters
        this.testTextEncodingAndSpecialCharacters();
        
        // Display results
        this.displayResults();
    }

    async waitForLanguageManager(timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const checkManager = () => {
                if (window.languageManager && window.languageManager.getLanguageState) {
                    const state = window.languageManager.getLanguageState();
                    if (state.isInitialized) {
                        resolve();
                        return;
                    }
                }
                
                if (Date.now() - startTime > timeout) {
                    reject(new Error('LanguageManager not ready within timeout'));
                    return;
                }
                
                setTimeout(checkManager, 100);
            };
            
            checkManager();
        });
    }

    testEnglishContentAccuracy() {
        console.log('🔍 Testing English content accuracy...');
        
        if (!window.languageManager) {
            this.addResult('FAIL', 'English Content - Manager Missing', 'LanguageManager not available');
            return;
        }
        
        // Ensure we're in English mode
        const currentLang = window.languageManager.getCurrentLanguage();
        if (currentLang !== 'en') {
            document.querySelector('.lang-btn[data-lang="en"]')?.click();
        }
        
        // Check page header
        const pageHeader = document.querySelector('[data-lang-key="pageHeader"]');
        if (pageHeader && pageHeader.textContent.includes('Temple')) {
            this.addResult('PASS', 'English Content - Page Header', 'Page header contains English text');
        } else {
            this.addResult('FAIL', 'English Content - Page Header', 'Page header missing or incorrect');
        }
        
        // Check section title
        const sectionTitle = document.querySelector('[data-lang-key="sectionTitle"]');
        if (sectionTitle && sectionTitle.textContent.includes('History')) {
            this.addResult('PASS', 'English Content - Section Title', 'Section title is in English');
        } else {
            this.addResult('FAIL', 'English Content - Section Title', 'Section title missing or incorrect');
        }
        
        // Check history content
        const historyContent = document.querySelector('[data-lang-key="historyContent"]');
        if (historyContent && historyContent.textContent.length > 0) {
            this.addResult('PASS', 'English Content - History Text', 'History content is present');
        } else {
            this.addResult('FAIL', 'English Content - History Text', 'History content missing');
        }
    }

    async testTamilContentAccuracy() {
        console.log('🔍 Testing Tamil content accuracy...');
        
        if (!window.languageManager) {
            this.addResult('FAIL', 'Tamil Content - Manager Missing', 'LanguageManager not available');
            return;
        }
        
        // Switch to Tamil
        const tamilButton = document.querySelector('.lang-btn[data-lang="ta"]');
        if (tamilButton) {
            tamilButton.click();
            await this.delay(500); // Wait for content update
        }
        
        // Check page header contains Tamil script
        const pageHeader = document.querySelector('[data-lang-key="pageHeader"]');
        if (pageHeader && this.containsTamilScript(pageHeader.textContent)) {
            this.addResult('PASS', 'Tamil Content - Page Header', 'Page header contains Tamil script');
        } else {
            this.addResult('FAIL', 'Tamil Content - Page Header', 'Page header missing Tamil script');
        }
        
        // Check section title
        const sectionTitle = document.querySelector('[data-lang-key="sectionTitle"]');
        if (sectionTitle && this.containsTamilScript(sectionTitle.textContent)) {
            this.addResult('PASS', 'Tamil Content - Section Title', 'Section title is in Tamil');
        } else {
            this.addResult('FAIL', 'Tamil Content - Section Title', 'Section title missing Tamil script');
        }
        
        // Check history content
        const historyContent = document.querySelector('[data-lang-key="historyContent"]');
        if (historyContent && this.containsTamilScript(historyContent.textContent)) {
            this.addResult('PASS', 'Tamil Content - History Text', 'History content is in Tamil');
        } else {
            this.addResult('FAIL', 'Tamil Content - History Text', 'History content missing Tamil script');
        }
        
        // Switch back to English for other tests
        const englishButton = document.querySelector('.lang-btn[data-lang="en"]');
        if (englishButton) {
            englishButton.click();
            await this.delay(500);
        }
    }

    testContentCompleteness() {
        console.log('📋 Testing content completeness...');
        
        if (!window.languageManager) {
            this.addResult('FAIL', 'Content Completeness - Manager Missing', 'LanguageManager not available');
            return;
        }
        
        const contentData = window.languageManager.contentData;
        
        // Check English content completeness
        const requiredEnglishFields = ['pageTitle', 'pageHeader', 'breadcrumb', 'sectionTitle', 'historyContent', 'imageAlt'];
        let englishComplete = true;
        
        for (const field of requiredEnglishFields) {
            if (field === 'breadcrumb') {
                if (!contentData.en?.breadcrumb?.home || !contentData.en?.breadcrumb?.about) {
                    englishComplete = false;
                    break;
                }
            } else if (!contentData.en?.[field]) {
                englishComplete = false;
                break;
            }
        }
        
        if (englishComplete) {
            this.addResult('PASS', 'Content Completeness - English', 'All English content fields present');
        } else {
            this.addResult('FAIL', 'Content Completeness - English', 'Missing English content fields');
        }
        
        // Check Tamil content completeness
        let tamilComplete = true;
        
        for (const field of requiredEnglishFields) {
            if (field === 'breadcrumb') {
                if (!contentData.ta?.breadcrumb?.home || !contentData.ta?.breadcrumb?.about) {
                    tamilComplete = false;
                    break;
                }
            } else if (!contentData.ta?.[field]) {
                tamilComplete = false;
                break;
            }
        }
        
        if (tamilComplete) {
            this.addResult('PASS', 'Content Completeness - Tamil', 'All Tamil content fields present');
        } else {
            this.addResult('FAIL', 'Content Completeness - Tamil', 'Missing Tamil content fields');
        }
    }

    async testLayoutPreservation() {
        console.log('🎨 Testing layout preservation...');
        
        // Capture initial layout measurements
        this.captureLayoutMeasurements('en');
        
        // Switch to Tamil
        const tamilButton = document.querySelector('.lang-btn[data-lang="ta"]');
        if (tamilButton) {
            tamilButton.click();
            await this.delay(500);
        }
        
        // Capture Tamil layout measurements
        const tamilLayout = this.captureLayoutMeasurements('ta');
        
        // Compare layouts
        const layoutPreserved = this.compareLayouts(this.originalLayout, tamilLayout);
        
        if (layoutPreserved) {
            this.addResult('PASS', 'Layout Preservation - Structure', 'Layout structure preserved during language switch');
        } else {
            this.addResult('FAIL', 'Layout Preservation - Structure', 'Layout changed during language switch');
        }
        
        // Switch back to English
        const englishButton = document.querySelector('.lang-btn[data-lang="en"]');
        if (englishButton) {
            englishButton.click();
            await this.delay(500);
        }
    }

    testImageAltTextAccuracy() {
        console.log('🖼️ Testing image alt text accuracy...');
        
        const images = document.querySelectorAll('[data-lang-key="imageAlt"]');
        
        if (images.length === 0) {
            this.addResult('INFO', 'Image Alt Text - No Images', 'No images with data-lang-key found');
            return;
        }
        
        let allImagesHaveAlt = true;
        
        images.forEach(img => {
            const altText = img.getAttribute('alt');
            if (!altText || altText.trim() === '') {
                allImagesHaveAlt = false;
            }
        });
        
        if (allImagesHaveAlt) {
            this.addResult('PASS', 'Image Alt Text - Presence', 'All images have alt text');
        } else {
            this.addResult('FAIL', 'Image Alt Text - Presence', 'Some images missing alt text');
        }
    }

    testBreadcrumbAccuracy() {
        console.log('🍞 Testing breadcrumb navigation accuracy...');
        
        const breadcrumbHome = document.querySelector('[data-lang-key="breadcrumb.home"]');
        const breadcrumbAbout = document.querySelector('[data-lang-key="breadcrumb.about"]');
        
        if (breadcrumbHome && breadcrumbHome.textContent.trim() !== '') {
            this.addResult('PASS', 'Breadcrumb - Home Link', 'Home breadcrumb has content');
        } else {
            this.addResult('FAIL', 'Breadcrumb - Home Link', 'Home breadcrumb missing or empty');
        }
        
        if (breadcrumbAbout && breadcrumbAbout.textContent.trim() !== '') {
            this.addResult('PASS', 'Breadcrumb - About Link', 'About breadcrumb has content');
        } else {
            this.addResult('FAIL', 'Breadcrumb - About Link', 'About breadcrumb missing or empty');
        }
    }

    testPageTitleAccuracy() {
        console.log('📄 Testing page title accuracy...');
        
        const pageTitle = document.title;
        
        if (pageTitle && pageTitle.includes('Temple')) {
            this.addResult('PASS', 'Page Title - Content', 'Page title contains temple name');
        } else {
            this.addResult('FAIL', 'Page Title - Content', 'Page title missing or incorrect');
        }
        
        // Check if title updates with language
        const currentLang = window.languageManager?.getCurrentLanguage();
        if (currentLang === 'en' && pageTitle.includes('About')) {
            this.addResult('PASS', 'Page Title - Language Sync', 'Page title syncs with language');
        } else if (currentLang === 'ta' && this.containsTamilScript(pageTitle)) {
            this.addResult('PASS', 'Page Title - Language Sync', 'Page title syncs with Tamil');
        } else {
            this.addResult('INFO', 'Page Title - Language Sync', 'Could not verify title language sync');
        }
    }

    testTextEncodingAndSpecialCharacters() {
        console.log('🔤 Testing text encoding and special characters...');
        
        if (!window.languageManager) {
            this.addResult('FAIL', 'Text Encoding - Manager Missing', 'LanguageManager not available');
            return;
        }
        
        const contentData = window.languageManager.contentData;
        
        // Check Tamil content for proper UTF-8 encoding
        if (contentData.ta) {
            const tamilText = contentData.ta.historyContent || '';
            
            // Check for Tamil Unicode range (U+0B80 to U+0BFF)
            const hasTamilChars = /[\u0B80-\u0BFF]/.test(tamilText);
            
            if (hasTamilChars) {
                this.addResult('PASS', 'Text Encoding - Tamil UTF-8', 'Tamil text properly encoded in UTF-8');
            } else {
                this.addResult('FAIL', 'Text Encoding - Tamil UTF-8', 'Tamil text encoding issue');
            }
            
            // Check for mojibake or encoding errors
            const hasMojibake = /�/.test(tamilText);
            
            if (!hasMojibake) {
                this.addResult('PASS', 'Text Encoding - No Mojibake', 'No encoding errors detected');
            } else {
                this.addResult('FAIL', 'Text Encoding - No Mojibake', 'Encoding errors (mojibake) detected');
            }
        }
    }

    containsTamilScript(text) {
        // Tamil Unicode range: U+0B80 to U+0BFF
        return /[\u0B80-\u0BFF]/.test(text);
    }

    captureLayoutMeasurements(lang) {
        const measurements = {
            lang: lang,
            elements: {}
        };
        
        const elementsToMeasure = [
            '[data-lang-key="pageHeader"]',
            '[data-lang-key="sectionTitle"]',
            '[data-lang-key="historyContent"]',
            '.language-toggle'
        ];
        
        elementsToMeasure.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                const rect = element.getBoundingClientRect();
                measurements.elements[selector] = {
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    left: rect.left,
                    display: window.getComputedStyle(element).display,
                    position: window.getComputedStyle(element).position
                };
            }
        });
        
        if (lang === 'en') {
            this.originalLayout = measurements;
        }
        
        return measurements;
    }

    compareLayouts(layout1, layout2) {
        // Allow for small differences in height due to text wrapping
        const heightTolerance = 50; // pixels
        const positionTolerance = 5; // pixels
        
        for (const selector in layout1.elements) {
            if (!layout2.elements[selector]) {
                return false;
            }
            
            const elem1 = layout1.elements[selector];
            const elem2 = layout2.elements[selector];
            
            // Check display and position properties are the same
            if (elem1.display !== elem2.display || elem1.position !== elem2.position) {
                return false;
            }
            
            // Check width is approximately the same
            if (Math.abs(elem1.width - elem2.width) > positionTolerance) {
                return false;
            }
            
            // Check position is approximately the same
            if (Math.abs(elem1.left - elem2.left) > positionTolerance) {
                return false;
            }
        }
        
        return true;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    addResult(status, test, message) {
        this.testResults.push({ status, test, message });
        const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : 'ℹ️';
        console.log(`${icon} ${test}: ${message}`);
    }

    displayResults() {
        console.log('\n📊 CONTENT ACCURACY TEST RESULTS SUMMARY');
        console.log('=========================================');
        
        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        const info = this.testResults.filter(r => r.status === 'INFO').length;
        const total = this.testResults.length;
        
        console.log(`Total Tests: ${total}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${failed}`);
        console.log(`Info: ${info}`);
        console.log(`Success Rate: ${((passed / (total - info)) * 100).toFixed(1)}%`);
        
        if (failed > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.testResults
                .filter(r => r.status === 'FAIL')
                .forEach(r => console.log(`   • ${r.test}: ${r.message}`));
        }
        
        return { passed, failed, info, total };
    }
}

// Export for use in test runner
if (typeof window !== 'undefined') {
    window.ContentAccuracyTests = ContentAccuracyTests;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentAccuracyTests;
}
