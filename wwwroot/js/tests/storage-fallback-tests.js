/**
 * Storage Fallback Tests for Language Toggle Feature
 * Tests localStorage functionality and fallback scenarios
 */

class StorageFallbackTests {
    constructor() {
        this.testResults = [];
        this.originalLocalStorage = null;
        this.originalSessionStorage = null;
    }

    async runAllTests() {
        console.log('💾 Starting Storage Fallback Tests...');
        
        // Test 1: localStorage availability
        this.testLocalStorageAvailability();
        
        // Test 2: sessionStorage availability
        this.testSessionStorageAvailability();
        
        // Test 3: localStorage fallback to sessionStorage
        await this.testLocalStorageToSessionStorageFallback();
        
        // Test 4: sessionStorage fallback to cookies
        await this.testSessionStorageToCookieFallback();
        
        // Test 5: Cookie storage and retrieval
        this.testCookieStorageAndRetrieval();
        
        // Test 6: Storage quota exceeded handling
        await this.testStorageQuotaExceeded();
        
        // Test 7: Private browsing mode detection
        this.testPrivateBrowsingMode();
        
        // Test 8: Storage persistence across page reloads
        await this.testStoragePersistence();
        
        // Display results
        this.displayResults();
    }

    testLocalStorageAvailability() {
        console.log('🔍 Testing localStorage availability...');
        
        try {
            const testKey = '__test_local_storage__';
            const testValue = 'test_value_' + Date.now();
            
            localStorage.setItem(testKey, testValue);
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            if (retrieved === testValue) {
                this.addResult('PASS', 'localStorage - Availability', 'localStorage is available and working');
            } else {
                this.addResult('FAIL', 'localStorage - Availability', 'localStorage read/write mismatch');
            }
        } catch (error) {
            this.addResult('FAIL', 'localStorage - Availability', `localStorage not available: ${error.message}`);
        }
    }

    testSessionStorageAvailability() {
        console.log('🔍 Testing sessionStorage availability...');
        
        try {
            const testKey = '__test_session_storage__';
            const testValue = 'test_value_' + Date.now();
            
            sessionStorage.setItem(testKey, testValue);
            const retrieved = sessionStorage.getItem(testKey);
            sessionStorage.removeItem(testKey);
            
            if (retrieved === testValue) {
                this.addResult('PASS', 'sessionStorage - Availability', 'sessionStorage is available and working');
            } else {
                this.addResult('FAIL', 'sessionStorage - Availability', 'sessionStorage read/write mismatch');
            }
        } catch (error) {
            this.addResult('FAIL', 'sessionStorage - Availability', `sessionStorage not available: ${error.message}`);
        }
    }

    async testLocalStorageToSessionStorageFallback() {
        console.log('🔄 Testing localStorage to sessionStorage fallback...');
        
        // Simulate localStorage failure
        const originalSetItem = Storage.prototype.setItem;
        let localStorageFailed = false;
        
        try {
            // Mock localStorage to throw error
            Storage.prototype.setItem = function(key, value) {
                if (this === localStorage) {
                    throw new Error('localStorage quota exceeded');
                }
                return originalSetItem.call(this, key, value);
            };
            
            // Test LanguageManager's fallback behavior
            if (window.languageManager) {
                try {
                    window.languageManager.saveLanguagePreference('ta');
                    
                    // Check if it fell back to sessionStorage
                    const sessionValue = sessionStorage.getItem('temple-language-preference');
                    if (sessionValue === 'ta') {
                        this.addResult('PASS', 'Fallback - localStorage to sessionStorage', 'Successfully fell back to sessionStorage');
                    } else {
                        this.addResult('FAIL', 'Fallback - localStorage to sessionStorage', 'Fallback did not work correctly');
                    }
                } catch (error) {
                    this.addResult('FAIL', 'Fallback - localStorage to sessionStorage', `Error: ${error.message}`);
                }
            } else {
                this.addResult('INFO', 'Fallback - localStorage to sessionStorage', 'LanguageManager not available for testing');
            }
            
        } finally {
            // Restore original setItem
            Storage.prototype.setItem = originalSetItem;
            
            // Clean up
            try {
                sessionStorage.removeItem('temple-language-preference');
            } catch (e) {}
        }
    }

