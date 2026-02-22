/**
 * Language Integration Validation Script
 * Tests the integration between About page elements and language content
 */

class LanguageIntegrationValidator {
    constructor() {
        this.testResults = [];
        this.contentPath = '/js/lang/about-content.json';
    }

    async validateIntegration() {
        console.log('🔍 Starting Language Integration Validation...');
        
        try {
            // Load content data
            const contentData = await this.loadContentData();
            
            // Test 1: Validate JSON structure
            this.validateJSONStructure(contentData);
            
            // Test 2: Validate page elements exist
            this.validatePageElements();
            
            // Test 3: Validate data-lang-key mappings
            this.validateDataLangKeyMappings(contentData);
            
            // Test 4: Test language switching functionality
            await this.testLanguageSwitching(contentData);
            
            // Test 5: Validate layout preservation
            this.validateLayoutPreservation();
            
            // Display results
            this.displayResults();
            
        } catch (error) {
            console.error('❌ Validation failed:', error);
            this.addResult('FAIL', 'Overall Integration', error.message);
            this.displayResults();
        }
    }

    async loadContentData() {
        const response = await fetch(this.contentPath);
        if (!response.ok) {
            throw new Error(`Failed to load content: ${response.status}`);
        }
        return await response.json();
    }

    validateJSONStructure(contentData) {
        console.log('📋 Validating JSON structure...');
        
        const requiredKeys = ['pageHeader', 'breadcrumb', 'sectionTitle', 'historyContent', 'imageAlt'];
        const languages = ['en', 'ta'];
        
        for (const lang of languages) {
            if (!contentData[lang]) {
                this.addResult('FAIL', `JSON Structure - ${lang}`, `Missing language data for ${lang}`);
                continue;
            }
            
            for (const key of requiredKeys) {
                if (key === 'breadcrumb') {
                    if (!contentData[lang][key] || !contentData[lang][key].home || !contentData[lang][key].about) {
                        this.addResult('FAIL', `JSON Structure - ${lang}.${key}`, 'Missing breadcrumb data');
                    } else {
                        this.addResult('PASS', `JSON Structure - ${lang}.${key}`, 'Breadcrumb data present');
                    }
                } else if (!contentData[lang][key]) {
                    this.addResult('FAIL', `JSON Structure - ${lang}.${key}`, `Missing key: ${key}`);
                } else {
                    this.addResult('PASS', `JSON Structure - ${lang}.${key}`, 'Key present');
                }
            }
        }
    }

    validatePageElements() {
        console.log('🔍 Validating page elements...');
        
        const requiredElements = [
            { selector: '[data-lang-key="pageHeader"]', name: 'Page Header' },
            { selector: '[data-lang-key="breadcrumb.home"]', name: 'Breadcrumb Home' },
            { selector: '[data-lang-key="breadcrumb.about"]', name: 'Breadcrumb About' },
            { selector: '[data-lang-key="sectionTitle"]', name: 'Section Title' },
            { selector: '[data-lang-key="historyContent"]', name: 'History Content' },
            { selector: '[data-lang-key="imageAlt"]', name: 'Temple Image' }
        ];
        
        for (const element of requiredElements) {
            const domElement = document.querySelector(element.selector);
            if (domElement) {
                this.addResult('PASS', `Page Element - ${element.name}`, 'Element found');
            } else {
                this.addResult('FAIL', `Page Element - ${element.name}`, 'Element not found');
            }
        }
    }

    validateDataLangKeyMappings(contentData) {
        console.log('🗂️ Validating data-lang-key mappings...');
        
        const elementsWithKeys = document.querySelectorAll('[data-lang-key]');
        
        for (const element of elementsWithKeys) {
            const key = element.getAttribute('data-lang-key');
            const englishValue = this.getNestedValue(contentData.en, key);
            const tamilValue = this.getNestedValue(contentData.ta, key);
            
            if (englishValue && tamilValue) {
                this.addResult('PASS', `Mapping - ${key}`, 'Both languages have content');
            } else if (!englishValue) {
                this.addResult('FAIL', `Mapping - ${key}`, 'Missing English content');
            } else if (!tamilValue) {
                this.addResult('FAIL', `Mapping - ${key}`, 'Missing Tamil content');
            }
        }
    }

