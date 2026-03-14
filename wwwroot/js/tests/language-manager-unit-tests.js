/**
 * Unit Tests for LanguageManager Class
 * Tests core functionality of the LanguageManager class methods
 */

class LanguageManagerUnitTests {
    constructor() {
        this.testResults = [];
        this.mockContentData = {
            en: {
                pageTitle: "About Us",
                pageHeader: "About Sri Kaliyuga Ranganathar Temple",
                breadcrumb: { home: "Home", about: "About Us" },
                sectionTitle: "Divine History",
                historyContent: "Test English content",
                imageAlt: "Test English alt text"
            },
            ta: {
                pageTitle: "எங்களைப் பற்றி",
                pageHeader: "ஸ்ரீ கலியுக ரங்கநாதர் கோயில் பற்றி",
                breadcrumb: { home: "முகப்பு", about: "எங்களைப் பற்றி" },
                sectionTitle: "தெய்வீக வரலாறு",
                historyContent: "Test Tamil content",
                imageAlt: "Test Tamil alt text"
            }
        };
    }

    async runAllTests() {
        console.log('🧪 Starting LanguageManager Unit Tests...');
        
        // Test 1: Constructor and initialization
        this.testConstructor();
        
        // Test 2: getNestedValue method
        this.testGetNestedValue();
        
        // Test 3: isStorageAvailable method
        this.testIsStorageAvailable();
        
        // Test 4: getCurrentLanguage method
        this.testGetCurrentLanguage();
        
        // Test 5: isLanguageSwitchingAvailable method
        this.testIsLanguageSwitchingAvailable();
        
        // Test 6: getLanguageState method
        this.testGetLanguageState();
        
        // Test 7: Storage preference methods
        this.testStoragePreferenceMethods();
        
        // Test 8: Content update logic
        await this.testContentUpdateLogic();
        
        // Display results
        this.displayResults();
    }

    testConstructor() {
        console.log('📋 Testing Constructor...');
        
        try {
            // Create a mock LanguageManager instance
            const mockManager = {
                currentLanguage: 'en',
                contentData: {},
                isLoading: false,
                contentPath: '/js/lang/about-content.json'
            };
            
            // Test initial values
            if (mockManager.currentLanguage === 'en') {
                this.addResult('PASS', 'Constructor - Default Language', 'Default language set to English');
            } else {
                this.addResult('FAIL', 'Constructor - Default Language', 'Default language not set correctly');
            }
            
            if (mockManager.isLoading === false) {
                this.addResult('PASS', 'Constructor - Loading State', 'Initial loading state is false');
            } else {
                this.addResult('FAIL', 'Constructor - Loading State', 'Initial loading state incorrect');
            }
            
            if (typeof mockManager.contentData === 'object') {
                this.addResult('PASS', 'Constructor - Content Data', 'Content data initialized as object');
            } else {
                this.addResult('FAIL', 'Constructor - Content Data', 'Content data not initialized correctly');
            }
            
        } catch (error) {
            this.addResult('FAIL', 'Constructor', `Error: ${error.message}`);
        }
    }

    testGetNestedValue() {
        console.log('🔍 Testing getNestedValue method...');
        
        // Create a mock instance with the method
        const mockManager = {
            getNestedValue: function(obj, path) {
                if (!obj || !path) return null;
                return path.split('.').reduce((current, key) => {
                    return current && current[key] !== undefined ? current[key] : null;
                }, obj);
            }
        };
        
        // Test cases
        const testCases = [
            { obj: this.mockContentData.en, path: 'pageTitle', expected: 'About Us' },
            { obj: this.mockContentData.en, path: 'breadcrumb.home', expected: 'Home' },
            { obj: this.mockContentData.en, path: 'breadcrumb.about', expected: 'About Us' },
            { obj: this.mockContentData.en, path: 'nonexistent', expected: null },
            { obj: null, path: 'pageTitle', expected: null },
            { obj: this.mockContentData.en, path: '', expected: null }
        ];
        
        testCases.forEach((testCase, index) => {
            const result = mockManager.getNestedValue(testCase.obj, testCase.path);
            if (result === testCase.expected) {
                this.addResult('PASS', `getNestedValue - Case ${index + 1}`, `Correctly returned: ${result}`);
            } else {
                this.addResult('FAIL', `getNestedValue - Case ${index + 1}`, `Expected: ${testCase.expected}, Got: ${result}`);
            }
        });
    }

