/**
 * Cross-Browser Compatibility Tests for Language Toggle Feature
 * Tests browser-specific functionality and compatibility
 */

class CrossBrowserCompatibilityTests {
    constructor() {
        this.testResults = [];
        this.browserInfo = this.getBrowserInfo();
        this.supportedFeatures = {};
    }

    async runAllTests() {
        console.log('🌐 Starting Cross-Browser Compatibility Tests...');
        console.log(`Browser: ${this.browserInfo.name} ${this.browserInfo.version}`);
        
        // Test 1: Browser detection and feature support
        this.testBrowserDetection();
        
        // Test 2: Storage API compatibility
        await this.testStorageCompatibility();
        
        // Test 3: ES6+ features compatibility
        this.testES6Compatibility();
        
        // Test 4: CSS features compatibility
        this.testCSSCompatibility();
        
        // Test 5: Event handling compatibility
        this.testEventHandlingCompatibility();
        
        // Test 6: DOM API compatibility
        this.testDOMAPICompatibility();
        
        // Test 7: Fetch API compatibility
        await this.testFetchAPICompatibility();
        
        // Test 8: Accessibility API compatibility
        this.testAccessibilityAPICompatibility();
        
        // Display results
        this.displayResults();
    }

    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browserName = 'Unknown';
        let browserVersion = 'Unknown';
        