    async testLanguageSwitching(contentData) {
        console.log('🔄 Testing language switching...');
        
        if (!window.languageManager) {
            this.addResult('FAIL', 'Language Switching', 'LanguageManager not found');
            return;
        }
        
        try {
            // Test switch to Tamil
            await window.languageManager.switchLanguage('ta');
            
            // Verify Tamil content is displayed
            const pageHeader = document.querySelector('[data-lang-key="pageHeader"]');
            if (pageHeader && pageHeader.textContent === contentData.ta.pageHeader) {
                this.addResult('PASS', 'Language Switching - Tamil', 'Content updated correctly');
            } else {
                this.addResult('FAIL', 'Language Switching - Tamil', 'Content not updated');
            }
            
            // Test switch back to English
            await window.languageManager.switchLanguage('en');
            
            // Verify English content is restored
            if (pageHeader && pageHeader.textContent === contentData.en.pageHeader) {
                this.addResult('PASS', 'Language Switching - English', 'Content restored correctly');
            } else {
                this.addResult('FAIL', 'Language Switching - English', 'Content not restored');
            }
            
        } catch (error) {
            this.addResult('FAIL', 'Language Switching', error.message);
        }
    }

    validateLayoutPreservation() {
        console.log('📐 Validating layout preservation...');
        
        // Check if key layout elements maintain their structure
        const layoutElements = [
            { selector: '.page-header', name: 'Page Header Container' },
            { selector: '.breadcrumb', name: 'Breadcrumb Navigation' },
            { selector: '.history-section', name: 'History Section' },
            { selector: '.temple-image', name: 'Temple Image' },
            { selector: '.section-title', name: 'Section Title' }
        ];
        
        for (const element of layoutElements) {
            const domElement = document.querySelector(element.selector);
            if (domElement) {
                const computedStyle = window.getComputedStyle(domElement);
                if (computedStyle.display !== 'none') {
                    this.addResult('PASS', `Layout - ${element.name}`, 'Element visible and styled');
                } else {
                    this.addResult('FAIL', `Layout - ${element.name}`, 'Element hidden');
                }
            } else {
                this.addResult('FAIL', `Layout - ${element.name}`, 'Element missing');
            }
        }
    }

    getNestedValue(obj, path) {
        if (!obj || !path) return null;
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }

    addResult(status, test, message) {
        this.testResults.push({ status, test, message });
        const icon = status === 'PASS' ? '✅' : '❌';
        console.log(`${icon} ${test}: ${message}`);
    }

    displayResults() {
        console.log('\n📊 VALIDATION RESULTS SUMMARY');
        console.log('================================');
        
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
        
        // Create visual results display
        this.createResultsDisplay(passed, failed, total);
    }

    createResultsDisplay(passed, failed, total) {
        // Remove existing results display
        const existingDisplay = document.getElementById('validation-results');
        if (existingDisplay) {
            existingDisplay.remove();
        }
        
        // Create new results display
        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'validation-results';
        resultsDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: white;
            border: 2px solid ${failed === 0 ? '#28a745' : '#dc3545'};
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            z-index: 1000;
            font-family: monospace;
            font-size: 12px;
            max-width: 300px;
        `;
        
        const successRate = ((passed / total) * 100).toFixed(1);
        const statusColor = failed === 0 ? '#28a745' : '#dc3545';
        
        resultsDiv.innerHTML = `
            <h4 style="margin: 0 0 10px 0; color: ${statusColor};">
                ${failed === 0 ? '✅' : '❌'} Integration Validation
            </h4>
            <div><strong>Total Tests:</strong> ${total}</div>
            <div><strong>Passed:</strong> <span style="color: #28a745;">${passed}</span></div>
            <div><strong>Failed:</strong> <span style="color: #dc3545;">${failed}</span></div>
            <div><strong>Success Rate:</strong> ${successRate}%</div>
            <button onclick="this.parentElement.remove()" style="
                margin-top: 10px;
                padding: 5px 10px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">Close</button>
        `;
        
        document.body.appendChild(resultsDiv);
    }
}

// Auto-run validation when page loads (if not in production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for language manager to initialize
        setTimeout(() => {
            const validator = new LanguageIntegrationValidator();
            validator.validateIntegration();
        }, 2000);
    });
}

// Export for manual testing
window.LanguageIntegrationValidator = LanguageIntegrationValidator;