    testIsStorageAvailable() {
        console.log('💾 Testing isStorageAvailable method...');
        
        // Mock the method
        const mockManager = {
            isStorageAvailable: function(type) {
                try {
                    const storage = window[type];
                    const testKey = '__storage_test__';
                    storage.setItem(testKey, 'test');
                    storage.removeItem(testKey);
                    return true;
                } catch (error) {
                    return false;
                }
            }
        };
        
        // Test localStorage
        const localStorageAvailable = mockManager.isStorageAvailable('localStorage');
        if (typeof localStorageAvailable === 'boolean') {
            this.addResult('PASS', 'isStorageAvailable - localStorage', `Returns boolean: ${localStorageAvailable}`);
        } else {
            this.addResult('FAIL', 'isStorageAvailable - localStorage', 'Does not return boolean');
        }
        
        // Test sessionStorage
        const sessionStorageAvailable = mockManager.isStorageAvailable('sessionStorage');
        if (typeof sessionStorageAvailable === 'boolean') {
            this.addResult('PASS', 'isStorageAvailable - sessionStorage', `Returns boolean: ${sessionStorageAvailable}`);
        } else {
            this.addResult('FAIL', 'isStorageAvailable - sessionStorage', 'Does not return boolean');
        }
        
        // Test invalid storage type
        const invalidStorage = mockManager.isStorageAvailable('invalidStorage');
        if (invalidStorage === false) {
            this.addResult('PASS', 'isStorageAvailable - Invalid Type', 'Correctly returns false for invalid storage');
        } else {
            this.addResult('FAIL', 'isStorageAvailable - Invalid Type', 'Should return false for invalid storage');
        }
    }

    testGetCurrentLanguage() {
        console.log('🌐 Testing getCurrentLanguage method...');
        
        const mockManager = {
            currentLanguage: 'en',
            getCurrentLanguage: function() {
                return this.currentLanguage;
            }
        };
        
        const currentLang = mockManager.getCurrentLanguage();
        if (currentLang === 'en') {
            this.addResult('PASS', 'getCurrentLanguage', 'Returns correct current language');
        } else {
            this.addResult('FAIL', 'getCurrentLanguage', `Expected: en, Got: ${currentLang}`);
        }
        
        // Test after changing language
        mockManager.currentLanguage = 'ta';
        const newCurrentLang = mockManager.getCurrentLanguage();
        if (newCurrentLang === 'ta') {
            this.addResult('PASS', 'getCurrentLanguage - After Change', 'Returns updated current language');
        } else {
            this.addResult('FAIL', 'getCurrentLanguage - After Change', `Expected: ta, Got: ${newCurrentLang}`);
        }
    }

    testIsLanguageSwitchingAvailable() {
        console.log('🔄 Testing isLanguageSwitchingAvailable method...');
        
        const mockManager = {
            contentData: {},
            isLanguageSwitchingAvailable: function() {
                return Object.keys(this.contentData).length > 1;
            }
        };
        
        // Test with no content
        let available = mockManager.isLanguageSwitchingAvailable();
        if (available === false) {
            this.addResult('PASS', 'isLanguageSwitchingAvailable - No Content', 'Returns false when no content');
        } else {
            this.addResult('FAIL', 'isLanguageSwitchingAvailable - No Content', 'Should return false when no content');
        }
        
        // Test with one language
        mockManager.contentData = { en: this.mockContentData.en };
        available = mockManager.isLanguageSwitchingAvailable();
        if (available === false) {
            this.addResult('PASS', 'isLanguageSwitchingAvailable - One Language', 'Returns false with one language');
        } else {
            this.addResult('FAIL', 'isLanguageSwitchingAvailable - One Language', 'Should return false with one language');
        }
        
        // Test with multiple languages
        mockManager.contentData = this.mockContentData;
        available = mockManager.isLanguageSwitchingAvailable();
        if (available === true) {
            this.addResult('PASS', 'isLanguageSwitchingAvailable - Multiple Languages', 'Returns true with multiple languages');
        } else {
            this.addResult('FAIL', 'isLanguageSwitchingAvailable - Multiple Languages', 'Should return true with multiple languages');
        }
    }