    async testSessionStorageToCookieFallback() {
        console.log('🔄 Testing sessionStorage to cookie fallback...');
        
        // Simulate both localStorage and sessionStorage failure
        const originalSetItem = Storage.prototype.setItem;
        
        try {
            // Mock both storages to throw errors
            Storage.prototype.setItem = function(key, value) {
                throw new Error('Storage not available');
            };
            
            // Test LanguageManager's fallback to cookies
            if (window.languageManager) {
                try {
                    window.languageManager.saveLanguagePreference('ta');
                    
                    // Check if it fell back to cookies
                    const cookies = document.cookie.split(';');
                    let cookieFound = false;
                    
                    for (let cookie of cookies) {
                        const [name, value] = cookie.trim().split('=');
                        if (name === 'temple-language-preference' && value === 'ta') {
                            cookieFound = true;
                            break;
                        }
                    }
                    
                    if (cookieFound) {
                        this.addResult('PASS', 'Fallback - sessionStorage to Cookie', 'Successfully fell back to cookies');
                    } else {
                        this.addResult('FAIL', 'Fallback - sessionStorage to Cookie', 'Cookie fallback did not work');
                    }
                } catch (error) {
                    this.addResult('FAIL', 'Fallback - sessionStorage to Cookie', `Error: ${error.message}`);
                }
            } else {
                this.addResult('INFO', 'Fallback - sessionStorage to Cookie', 'LanguageManager not available for testing');
            }
            
        } finally {
            // Restore original setItem
            Storage.prototype.setItem = originalSetItem;
            
            // Clean up cookie
            document.cookie = 'temple-language-preference=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
    }

    testCookieStorageAndRetrieval() {
        console.log('🍪 Testing cookie storage and retrieval...');
        
        try {
            // Set a test cookie
            const testValue = 'test_' + Date.now();
            const expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            document.cookie = `test-cookie=${testValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
            
            // Retrieve the cookie
            const cookies = document.cookie.split(';');
            let retrieved = null;
            
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'test-cookie') {
                    retrieved = value;
                    break;
                }
            }
            
            if (retrieved === testValue) {
                this.addResult('PASS', 'Cookie - Storage and Retrieval', 'Cookies work correctly');
            } else {
                this.addResult('FAIL', 'Cookie - Storage and Retrieval', 'Cookie retrieval failed');
            }
            
            // Clean up
            document.cookie = 'test-cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            
        } catch (error) {
            this.addResult('FAIL', 'Cookie - Storage and Retrieval', `Error: ${error.message}`);
        }
    }

    async testStorageQuotaExceeded() {
        console.log('📦 Testing storage quota exceeded handling...');
        
        try {
            // Try to fill localStorage to test quota handling
            let quotaExceeded = false;
            const testKey = '__quota_test__';
            
            try {
                // Try to store a large amount of data
                const largeData = 'x'.repeat(1024 * 1024); // 1MB of data
                for (let i = 0; i < 10; i++) {
                    localStorage.setItem(testKey + i, largeData);
                }
            } catch (error) {
                if (error.name === 'QuotaExceededError' || error.code === 22) {
                    quotaExceeded = true;
                }
            }
            
            // Clean up
            for (let i = 0; i < 10; i++) {
                try {
                    localStorage.removeItem(testKey + i);
                } catch (e) {}
            }
            
            if (quotaExceeded) {
                this.addResult('PASS', 'Storage - Quota Exceeded', 'Quota exceeded error detected correctly');
            } else {
                this.addResult('INFO', 'Storage - Quota Exceeded', 'Could not trigger quota exceeded (large quota available)');
            }
            
        } catch (error) {
            this.addResult('FAIL', 'Storage - Quota Exceeded', `Error: ${error.message}`);
        }
    }

    testPrivateBrowsingMode() {
        console.log('🕵️ Testing private browsing mode detection...');
        
        try {
            // Test if we're in private browsing mode
            // In private mode, localStorage might throw errors or have 0 quota
            let isPrivateMode = false;
            
            try {
                localStorage.setItem('__private_test__', '1');
                localStorage.removeItem('__private_test__');
            } catch (error) {
                isPrivateMode = true;
            }
            
            // Check storage quota (Safari private mode has 0 quota)
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                navigator.storage.estimate().then(estimate => {
                    if (estimate.quota === 0) {
                        isPrivateMode = true;
                    }
                });
            }
            
            if (isPrivateMode) {
                this.addResult('INFO', 'Private Browsing - Detection', 'Private browsing mode detected');
            } else {
                this.addResult('PASS', 'Private Browsing - Detection', 'Normal browsing mode (not private)');
            }
            
        } catch (error) {
            this.addResult('FAIL', 'Private Browsing - Detection', `Error: ${error.message}`);
        }
    }

    async testStoragePersistence() {
        console.log('💾 Testing storage persistence...');
        
        try {
            // Test that language preference persists
            const testLang = 'ta';
            
            if (window.languageManager) {
                // Save preference
                window.languageManager.saveLanguagePreference(testLang);
                
                // Retrieve immediately
                const retrieved = window.languageManager.getStoredLanguagePreference();
                
                if (retrieved === testLang) {
                    this.addResult('PASS', 'Storage - Persistence', 'Language preference persists correctly');
                } else {
                    this.addResult('FAIL', 'Storage - Persistence', `Expected: ${testLang}, Got: ${retrieved}`);
                }
                
                // Clean up
                window.languageManager.clearStoredState();
            } else {
                this.addResult('INFO', 'Storage - Persistence', 'LanguageManager not available for testing');
            }
            
        } catch (error) {
            this.addResult('FAIL', 'Storage - Persistence', `Error: ${error.message}`);
        }
    }

    addResult(status, test, message) {
        this.testResults.push({ status, test, message });
        const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : 'ℹ️';
        console.log(`${icon} ${test}: ${message}`);
    }

    displayResults() {
        console.log('\n📊 STORAGE FALLBACK TEST RESULTS SUMMARY');
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
    window.StorageFallbackTests = StorageFallbackTests;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageFallbackTests;
}
