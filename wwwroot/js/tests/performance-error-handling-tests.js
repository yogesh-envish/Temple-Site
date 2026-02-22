/**
 * Performance Optimization and Error Handling Tests
 * Tests for Task 8: Performance optimization and error handling
 * Requirements: 4.4, 5.4
 */

describe('Performance Optimization and Error Handling', () => {
    let languageManager;
    let mockFetch;
    let originalFetch;

    beforeEach(() => {
        // Set up DOM elements
        document.body.innerHTML = `
            <div class="language-toggle" role="group" aria-label="Language selection">
                <button class="lang-btn active" data-lang="en" aria-pressed="true">EN</button>
                <button class="lang-btn" data-lang="ta" aria-pressed="false">தமிழ்</button>
                <div class="loading-indicator" style="display: none;">
                    <span class="spinner"></span>
                </div>
                <div id="lang-status" class="sr-only" aria-live="polite"></div>
            </div>
            <div class="language-error" style="display: none;"></div>
            <main>
                <h1 data-lang-key="pageTitle">About Us</h1>
                <p data-lang-key="historyContent">Content</p>
            </main>
        `;

        // Save original fetch
        originalFetch = global.fetch;

        // Clear localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Mock performance API
        if (!global.performance) {
            global.performance = {
                now: () => Date.now(),
                mark: jest.fn(),
                measure: jest.fn()
            };
        }
    });

    afterEach(() => {
        // Restore original fetch
        if (originalFetch) {
            global.fetch = originalFetch;
        }
        
        // Clean up
        if (languageManager) {
            languageManager = null;
        }
    });

    describe('Error Handling for Content Loading Failures', () => {
        test('should retry loading content on failure', async () => {
            let attemptCount = 0;
            
            global.fetch = jest.fn(() => {
                attemptCount++;
                if (attemptCount < 3) {
                    return Promise.reject(new Error('Network error'));
                }
                return Promise.resolve({
                    ok: true,
                    headers: { get: () => 'application/json' },
                    json: () => Promise.resolve({
                        en: { pageTitle: 'About Us', historyContent: 'Content' },
                        ta: { pageTitle: 'எங்களைப் பற்றி', historyContent: 'உள்ளடக்கம்' }
                    })
                });
            });

            languageManager = new LanguageManager();
            await languageManager.init();

            expect(attemptCount).toBe(3);
            expect(languageManager.errorState).toBe(false);
        });

        test('should use fallback content after max retries', async () => {
            global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

            languageManager = new LanguageManager();
            await languageManager.init();

            expect(languageManager.errorState).toBe(true);
            expect(languageManager.contentData).toEqual(languageManager.fallbackContent);
        });

        test('should use cached content when offline', async () => {
            const cachedContent = {
                en: { pageTitle: 'Cached About', historyContent: 'Cached content' },
                ta: { pageTitle: 'தற்காலிக சேமிப்பு', historyContent: 'தற்காலிக உள்ளடக்கம்' }
            };

            localStorage.setItem('temple-language-content-cache', JSON.stringify({
                content: cachedContent,
                timestamp: Date.now(),
                version: '1.0'
            }));

            languageManager = new LanguageManager();
            languageManager.networkStatus = 'offline';
            
            global.fetch = jest.fn(() => Promise.reject(new Error('Offline')));
            
            await languageManager.init();

            expect(languageManager.contentData).toEqual(cachedContent);
        });

        test('should handle invalid JSON response', async () => {
            global.fetch = jest.fn(() => Promise.resolve({
                ok: true,
                headers: { get: () => 'application/json' },
                json: () => Promise.reject(new Error('Invalid JSON'))
            }));

            languageManager = new LanguageManager();
            await languageManager.init();

            expect(languageManager.errorState).toBe(true);
            expect(languageManager.contentData).toEqual(languageManager.fallbackContent);
        });

        test('should handle HTTP error responses', async () => {
            global.fetch = jest.fn(() => Promise.resolve({
                ok: false,
                status: 404,
                statusText: 'Not Found',
                headers: { get: () => 'application/json' }
            }));

            languageManager = new LanguageManager();
            await languageManager.init();

            expect(languageManager.errorState).toBe(true);
        });

        test('should validate content structure', async () => {
            const invalidContent = {
                en: { pageTitle: 'About' } // Missing required fields
            };

            global.fetch = jest.fn(() => Promise.resolve({
                ok: true,
                headers: { get: () => 'application/json' },
                json: () => Promise.resolve(invalidContent)
            }));

            languageManager = new LanguageManager();
            
            await expect(languageManager.init()).rejects.toThrow();
        });
    });

    describe('Loading States and User Feedback', () => {
        test('should show loading indicator during language switch', async () => {
            languageManager = new LanguageManager();
            await languageManager.init();

            const loadingIndicator = document.querySelector('.loading-indicator');
            const toggleContainer = document.querySelector('.language-toggle');

            languageManager.showLoadingState();

            expect(loadingIndicator.style.display).toBe('block');
            expect(toggleContainer.classList.contains('loading')).toBe(true);
        });

        test('should disable buttons during loading', async () => {
            languageManager = new LanguageManager();
            await languageManager.init();

            const buttons = document.querySelectorAll('.lang-btn');

            languageManager.showLoadingState();

            buttons.forEach(button => {
                expect(button.disabled).toBe(true);
                expect(button.getAttribute('aria-busy')).toBe('true');
            });
        });

        test('should hide loading state after completion', async () => {
            languageManager = new LanguageManager();
            await languageManager.init();

            languageManager.showLoadingState();
            languageManager.hideLoadingState();

            const loadingIndicator = document.querySelector('.loading-indicator');
            const toggleContainer = document.querySelector('.language-toggle');
            const buttons = document.querySelectorAll('.lang-btn');

            expect(loadingIndicator.style.display).toBe('none');
            expect(toggleContainer.classList.contains('loading')).toBe(false);
            
            buttons.forEach(button => {
                expect(button.disabled).toBe(false);
                expect(button.getAttribute('aria-busy')).toBe('false');
            });
        });

        test('should announce language changes to screen readers', async () => {
            languageManager = new LanguageManager();
            await languageManager.init();

            const statusElement = document.getElementById('lang-status');
            
            languageManager.announceToScreenReader('Switching to Tamil language');

            await new Promise(resolve => setTimeout(resolve, 150));

            expect(statusElement.textContent).toBe('Switching to Tamil language');
        });

        test('should show error messages to users', () => {
            languageManager = new LanguageManager();
            
            const errorContainer = document.querySelector('.language-error');
            
            languageManager.showErrorMessage('Test error message');

            expect(errorContainer.style.display).toBe('block');
            expect(errorContainer.textContent).toBe('Test error message');
            expect(errorContainer.getAttribute('role')).toBe('alert');
        });

        test('should auto-hide error messages after timeout', async () => {
            jest.useFakeTimers();
            
            languageManager = new LanguageManager();
            
            const errorContainer = document.querySelector('.language-error');
            
            languageManager.showErrorMessage('Test error');

            expect(errorContainer.style.display).toBe('block');

            jest.advanceTimersByTime(8000);

            expect(errorContainer.style.display).toBe('none');
            
            jest.useRealTimers();
        });
    });

    describe('Content Loading and Caching Strategies', () => {
        test('should cache content after successful load', async () => {
            const testContent = {
                en: { pageTitle: 'About Us', historyContent: 'Content' },
                ta: { pageTitle: 'எங்களைப் பற்றி', historyContent: 'உள்ளடக்கம்' }
            };

            global.fetch = jest.fn(() => Promise.resolve({
                ok: true,
                headers: { get: () => 'application/json' },
                json: () => Promise.resolve(testContent)
            }));

            languageManager = new LanguageManager();
            await languageManager.init();

            const cached = localStorage.getItem('temple-language-content-cache');
            expect(cached).toBeTruthy();
            
            const cacheData = JSON.parse(cached);
            expect(cacheData.content).toEqual(testContent);
            expect(cacheData.version).toBe('1.0');
        });

        test('should use memory cache for subsequent requests', async () => {
            const testContent = {
                en: { pageTitle: 'About Us', historyContent: 'Content' },
                ta: { pageTitle: 'எங்களைப் பற்றி', historyContent: 'உள்ளடக்கம்' }
            };

            global.fetch = jest.fn(() => Promise.resolve({
                ok: true,
                headers: { get: () => 'application/json' },
                json: () => Promise.resolve(testContent)
            }));

            languageManager = new LanguageManager();
            await languageManager.init();

            const fetchCallCount = global.fetch.mock.calls.length;

            // Second initialization should use cache
            const languageManager2 = new LanguageManager();
            await languageManager2.init();

            expect(global.fetch.mock.calls.length).toBe(fetchCallCount);
        });

        test('should reject stale cached content', () => {
            const staleContent = {
                content: { en: {}, ta: {} },
                timestamp: Date.now() - (25 * 60 * 60 * 1000), // 25 hours old
                version: '1.0'
            };

            localStorage.setItem('temple-language-content-cache', JSON.stringify(staleContent));

            languageManager = new LanguageManager();
            const cached = languageManager.getCachedContent();

            expect(cached).toBeNull();
        });

        test('should accept fresh cached content', () => {
            const freshContent = {
                en: { pageTitle: 'Fresh', historyContent: 'Fresh content' },
                ta: { pageTitle: 'புதிய', historyContent: 'புதிய உள்ளடக்கம்' }
            };

            const cacheData = {
                content: freshContent,
                timestamp: Date.now() - (1 * 60 * 60 * 1000), // 1 hour old
                version: '1.0'
            };

            localStorage.setItem('temple-language-content-cache', JSON.stringify(cacheData));

            languageManager = new LanguageManager();
            const cached = languageManager.getCachedContent();

            expect(cached).toEqual(freshContent);
        });
    });

    describe('Performance Optimization', () => {
        test('should log performance metrics', async () => {
            const mockMark = jest.fn();
            const mockMeasure = jest.fn();
            
            global.performance = {
                now: () => Date.now(),
                mark: mockMark,
                measure: mockMeasure
            };

            languageManager = new LanguageManager();
            languageManager.performanceMetrics.loadStartTime = 100;
            languageManager.performanceMetrics.loadEndTime = 250;

            languageManager.logPerformanceMetrics('initialization');

            // Should log to console
            expect(console.log).toHaveBeenCalledWith(
                expect.stringContaining('Language Manager initialization took')
            );
        });

        test('should use optimized fade transitions when supported', async () => {
            languageManager = new LanguageManager();
            languageManager.browserCapabilities.intersectionObserver = true;

            const mainContent = document.querySelector('main');
            
            await languageManager.fadeOutContentOptimized();

            expect(mainContent.style.opacity).toBe('0.8');
            expect(mainContent.style.transform).toBe('translateY(-10px)');
        });

        test('should fallback to standard transitions when not supported', async () => {
            languageManager = new LanguageManager();
            languageManager.browserCapabilities.intersectionObserver = false;

            const mainContent = document.querySelector('main');
            
            await languageManager.fadeOutContent();

            expect(mainContent.style.opacity).toBe('0.7');
        });

        test('should timeout long-running operations', async () => {
            jest.useFakeTimers();

            languageManager = new LanguageManager();
            languageManager.isLoading = true;

            languageManager.showLoadingStateWithTimeout();

            jest.advanceTimersByTime(5000);

            expect(languageManager.isLoading).toBe(false);
            
            jest.useRealTimers();
        });
    });

    describe('Graceful Degradation for Unsupported Browsers', () => {
        test('should detect browser capabilities', () => {
            languageManager = new LanguageManager();

            expect(languageManager.browserCapabilities).toHaveProperty('localStorage');
            expect(languageManager.browserCapabilities).toHaveProperty('sessionStorage');
            expect(languageManager.browserCapabilities).toHaveProperty('fetch');
            expect(languageManager.browserCapabilities).toHaveProperty('promises');
            expect(languageManager.browserCapabilities).toHaveProperty('es6');
        });

        test('should use XHR fallback when fetch is not available', async () => {
            languageManager = new LanguageManager();
            languageManager.browserCapabilities.fetch = false;

            const mockXHR = {
                open: jest.fn(),
                send: jest.fn(),
                setRequestHeader: jest.fn(),
                status: 200,
                statusText: 'OK',
                responseText: JSON.stringify({
                    en: { pageTitle: 'About', historyContent: 'Content' },
                    ta: { pageTitle: 'பற்றி', historyContent: 'உள்ளடக்கம்' }
                }),
                getResponseHeader: jest.fn(() => 'application/json')
            };

            global.XMLHttpRequest = jest.fn(() => mockXHR);

            const response = await languageManager.loadContentWithXHR();

            expect(mockXHR.open).toHaveBeenCalledWith('GET', languageManager.contentPath, true);
            expect(response.ok).toBe(true);
        });

        test('should handle missing localStorage gracefully', () => {
            // Simulate localStorage not available
            const originalLocalStorage = global.localStorage;
            delete global.localStorage;

            languageManager = new LanguageManager();

            expect(languageManager.isStorageAvailable('localStorage')).toBe(false);

            // Restore
            global.localStorage = originalLocalStorage;
        });

        test('should use cookie fallback when storage is unavailable', () => {
            languageManager = new LanguageManager();
            
            // Mock storage as unavailable
            languageManager.browserCapabilities.localStorage = false;
            languageManager.browserCapabilities.sessionStorage = false;

            languageManager.saveLanguagePreference('ta');

            expect(document.cookie).toContain('temple-language-preference=ta');
        });

        test('should provide fallback content when all loading fails', async () => {
            global.fetch = jest.fn(() => Promise.reject(new Error('All methods failed')));
            
            languageManager = new LanguageManager();
            await languageManager.init();

            expect(languageManager.contentData).toEqual(languageManager.fallbackContent);
            expect(languageManager.errorState).toBe(true);
        });
    });

    describe('Network Status Monitoring', () => {
        test('should detect online status', () => {
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                value: true
            });

            languageManager = new LanguageManager();
            languageManager.setupNetworkMonitoring();

            expect(languageManager.networkStatus).toBe('online');
        });

        test('should detect offline status', () => {
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                value: false
            });

            languageManager = new LanguageManager();
            languageManager.setupNetworkMonitoring();

            expect(languageManager.networkStatus).toBe('offline');
        });

        test('should retry loading when coming back online', async () => {
            languageManager = new LanguageManager();
            languageManager.errorState = true;
            languageManager.networkStatus = 'offline';

            const retryLoadSpy = jest.spyOn(languageManager, 'retryContentLoad');

            languageManager.handleNetworkStatusChange('online');

            expect(retryLoadSpy).toHaveBeenCalled();
        });

        test('should show offline message when going offline', () => {
            languageManager = new LanguageManager();
            
            const showOfflineSpy = jest.spyOn(languageManager, 'showOfflineMessage');

            languageManager.handleNetworkStatusChange('offline');

            expect(showOfflineSpy).toHaveBeenCalled();
        });
    });

    describe('Mobile Device Performance', () => {
        test('should handle touch events on mobile', () => {
            languageManager = new LanguageManager();
            
            const button = document.querySelector('.lang-btn[data-lang="ta"]');
            const clickEvent = new Event('click');
            
            button.dispatchEvent(clickEvent);

            // Should not throw errors on mobile
            expect(languageManager.currentLanguage).toBeDefined();
        });

        test('should optimize animations for mobile', async () => {
            // Simulate mobile viewport
            global.innerWidth = 375;
            
            languageManager = new LanguageManager();
            
            const mainContent = document.querySelector('main');
            
            await languageManager.fadeOutContentOptimized();

            // Should complete quickly for mobile
            expect(mainContent.style.transition).toContain('0.15s');
        });
    });

    describe('Error Recovery', () => {
        test('should recover from language switch errors', async () => {
            languageManager = new LanguageManager();
            languageManager.currentLanguage = 'en';
            languageManager.contentData = {
                en: { pageTitle: 'About', historyContent: 'Content' },
                ta: { pageTitle: 'பற்றி', historyContent: 'உள்ளடக்கம்' }
            };

            // Simulate error during switch
            const error = new Error('Switch failed');
            
            languageManager.handleLanguageSwitchError(error, 'ta');

            // Should show error message
            const errorContainer = document.querySelector('.language-error');
            expect(errorContainer.style.display).toBe('block');
        });

        test('should log errors for debugging', () => {
            languageManager = new LanguageManager();
            
            languageManager.logError('Test error message');

            const errors = sessionStorage.getItem('language-manager-errors');
            expect(errors).toBeTruthy();
            
            const errorList = JSON.parse(errors);
            expect(errorList[0].message).toBe('Test error message');
        });

        test('should limit error log size', () => {
            languageManager = new LanguageManager();
            
            // Log 15 errors
            for (let i = 0; i < 15; i++) {
                languageManager.logError(`Error ${i}`);
            }

            const errors = JSON.parse(sessionStorage.getItem('language-manager-errors'));
            
            // Should keep only last 10
            expect(errors.length).toBe(10);
        });
    });
});