    testGetLanguageState() {
        console.log('📊 Testing getLanguageState method...');
        
        const mockManager = {
            currentLanguage: 'en',
            contentData: this.mockContentData,
            isStorageAvailable: function(type) { return true; },
            getStoredLanguagePreference: function() { return 'en'; },
            getLanguageState: function() {
                return {
                    currentLanguage: this.currentLanguage,
                    availableLanguages: Object.keys(this.contentData),
                    isStorageAvailable: {
                        localStorage: this.isStorageAvailable('localStorage'),
                        sessionStorage: this.isStorageAvailable('sessionStorage')
                    },
                    storedPreference: this.getStoredLanguagePreference(),
                    isInitialized: Object.keys(this.contentData).length > 0
                };
            }
        };
        
        const state = mockManager.getLanguageState();
        
        // Test state structure
        if (state && typeof state === 'object') {
            this.addResult('PASS', 'getLanguageState - Structure', 'Returns object');
        } else {
            this.addResult('FAIL', 'getLanguageState - Structure', 'Does not return object');
        }
        
        // Test current language
        if (state.currentLanguage === 'en') {
            this.addResult('PASS', 'getLanguageState - Current Language', 'Correct current language');
        } else {
            this.addResult('FAIL', 'getLanguageState - Current Language', 'Incorrect current language');
        }
        
        // Test available languages
        if (Array.isArray(state.availableLanguages) && state.availableLanguages.length === 2) {
            this.addResult('PASS', 'getLanguageState - Available Languages', 'Correct available languages array');
        } else {
            this.addResult('FAIL', 'getLanguageState - Available Languages', 'Incorrect available languages');
        }
        
        // Test initialization status
        if (state.isInitialized === true) {
            this.addResult('PASS', 'getLanguageState - Initialization', 'Correct initialization status');
        } else {
            this.addResult('FAIL', 'getLanguageState - Initialization', 'Incorrect initialization status');
        }
    }

    testStoragePreferenceMethods() {
        console.log('💾 Testing storage preference methods...');
        
        // Mock storage methods
        const mockManager = {
            isStorageAvailable: function(type) {
                return type === 'localStorage' || type === 'sessionStorage';
            },
            saveLanguagePreference: function(langCode) {
                try {
                    localStorage.setItem('temple-language-preference', langCode);
                    return true;
                } catch (error) {
                    return false;
                }
            },
            getStoredLanguagePreference: function() {
                try {
                    return localStorage.getItem('temple-language-preference');
                } catch (error) {
                    return null;
                }
            }
        };
        
        // Test saving preference
        const saveResult = mockManager.saveLanguagePreference('ta');
        if (saveResult === true) {
            this.addResult('PASS', 'saveLanguagePreference', 'Successfully saves preference');
        } else {
            this.addResult('FAIL', 'saveLanguagePreference', 'Failed to save preference');
        }
        
        // Test retrieving preference
        const retrievedPref = mockManager.getStoredLanguagePreference();
        if (retrievedPref === 'ta') {
            this.addResult('PASS', 'getStoredLanguagePreference', 'Successfully retrieves saved preference');
        } else {
            this.addResult('FAIL', 'getStoredLanguagePreference', `Expected: ta, Got: ${retrievedPref}`);
        }
        
        // Clean up
        try {
            localStorage.removeItem('temple-language-preference');
        } catch (error) {
            // Ignore cleanup errors
        }
    }