        // Detect browser
        if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) {
            browserName = 'Chrome';
            browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
        } else if (userAgent.indexOf('Firefox') > -1) {
            browserName = 'Firefox';
            browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
        } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
            browserName = 'Safari';
            browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
        } else if (userAgent.indexOf('Edg') > -1) {
            browserName = 'Edge';
            browserVersion = userAgent.match(/Edg\/([0-9.]+)/)?.[1] || 'Unknown';
        } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
            browserName = 'Internet Explorer';
            browserVersion = userAgent.match(/(?:MSIE |rv:)([0-9.]+)/)?.[1] || 'Unknown';
        }
        
        return {
            name: browserName,
            version: browserVersion,
            userAgent: userAgent,
            platform: navigator.platform,
            language: navigator.language
        };
    }

    testBrowserDetection() {
        console.log('🔍 Testing browser detection...');
        
        // Test basic browser info
        if (this.browserInfo.name !== 'Unknown') {
            this.addResult('PASS', 'Browser Detection - Name', `Detected: ${this.browserInfo.name}`);
        } else {
            this.addResult('FAIL', 'Browser Detection - Name', 'Could not detect browser');
        }
        
        if (this.browserInfo.version !== 'Unknown') {
            this.addResult('PASS', 'Browser Detection - Version', `Version: ${this.browserInfo.version}`);
        } else {
            this.addResult('FAIL', 'Browser Detection - Version', 'Could not detect version');
        }
        
        // Test modern browser features
        const modernFeatures = [
            { name: 'Promise', test: () => typeof Promise !== 'undefined' },
            { name: 'Fetch', test: () => typeof fetch !== 'undefined' },
            { name: 'Arrow Functions', test: () => { try { eval('() => {}'); return true; } catch { return false; } } },
            { name: 'Template Literals', test: () => { try { eval('`test`'); return true; } catch { return false; } } },
            { name: 'Const/Let', test: () => { try { eval('const x = 1; let y = 2;'); return true; } catch { return false; } } }
        ];
        
        modernFeatures.forEach(feature => {
            if (feature.test()) {
                this.addResult('PASS', `Modern Features - ${feature.name}`, 'Supported');
                this.supportedFeatures[feature.name] = true;
            } else {
                this.addResult('FAIL', `Modern Features - ${feature.name}`, 'Not supported');
                this.supportedFeatures[feature.name] = false;
            }
        });
    }

    async testStorageCompatibility() {
        console.log('💾 Testing storage compatibility...');
        
        // Test localStorage
        try {
            const testKey = '__browser_test_local__';
            const testValue = 'test_value_' + Date.now();
            
            localStorage.setItem(testKey, testValue);
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            if (retrieved === testValue) {
                this.addResult('PASS', 'Storage - localStorage', 'Read/write operations work');
            } else {
                this.addResult('FAIL', 'Storage - localStorage', 'Read/write operations failed');
            }
        } catch (error) {
            this.addResult('FAIL', 'Storage - localStorage', `Error: ${error.message}`);
        }
        
        // Test sessionStorage
        try {
            const testKey = '__browser_test_session__';
            const testValue = 'test_value_' + Date.now();
            
            sessionStorage.setItem(testKey, testValue);
            const retrieved = sessionStorage.getItem(testKey);
            sessionStorage.removeItem(testKey);
            
            if (retrieved === testValue) {
                this.addResult('PASS', 'Storage - sessionStorage', 'Read/write operations work');
            } else {
                this.addResult('FAIL', 'Storage - sessionStorage', 'Read/write operations failed');
            }
        } catch (error) {
            this.addResult('FAIL', 'Storage - sessionStorage', `Error: ${error.message}`);
        }
        
        // Test storage events
        try {
            let eventFired = false;
            const testHandler = () => { eventFired = true; };
            
            window.addEventListener('storage', testHandler);
            
            // Trigger storage event (only works across tabs, so this is a basic test)
            localStorage.setItem('__test_event__', 'test');
            localStorage.removeItem('__test_event__');
            
            window.removeEventListener('storage', testHandler);
            
            this.addResult('PASS', 'Storage - Events', 'Storage event listener can be attached');
        } catch (error) {
            this.addResult('FAIL', 'Storage - Events', `Error: ${error.message}`);
        }
        
        // Test storage quota
        try {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                const estimate = await navigator.storage.estimate();
                this.addResult('PASS', 'Storage - Quota API', `Available: ${(estimate.quota / 1024 / 1024).toFixed(2)}MB`);
            } else {
                this.addResult('INFO', 'Storage - Quota API', 'Storage quota API not available');
            }
        } catch (error) {
            this.addResult('FAIL', 'Storage - Quota API', `Error: ${error.message}`);
        }
    }

    testES6Compatibility() {
        console.log('📜 Testing ES6+ compatibility...');
        
        const es6Features = [
            {
                name: 'Classes',
                test: () => {
                    try {
                        eval('class TestClass { constructor() {} }');
                        return true;
                    } catch { return false; }
                }
            },
            {
                name: 'Destructuring',
                test: () => {
                    try {
                        eval('const {a, b} = {a: 1, b: 2};');
                        return true;
                    } catch { return false; }
                }
            },
            {
                name: 'Spread Operator',
                test: () => {
                    try {
                        eval('const arr = [1, 2, 3]; const newArr = [...arr];');
                        return true;
                    } catch { return false; }
                }
            },
            {
                name: 'Default Parameters',
                test: () => {
                    try {
                        eval('function test(a = 1) { return a; }');
                        return true;
                    } catch { return false; }
                }
            },
            {
                name: 'Object.assign',
                test: () => typeof Object.assign === 'function'
            },
            {
                name: 'Array.from',
                test: () => typeof Array.from === 'function'
            },
            {
                name: 'String.includes',
                test: () => typeof String.prototype.includes === 'function'
            }
        ];
        
        es6Features.forEach(feature => {
            if (feature.test()) {
                this.addResult('PASS', `ES6+ - ${feature.name}`, 'Supported');
            } else {
                this.addResult('FAIL', `ES6+ - ${feature.name}`, 'Not supported');
            }
        });
    }

    testCSSCompatibility() {
        console.log('🎨 Testing CSS compatibility...');
        
        const testElement = document.createElement('div');
        document.body.appendChild(testElement);
        
        const cssFeatures = [
            {
                name: 'CSS Grid',
                test: () => CSS.supports('display', 'grid')
            },
            {
                name: 'CSS Flexbox',
                test: () => CSS.supports('display', 'flex')
            },
            {
                name: 'CSS Variables',
                test: () => CSS.supports('--test', 'value')
            },
            {
                name: 'CSS Transitions',
                test: () => CSS.supports('transition', 'opacity 0.3s')
            },
            {
                name: 'CSS Transforms',
                test: () => CSS.supports('transform', 'translateX(10px)')
            },
            {
                name: 'CSS calc()',
                test: () => CSS.supports('width', 'calc(100% - 10px)')
            }
        ];
        
        cssFeatures.forEach(feature => {
            try {
                if (feature.test()) {
                    this.addResult('PASS', `CSS - ${feature.name}`, 'Supported');
                } else {
                    this.addResult('FAIL', `CSS - ${feature.name}`, 'Not supported');
                }
            } catch (error) {
                // Fallback for browsers without CSS.supports
                this.addResult('INFO', `CSS - ${feature.name}`, 'CSS.supports not available');
            }
        });
        
        document.body.removeChild(testElement);
    }

    testEventHandlingCompatibility() {
        console.log('⚡ Testing event handling compatibility...');
        
        const testElement = document.createElement('button');
        document.body.appendChild(testElement);
        
        // Test addEventListener
        try {
            let eventFired = false;
            const testHandler = () => { eventFired = true; };
            
            testElement.addEventListener('click', testHandler);
            testElement.click();
            testElement.removeEventListener('click', testHandler);
            
            if (eventFired) {
                this.addResult('PASS', 'Events - addEventListener', 'Event listener works correctly');
            } else {
                this.addResult('FAIL', 'Events - addEventListener', 'Event listener failed');
            }
        } catch (error) {
            this.addResult('FAIL', 'Events - addEventListener', `Error: ${error.message}`);
        }
        
        // Test keyboard events
        try {
            let keyEventFired = false;
            const keyHandler = (e) => { 
                if (e.key === 'Enter' || e.keyCode === 13) {
                    keyEventFired = true;
                }
            };
            
            testElement.addEventListener('keydown', keyHandler);
            
            // Simulate Enter key
            const keyEvent = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13 });
            testElement.dispatchEvent(keyEvent);
            
            testElement.removeEventListener('keydown', keyHandler);
            
            if (keyEventFired) {
                this.addResult('PASS', 'Events - Keyboard Events', 'Keyboard events work correctly');
            } else {
                this.addResult('FAIL', 'Events - Keyboard Events', 'Keyboard events failed');
            }
        } catch (error) {
            this.addResult('FAIL', 'Events - Keyboard Events', `Error: ${error.message}`);
        }
        
        // Test focus events
        try {
            let focusEventFired = false;
            const focusHandler = () => { focusEventFired = true; };
            
            testElement.addEventListener('focus', focusHandler);
            testElement.focus();
            testElement.removeEventListener('focus', focusHandler);
            
            if (focusEventFired) {
                this.addResult('PASS', 'Events - Focus Events', 'Focus events work correctly');
            } else {
                this.addResult('FAIL', 'Events - Focus Events', 'Focus events failed');
            }
        } catch (error) {
            this.addResult('FAIL', 'Events - Focus Events', `Error: ${error.message}`);
        }
        
        document.body.removeChild(testElement);
    }

    testDOMAPICompatibility() {
        console.log('🏗️ Testing DOM API compatibility...');
        
        // Test querySelector/querySelectorAll
        try {
            const elements = document.querySelectorAll('*');
            if (elements && elements.length > 0) {
                this.addResult('PASS', 'DOM API - querySelector', 'querySelector works correctly');
            } else {
                this.addResult('FAIL', 'DOM API - querySelector', 'querySelector failed');
            }
        } catch (error) {
            this.addResult('FAIL', 'DOM API - querySelector', `Error: ${error.message}`);
        }
        
        // Test createElement and appendChild
        try {
            const testDiv = document.createElement('div');
            testDiv.textContent = 'Test';
            document.body.appendChild(testDiv);
            
            if (testDiv.parentNode === document.body) {
                this.addResult('PASS', 'DOM API - createElement/appendChild', 'DOM manipulation works');
            } else {
                this.addResult('FAIL', 'DOM API - createElement/appendChild', 'DOM manipulation failed');
            }
            
            document.body.removeChild(testDiv);
        } catch (error) {
            this.addResult('FAIL', 'DOM API - createElement/appendChild', `Error: ${error.message}`);
        }
        
        // Test classList
        try {
            const testElement = document.createElement('div');
            testElement.classList.add('test-class');
            
            if (testElement.classList.contains('test-class')) {
                this.addResult('PASS', 'DOM API - classList', 'classList API works');
            } else {
                this.addResult('FAIL', 'DOM API - classList', 'classList API failed');
            }
        } catch (error) {
            this.addResult('FAIL', 'DOM API - classList', `Error: ${error.message}`);
        }
        
        // Test dataset
        try {
            const testElement = document.createElement('div');
            testElement.setAttribute('data-test', 'value');
            
            if (testElement.dataset && testElement.dataset.test === 'value') {
                this.addResult('PASS', 'DOM API - dataset', 'Dataset API works');
            } else {
                this.addResult('FAIL', 'DOM API - dataset', 'Dataset API failed');
            }
        } catch (error) {
            this.addResult('FAIL', 'DOM API - dataset', `Error: ${error.message}`);
        }
    }

    async testFetchAPICompatibility() {
        console.log('🌐 Testing Fetch API compatibility...');
        
        if (typeof fetch === 'undefined') {
            this.addResult('FAIL', 'Fetch API - Availability', 'Fetch API not available');
            return;
        }
        
        try {
            // Test basic fetch functionality with the language content file
            const response = await fetch('/js/lang/about-content.json');
            
            if (response.ok) {
                this.addResult('PASS', 'Fetch API - Basic Request', 'Fetch request successful');
                
                // Test JSON parsing
                const data = await response.json();
                if (data && data.en && data.ta) {
                    this.addResult('PASS', 'Fetch API - JSON Parsing', 'JSON parsing works');
                } else {
                    this.addResult('FAIL', 'Fetch API - JSON Parsing', 'JSON parsing failed');
                }
            } else {
                this.addResult('FAIL', 'Fetch API - Basic Request', `Request failed: ${response.status}`);
            }
        } catch (error) {
            this.addResult('FAIL', 'Fetch API - Basic Request', `Error: ${error.message}`);
        }
        
        // Test fetch with headers
        try {
            const response = await fetch('/js/lang/about-content.json', {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                this.addResult('PASS', 'Fetch API - Headers', 'Fetch with headers works');
            } else {
                this.addResult('FAIL', 'Fetch API - Headers', 'Fetch with headers failed');
            }
        } catch (error) {
            this.addResult('FAIL', 'Fetch API - Headers', `Error: ${error.message}`);
        }
    }

    testAccessibilityAPICompatibility() {
        console.log('♿ Testing Accessibility API compatibility...');
        
        const testElement = document.createElement('button');
        testElement.textContent = 'Test Button';
        document.body.appendChild(testElement);
        
        // Test ARIA attributes
        try {
            testElement.setAttribute('aria-label', 'Test Label');
            testElement.setAttribute('aria-pressed', 'false');
            testElement.setAttribute('role', 'button');
            
            if (testElement.getAttribute('aria-label') === 'Test Label') {
                this.addResult('PASS', 'Accessibility - ARIA Attributes', 'ARIA attributes work');
            } else {
                this.addResult('FAIL', 'Accessibility - ARIA Attributes', 'ARIA attributes failed');
            }
        } catch (error) {
            this.addResult('FAIL', 'Accessibility - ARIA Attributes', `Error: ${error.message}`);
        }
        
        // Test tabindex
        try {
            testElement.setAttribute('tabindex', '0');
            if (testElement.getAttribute('tabindex') === '0') {
                this.addResult('PASS', 'Accessibility - Tabindex', 'Tabindex attribute works');
            } else {
                this.addResult('FAIL', 'Accessibility - Tabindex', 'Tabindex attribute failed');
            }
        } catch (error) {
            this.addResult('FAIL', 'Accessibility - Tabindex', `Error: ${error.message}`);
        }
        
        // Test focus management
        try {
            testElement.focus();
            if (document.activeElement === testElement) {
                this.addResult('PASS', 'Accessibility - Focus Management', 'Focus management works');
            } else {
                this.addResult('FAIL', 'Accessibility - Focus Management', 'Focus management failed');
            }
        } catch (error) {
            this.addResult('FAIL', 'Accessibility - Focus Management', `Error: ${error.message}`);
        }
        
        document.body.removeChild(testElement);
    }

    addResult(status, test, message) {
        this.testResults.push({ status, test, message });
        const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : 'ℹ️';
        console.log(`${icon} ${test}: ${message}`);
    }

    displayResults() {
        console.log('\n📊 CROSS-BROWSER COMPATIBILITY TEST RESULTS');
        console.log('=============================================');
        console.log(`Browser: ${this.browserInfo.name} ${this.browserInfo.version}`);
        console.log(`Platform: ${this.browserInfo.platform}`);
        console.log(`User Agent: ${this.browserInfo.userAgent}`);
        
        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        const info = this.testResults.filter(r => r.status === 'INFO').length;
        const total = this.testResults.length;
        
        console.log(`\nTotal Tests: ${total}`);
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
        
        // Browser-specific recommendations
        this.provideBrowserRecommendations();
        
        return { passed, failed, info, total };
    }

    provideBrowserRecommendations() {
        console.log('\n💡 BROWSER-SPECIFIC RECOMMENDATIONS:');
        
        const failedTests = this.testResults.filter(r => r.status === 'FAIL');
        
        if (this.browserInfo.name === 'Internet Explorer') {
            console.log('   • Consider using polyfills for ES6+ features');
            console.log('   • Use XMLHttpRequest instead of Fetch API');
            console.log('   • Implement fallbacks for CSS Grid and Flexbox');
        }
        
        if (failedTests.some(t => t.test.includes('Storage'))) {
            console.log('   • Implement cookie-based fallback for storage');
            console.log('   • Consider using a storage polyfill library');
        }
        
        if (failedTests.some(t => t.test.includes('Fetch'))) {
            console.log('   • Use XMLHttpRequest as fallback for Fetch API');
            console.log('   • Consider using a fetch polyfill');
        }
        
        if (failedTests.some(t => t.test.includes('ES6'))) {
            console.log('   • Use Babel to transpile ES6+ code');
            console.log('   • Implement ES5-compatible alternatives');
        }
    }
}

// Export for use in test runner
if (typeof window !== 'undefined') {
    window.CrossBrowserCompatibilityTests = CrossBrowserCompatibilityTests;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CrossBrowserCompatibilityTests;
}