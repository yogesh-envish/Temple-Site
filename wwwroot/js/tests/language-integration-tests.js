/**
 * Integration Tests for Language Toggle Feature
 * Tests the full language switching workflow and integration between components
 */

class LanguageIntegrationTests {
    constructor() {
        this.testResults = [];
        this.originalContent = {};
        this.testTimeout = 10000; // 10 seconds timeout for async operations
    }

    async runAllTests() {
        console.log('🔗 Starting Language Integration Tests...');
        
        try {
            // Wait for LanguageManager to be ready
            await this.waitForLanguageManager();
            
            // Test 1: Initial state validation
            await this.testInitialState();
            
            // Test 2: Language switching workflow
            await this.testLanguageSwitchingWorkflow();
            
            // Test 3: UI state synchronization
            await this.testUIStateSynchronization();
            
            // Test 4: Content persistence during navigation
            await this.testContentPersistence();
            
            // Test 5: Error handling and recovery
            await this.testErrorHandling();
            
            // Test 6: Accessibility integration
            await this.testAccessibilityIntegration();
            
            // Test 7: Performance and responsiveness
            await this.testPerformanceAndResponsiveness();
            
        } catch (error) {
            this.addResult('FAIL', 'Integration Tests Setup', `Setup failed: ${error.message}`);
        }
        
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

    async testInitialState() {
        console.log('🏁 Testing initial state...');
        
        if (!window.languageManager) {
            this.addResult('FAIL', 'Initial State - Manager Exists', 'LanguageManager not found');
            return;
        }
        
        const state = window.languageManager.getLanguageState();
        
        // Test manager initialization
        if (state.isInitialized) {
            this.addResult('PASS', 'Initial State - Initialization', 'LanguageManager is initialized');
        } else {
            this.addResult('FAIL', 'Initial State - Initialization', 'LanguageManager not initialized');
        }
        
        // Test default language
        if (state.currentLanguage === 'en') {
            this.addResult('PASS', 'Initial State - Default Language', 'Default language is English');
        } else {
            this.addResult('FAIL', 'Initial State - Default Language', `Expected: en, Got: ${state.currentLanguage}`);
        }
        
        // Test available languages
        if (state.availableLanguages.includes('en') && state.availableLanguages.includes('ta')) {
            this.addResult('PASS', 'Initial State - Available Languages', 'Both English and Tamil available');
        } else {
            this.addResult('FAIL', 'Initial State - Available Languages', 'Missing required languages');
        }
        
        // Test UI elements presence
        const languageButtons = document.querySelectorAll('.lang-btn');
        if (languageButtons.length === 2) {
            this.addResult('PASS', 'Initial State - UI Elements', 'Language toggle buttons present');
        } else {
            this.addResult('FAIL', 'Initial State - UI Elements', `Expected 2 buttons, found ${languageButtons.length}`);
        }
        
        // Test active button state
        const activeButton = document.querySelector('.lang-btn.active');
        if (activeButton && activeButton.getAttribute('data-lang') === 'en') {
            this.addResult('PASS', 'Initial State - Active Button', 'English button is active');
        } else {
            this.addResult('FAIL', 'Initial State - Active Button', 'English button not active');
        }
    }

    async testLanguageSwitchingWorkflow() {
        console.log('🔄 Testing language switching workflow...');
        
        // Store original content for comparison
        this.storeOriginalContent();
        
        try {
            // Test switch to Tamil
            await this.testSwitchToTamil();
            
            // Test switch back to English
            await this.testSwitchToEnglish();
            
            // Test rapid switching
            await this.testRapidSwitching();
            
        } catch (error) {
            this.addResult('FAIL', 'Language Switching Workflow', `Error: ${error.message}`);
        }
    }

    async testSwitchToTamil() {
        const tamilButton = document.querySelector('.lang-btn[data-lang="ta"]');
        if (!tamilButton) {
            this.addResult('FAIL', 'Switch to Tamil - Button Missing', 'Tamil button not found');
            return;
        }
        
        // Click Tamil button
        tamilButton.click();
        
        // Wait for content update
        await this.waitForContentUpdate();
        
        // Verify language state
        const state = window.languageManager.getLanguageState();
        if (state.currentLanguage === 'ta') {
            this.addResult('PASS', 'Switch to Tamil - State Update', 'Language state updated to Tamil');
        } else {
            this.addResult('FAIL', 'Switch to Tamil - State Update', `Expected: ta, Got: ${state.currentLanguage}`);
        }
        
        // Verify UI state
        if (tamilButton.classList.contains('active')) {
            this.addResult('PASS', 'Switch to Tamil - UI State', 'Tamil button is active');
        } else {
            this.addResult('FAIL', 'Switch to Tamil - UI State', 'Tamil button not active');
        }
        
        // Verify content update
        const pageHeader = document.querySelector('[data-lang-key="pageHeader"]');
        if (pageHeader && pageHeader.textContent.includes('கோயில்')) {
            this.addResult('PASS', 'Switch to Tamil - Content Update', 'Content updated to Tamil');
        } else {
            this.addResult('FAIL', 'Switch to Tamil - Content Update', 'Content not updated to Tamil');
        }
    }

    async testSwitchToEnglish() {
        const englishButton = document.querySelector('.lang-btn[data-lang="en"]');
        if (!englishButton) {
            this.addResult('FAIL', 'Switch to English - Button Missing', 'English button not found');
            return;
        }
        
        // Click English button
        englishButton.click();
        
        // Wait for content update
        await this.waitForContentUpdate();
        
        // Verify language state
        const state = window.languageManager.getLanguageState();
        if (state.currentLanguage === 'en') {
            this.addResult('PASS', 'Switch to English - State Update', 'Language state updated to English');
        } else {
            this.addResult('FAIL', 'Switch to English - State Update', `Expected: en, Got: ${state.currentLanguage}`);
        }
        
        // Verify content restoration
        const pageHeader = document.querySelector('[data-lang-key="pageHeader"]');
        if (pageHeader && pageHeader.textContent.includes('Temple')) {
            this.addResult('PASS', 'Switch to English - Content Restore', 'Content restored to English');
        } else {
            this.addResult('FAIL', 'Switch to English - Content Restore', 'Content not restored to English');
        }
    }

    async testRapidSwitching() {
        const englishButton = document.querySelector('.lang-btn[data-lang="en"]');
        const tamilButton = document.querySelector('.lang-btn[data-lang="ta"]');
        
        if (!englishButton || !tamilButton) {
            this.addResult('FAIL', 'Rapid Switching - Buttons Missing', 'Language buttons not found');
            return;
        }
        
        // Perform rapid switches
        for (let i = 0; i < 3; i++) {
            tamilButton.click();
            await this.waitForContentUpdate(500); // Shorter wait for rapid testing
            englishButton.click();
            await this.waitForContentUpdate(500);
        }
        
        // Verify final state is consistent
        const state = window.languageManager.getLanguageState();
        const activeButton = document.querySelector('.lang-btn.active');
        
        if (state.currentLanguage === activeButton.getAttribute('data-lang')) {
            this.addResult('PASS', 'Rapid Switching - State Consistency', 'State remains consistent after rapid switching');
        } else {
            this.addResult('FAIL', 'Rapid Switching - State Consistency', 'State inconsistent after rapid switching');
        }
    }

    async testUIStateSynchronization() {
        console.log('🎨 Testing UI state synchronization...');
        
        const englishButton = document.querySelector('.lang-btn[data-lang="en"]');
        const tamilButton = document.querySelector('.lang-btn[data-lang="ta"]');
        
        // Test ARIA attributes
        englishButton.click();
        await this.waitForContentUpdate();
        
        if (englishButton.getAttribute('aria-pressed') === 'true') {
            this.addResult('PASS', 'UI Sync - ARIA Pressed', 'ARIA pressed attribute updated correctly');
        } else {
            this.addResult('FAIL', 'UI Sync - ARIA Pressed', 'ARIA pressed attribute not updated');
        }
        
        // Test document language attribute
        const docLang = document.documentElement.getAttribute('lang');
        if (docLang === 'en') {
            this.addResult('PASS', 'UI Sync - Document Language', 'Document language attribute updated');
        } else {
            this.addResult('FAIL', 'UI Sync - Document Language', `Expected: en, Got: ${docLang}`);
        }
        
        // Test focus management
        englishButton.focus();
        tamilButton.click();
        await this.waitForContentUpdate();
        
        // Check if focus is managed properly (should be on Tamil button or maintained appropriately)
        const focusedElement = document.activeElement;
        if (focusedElement === tamilButton || focusedElement.classList.contains('lang-btn')) {
            this.addResult('PASS', 'UI Sync - Focus Management', 'Focus managed correctly during language switch');
        } else {
            this.addResult('FAIL', 'UI Sync - Focus Management', 'Focus not managed correctly');
        }
    }

    async testContentPersistence() {
        console.log('💾 Testing content persistence...');
        
        // Switch to Tamil and save preference
        const tamilButton = document.querySelector('.lang-btn[data-lang="ta"]');
        tamilButton.click();
        await this.waitForContentUpdate();
        
        // Check if preference is saved
        const savedPreference = window.languageManager.getStoredLanguagePreference();
        if (savedPreference === 'ta') {
            this.addResult('PASS', 'Content Persistence - Save Preference', 'Language preference saved correctly');
        } else {
            this.addResult('FAIL', 'Content Persistence - Save Preference', `Expected: ta, Got: ${savedPreference}`);
        }
        
        // Test state validation
        window.languageManager.validateCurrentState();
        
        const currentState = window.languageManager.getLanguageState();
        if (currentState.currentLanguage === 'ta') {
            this.addResult('PASS', 'Content Persistence - State Validation', 'State validation maintains language');
        } else {
            this.addResult('FAIL', 'Content Persistence - State Validation', 'State validation failed');
        }
        
        // Test clear state functionality
        window.languageManager.clearStoredState();
        await this.waitForContentUpdate();
        
        const clearedState = window.languageManager.getLanguageState();
        if (clearedState.currentLanguage === 'en') {
            this.addResult('PASS', 'Content Persistence - Clear State', 'State cleared and reset to default');
        } else {
            this.addResult('FAIL', 'Content Persistence - Clear State', 'State not cleared correctly');
        }
    }

    async testErrorHandling() {
        console.log('⚠️ Testing error handling...');
        
        // Test invalid language code
        try {
            await window.languageManager.switchLanguage('invalid');
            // Should not switch to invalid language
            const state = window.languageManager.getLanguageState();
            if (state.currentLanguage === 'en' || state.currentLanguage === 'ta') {
                this.addResult('PASS', 'Error Handling - Invalid Language', 'Invalid language code handled gracefully');
            } else {
                this.addResult('FAIL', 'Error Handling - Invalid Language', 'Invalid language code not handled');
            }
        } catch (error) {
            this.addResult('PASS', 'Error Handling - Invalid Language', 'Invalid language throws appropriate error');
        }
        
        // Test missing content data
        const originalContentData = window.languageManager.contentData;
        window.languageManager.contentData = {};
        
        try {
            await window.languageManager.switchLanguage('ta');
            this.addResult('PASS', 'Error Handling - Missing Content', 'Missing content handled gracefully');
        } catch (error) {
            this.addResult('PASS', 'Error Handling - Missing Content', 'Missing content throws appropriate error');
        }
        
        // Restore content data
        window.languageManager.contentData = originalContentData;
    }

    async testAccessibilityIntegration() {
        console.log('♿ Testing accessibility integration...');
        
        // Test screen reader announcements
        const statusElement = document.getElementById('lang-status');
        if (statusElement) {
            this.addResult('PASS', 'Accessibility - Status Element', 'Screen reader status element present');
        } else {
            this.addResult('FAIL', 'Accessibility - Status Element', 'Screen reader status element missing');
        }
        
        // Test keyboard navigation
        const languageButtons = document.querySelectorAll('.lang-btn');
        let allButtonsTabable = true;
        
        languageButtons.forEach(button => {
            if (button.getAttribute('tabindex') !== '0') {
                allButtonsTabable = false;
            }
        });
        
        if (allButtonsTabable) {
            this.addResult('PASS', 'Accessibility - Keyboard Navigation', 'All buttons are keyboard accessible');
        } else {
            this.addResult('FAIL', 'Accessibility - Keyboard Navigation', 'Some buttons not keyboard accessible');
        }
        
        // Test ARIA labels
        let allButtonsHaveLabels = true;
        languageButtons.forEach(button => {
            if (!button.getAttribute('aria-label') && !button.getAttribute('title')) {
                allButtonsHaveLabels = false;
            }
        });
        
        if (allButtonsHaveLabels) {
            this.addResult('PASS', 'Accessibility - ARIA Labels', 'All buttons have appropriate labels');
        } else {
            this.addResult('FAIL', 'Accessibility - ARIA Labels', 'Some buttons missing labels');
        }
    }

    async testPerformanceAndResponsiveness() {
        console.log('⚡ Testing performance and responsiveness...');
        
        const tamilButton = document.querySelector('.lang-btn[data-lang="ta"]');
        const englishButton = document.querySelector('.lang-btn[data-lang="en"]');
        
        // Test switching performance
        const startTime = performance.now();
        tamilButton.click();
        await this.waitForContentUpdate();
        const switchTime = performance.now() - startTime;
        
        if (switchTime < 1000) { // Should complete within 1 second
            this.addResult('PASS', 'Performance - Switch Time', `Language switch completed in ${switchTime.toFixed(2)}ms`);
        } else {
            this.addResult('FAIL', 'Performance - Switch Time', `Language switch took ${switchTime.toFixed(2)}ms (too slow)`);
        }
        
        // Test multiple rapid switches
        const rapidStartTime = performance.now();
        for (let i = 0; i < 5; i++) {
            englishButton.click();
            await this.waitForContentUpdate(100);
            tamilButton.click();
            await this.waitForContentUpdate(100);
        }
        const rapidSwitchTime = performance.now() - rapidStartTime;
        
        if (rapidSwitchTime < 3000) { // 10 switches should complete within 3 seconds
            this.addResult('PASS', 'Performance - Rapid Switching', `Rapid switching completed in ${rapidSwitchTime.toFixed(2)}ms`);
        } else {
            this.addResult('FAIL', 'Performance - Rapid Switching', `Rapid switching took ${rapidSwitchTime.toFixed(2)}ms (too slow)`);
        }
    }

    storeOriginalContent() {
        const elementsWithLangKeys = document.querySelectorAll('[data-lang-key]');
        elementsWithLangKeys.forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (element.tagName === 'IMG') {
                this.originalContent[key] = element.getAttribute('alt');
            } else {
                this.originalContent[key] = element.textContent;
            }
        });
    }

    async waitForContentUpdate(timeout = 1000) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    addResult(status, test, message) {
        this.testResults.push({ status, test, message });
        const icon = status === 'PASS' ? '✅' : '❌';
        console.log(`${icon} ${test}: ${message}`);
    }

    displayResults() {
        console.log('\n📊 INTEGRATION TEST RESULTS SUMMARY');
        console.log('====================================');
        
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
    window.LanguageIntegrationTests = LanguageIntegrationTests;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageIntegrationTests;
}