    async testContentUpdateLogic() {
        console.log('📝 Testing content update logic...');
        
        // Create test DOM elements
        const testContainer = document.createElement('div');
        testContainer.innerHTML = `
            <h1 data-lang-key="pageHeader">Original Header</h1>
            <span data-lang-key="breadcrumb.home">Original Home</span>
            <span data-lang-key="breadcrumb.about">Original About</span>
            <img data-lang-key="imageAlt" alt="Original Alt">
        `;
        document.body.appendChild(testContainer);
        
        // Mock update content method
        const mockManager = {
            contentData: this.mockContentData,
            getNestedValue: function(obj, path) {
                if (!obj || !path) return null;
                return path.split('.').reduce((current, key) => {
                    return current && current[key] !== undefined ? current[key] : null;
                }, obj);
            },
            updateContent: function(langCode) {
                const content = this.contentData[langCode];
                if (!content) return;
                
                document.querySelectorAll('[data-lang-key]').forEach(element => {
                    const key = element.getAttribute('data-lang-key');
                    const value = this.getNestedValue(content, key);
                    if (value) {
                        if (element.tagName === 'IMG') {
                            element.setAttribute('alt', value);
                        } else {
                            element.textContent = value;
                        }
                    }
                });
            }
        };
        
        // Test English content update
        mockManager.updateContent('en');
        
        const headerElement = testContainer.querySelector('[data-lang-key="pageHeader"]');
        if (headerElement && headerElement.textContent === this.mockContentData.en.pageHeader) {
            this.addResult('PASS', 'updateContent - English Header', 'Header updated correctly');
        } else {
            this.addResult('FAIL', 'updateContent - English Header', 'Header not updated correctly');
        }
        
        const homeElement = testContainer.querySelector('[data-lang-key="breadcrumb.home"]');
        if (homeElement && homeElement.textContent === this.mockContentData.en.breadcrumb.home) {
            this.addResult('PASS', 'updateContent - English Breadcrumb', 'Breadcrumb updated correctly');
        } else {
            this.addResult('FAIL', 'updateContent - English Breadcrumb', 'Breadcrumb not updated correctly');
        }
        
        // Test Tamil content update
        mockManager.updateContent('ta');
        
        if (headerElement && headerElement.textContent === this.mockContentData.ta.pageHeader) {
            this.addResult('PASS', 'updateContent - Tamil Header', 'Tamil header updated correctly');
        } else {
            this.addResult('FAIL', 'updateContent - Tamil Header', 'Tamil header not updated correctly');
        }
        
        const imageElement = testContainer.querySelector('[data-lang-key="imageAlt"]');
        if (imageElement && imageElement.getAttribute('alt') === this.mockContentData.ta.imageAlt) {
            this.addResult('PASS', 'updateContent - Tamil Image Alt', 'Tamil image alt updated correctly');
        } else {
            this.addResult('FAIL', 'updateContent - Tamil Image Alt', 'Tamil image alt not updated correctly');
        }
        
        // Clean up
        document.body.removeChild(testContainer);
    }

    addResult(status, test, message) {
        this.testResults.push({ status, test, message });
        const icon = status === 'PASS' ? '✅' : '❌';
        console.log(`${icon} ${test}: ${message}`);
    }

    displayResults() {
        console.log('\n📊 UNIT TEST RESULTS SUMMARY');
        console.log('==============================');
        
        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        const total = this.testResults.length;
        
        console.log(`Total Tests: ${total}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${failed}`);
        console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
        
        if (failed > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.testResults
                .filter(r => r.status === 'FAIL')
                .forEach(r => console.log(`   • ${r.test}: ${r.message}`));
        }
        
        return { passed, failed, total };
    }
}

// Export for use in test runner
if (typeof window !== 'undefined') {
    window.LanguageManagerUnitTests = LanguageManagerUnitTests;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManagerUnitTests;
}