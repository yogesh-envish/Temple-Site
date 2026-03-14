/**
 * LanguageManager - Handles language switching functionality for the temple website
 * Supports English and Tamil language switching with content persistence
 * Enhanced with performance optimization and comprehensive error handling
 */
class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.contentData = {};
        this.isLoading = false;
        this.contentPath = '/js/lang/about-content.json';
        
        // Performance optimization properties
        this.contentCache = new Map();
        this.loadingTimeout = null;
        this.retryAttempts = 0;
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
        
        // Error handling properties
        this.errorState = false;
        this.fallbackContent = null;
        this.networkStatus = 'online';
        
        // Performance monitoring
        this.performanceMetrics = {
            loadStartTime: null,
            loadEndTime: null,
            switchStartTime: null,
            switchEndTime: null
        };
        
        // Browser capability detection
        this.browserCapabilities = this.detectBrowserCapabilities();
        
        // Connection quality monitoring
        this.connectionQuality = 'unknown';
        this.effectiveType = 'unknown';
        
        // Initialize the language manager
        this.init();
    }

    /**
     * Initialize the language manager
     * Load content data and set up event handlers with error handling
     */
    async init() {
        try {
            this.performanceMetrics.loadStartTime = performance.now();
            
            // Set up network status monitoring
            this.setupNetworkMonitoring();
            
            // Detect connection quality for performance optimization
            this.detectConnectionQuality();
            
            // Set up fallback content for graceful degradation
            this.setupFallbackContent();
            
            // Load content with retry mechanism
            await this.loadLanguageDataWithRetry();
            
            this.setupEventHandlers();
            this.setupNavigationPersistence();
            this.loadUserPreference();
            
            this.performanceMetrics.loadEndTime = performance.now();
            this.logPerformanceMetrics('initialization');
            
        } catch (error) {
            console.error('Failed to initialize LanguageManager:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Detect browser capabilities for graceful degradation
     * @returns {Object} Browser capabilities object
     */
    detectBrowserCapabilities() {
        const capabilities = {
            localStorage: this.isStorageAvailable('localStorage'),
            sessionStorage: this.isStorageAvailable('sessionStorage'),
            fetch: typeof fetch !== 'undefined',
            promises: typeof Promise !== 'undefined',
            es6: (() => {
                try {
                    new Function('(a = 0) => a');
                    return true;
                } catch (e) {
                    return false;
                }
            })(),
            intersectionObserver: 'IntersectionObserver' in window,
            performanceAPI: 'performance' in window && 'now' in performance
        };
        
        console.log('Browser capabilities detected:', capabilities);
        return capabilities;
    }

    /**
     * Detect connection quality for performance optimization
     * Uses Network Information API when available
     */
    detectConnectionQuality() {
        try {
            // Check for Network Information API support
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            if (connection) {
                this.effectiveType = connection.effectiveType || 'unknown';
                
                // Determine connection quality based on effective type
                switch (this.effectiveType) {
                    case 'slow-2g':
                    case '2g':
                        this.connectionQuality = 'poor';
                        this.adjustForSlowConnection();
                        break;
                    case '3g':
                        this.connectionQuality = 'moderate';
                        this.adjustForModerateConnection();
                        break;
                    case '4g':
                    case '5g':
                        this.connectionQuality = 'good';
                        break;
                    default:
                        this.connectionQuality = 'unknown';
                }
                
                console.log(`Connection quality detected: ${this.connectionQuality} (${this.effectiveType})`);
                
                // Listen for connection changes
                connection.addEventListener('change', () => {
                    this.detectConnectionQuality();
                });
            } else {
                // Fallback: estimate based on load time
                this.estimateConnectionQuality();
            }
        } catch (error) {
            console.warn('Failed to detect connection quality:', error);
            this.connectionQuality = 'unknown';
        }
    }

    /**
     * Estimate connection quality based on performance metrics
     */
    estimateConnectionQuality() {
        try {
            if (this.browserCapabilities.performanceAPI) {
                const navigation = performance.getEntriesByType('navigation')[0];
                if (navigation) {
                    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
                    
                    if (loadTime < 1000) {
                        this.connectionQuality = 'good';
                    } else if (loadTime < 3000) {
                        this.connectionQuality = 'moderate';
                        this.adjustForModerateConnection();
                    } else {
                        this.connectionQuality = 'poor';
                        this.adjustForSlowConnection();
                    }
                    
                    console.log(`Connection quality estimated: ${this.connectionQuality} (load time: ${loadTime}ms)`);
                }
            }
        } catch (error) {
            console.warn('Failed to estimate connection quality:', error);
        }
    }

    /**
     * Adjust settings for slow connections
     */
    adjustForSlowConnection() {
        // Increase timeouts for slow connections
        this.retryDelay = 2000; // 2 seconds
        this.maxRetries = 2; // Reduce retries to fail faster
        
        // Show connection warning
        this.showConnectionWarning('slow');
        
        console.log('Adjusted settings for slow connection');
    }

    /**
     * Adjust settings for moderate connections
     */
    adjustForModerateConnection() {
        // Slightly increase timeouts
        this.retryDelay = 1500; // 1.5 seconds
        
        console.log('Adjusted settings for moderate connection');
    }

    /**
     * Show connection quality warning to users
     * @param {string} quality - Connection quality ('slow' or 'moderate')
     */
    showConnectionWarning(quality) {
        const networkStatus = document.getElementById('network-status');
        if (networkStatus) {
            const message = quality === 'slow' 
                ? 'Slow connection detected. Language switching may take longer.'
                : 'Moderate connection detected. Please be patient.';
            
            networkStatus.textContent = message;
            networkStatus.style.display = 'block';
            networkStatus.className = `network-status ${quality}`;
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                networkStatus.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Set up network status monitoring
     */
    setupNetworkMonitoring() {
        if ('navigator' in window && 'onLine' in navigator) {
            this.networkStatus = navigator.onLine ? 'online' : 'offline';
            
            window.addEventListener('online', () => {
                this.networkStatus = 'online';
                this.handleNetworkStatusChange('online');
            });
            
            window.addEventListener('offline', () => {
                this.networkStatus = 'offline';
                this.handleNetworkStatusChange('offline');
            });
        }
    }

    /**
     * Handle network status changes
     * @param {string} status - Network status ('online' or 'offline')
     */
    handleNetworkStatusChange(status) {
        if (status === 'online' && this.errorState) {
            // Try to reload content when back online
            this.retryContentLoad();
        } else if (status === 'offline') {
            // Show offline message
            this.showOfflineMessage();
        }
    }

    /**
     * Set up fallback content for graceful degradation
     */
    setupFallbackContent() {
        this.fallbackContent = {
            en: {
                pageTitle: "About Us",
                pageHeader: "About Sri Kaliyuga Ranganathar Temple",
                breadcrumb: {
                    home: "Home",
                    about: "About Us"
                },
                sectionTitle: "Divine History",
                historyContent: "Welcome to Sri Kaliyuga Ranganathar Temple. Content is currently loading...",
                imageAlt: "Sri Kaliyuga Ranganathar Temple"
            },
            ta: {
                pageTitle: "எங்களைப் பற்றி",
                pageHeader: "ஸ்ரீ கலியுக ரங்கநாதர் கோயில் பற்றி",
                breadcrumb: {
                    home: "முகப்பு",
                    about: "எங்களைப் பற்றி"
                },
                sectionTitle: "தெய்வீக வரலாறு",
                historyContent: "ஸ்ரீ கலியுக ரங்கநாதர் கோயிலுக்கு வரவேற்கிறோம். உள்ளடக்கம் தற்போது ஏற்றப்படுகிறது...",
                imageAlt: "ஸ்ரீ கலியுக ரங்கநாதர் கோயில்"
            }
        };
    }

    /**
     * Load language data with retry mechanism and caching
     * @returns {Promise<void>}
     */
    async loadLanguageDataWithRetry() {
        const cacheKey = 'language-content';
        
        // Check cache first
        if (this.contentCache.has(cacheKey)) {
            this.contentData = this.contentCache.get(cacheKey);
            return;
        }
        
        // Check if content is cached in localStorage for offline use
        const cachedContent = this.getCachedContent();
        if (cachedContent && this.networkStatus === 'offline') {
            this.contentData = cachedContent;
            this.showOfflineMessage();
            return;
        }
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                this.retryAttempts = attempt;
                await this.loadLanguageData();
                
                // Cache successful load
                this.contentCache.set(cacheKey, this.contentData);
                this.cacheContentLocally(this.contentData);
                
                this.errorState = false;
                this.hideErrorMessage();
                return;
                
            } catch (error) {
                console.warn(`Language data load attempt ${attempt} failed:`, error);
                
                if (attempt === this.maxRetries) {
                    // Final attempt failed, use fallback
                    this.handleContentLoadFailure(error);
                    return;
                }
                
                // Wait before retry with exponential backoff
                const delay = this.retryDelay * Math.pow(2, attempt - 1);
                await this.delay(delay);
            }
        }
    }

    /**
     * Handle content load failure with graceful degradation
     * @param {Error} error - The error that occurred
     */
    handleContentLoadFailure(error) {
        console.error('All attempts to load language content failed:', error);
        
        this.errorState = true;
        
        // Try to use cached content first
        const cachedContent = this.getCachedContent();
        if (cachedContent) {
            this.contentData = cachedContent;
            this.showCachedContentMessage();
        } else {
            // Use fallback content as last resort
            this.contentData = this.fallbackContent;
            this.showFallbackMessage();
        }
    }

    /**
     * Handle initialization errors
     * @param {Error} error - The initialization error
     */
    handleInitializationError(error) {
        this.errorState = true;
        
        // Use fallback content
        this.contentData = this.fallbackContent;
        
        // Set up minimal functionality
        this.setupBasicEventHandlers();
        this.loadUserPreference();
        
        // Show error message to user
        this.showInitializationError();
    }

    /**
     * Set up basic event handlers for error state
     */
    setupBasicEventHandlers() {
        const languageButtons = document.querySelectorAll('.lang-btn');
        
        languageButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.errorState) {
                    this.showErrorMessage('Language switching is temporarily unavailable. Please refresh the page.');
                    return;
                }
                
                const langCode = button.getAttribute('data-lang');
                if (langCode && langCode !== this.currentLanguage) {
                    this.switchLanguage(langCode);
                }
            });
        });
    }

    /**
     * Load language content from JSON file with enhanced error handling
     * @returns {Promise<void>}
     */
    async loadLanguageData() {
        try {
            // Set loading timeout
            this.loadingTimeout = setTimeout(() => {
                throw new Error('Content loading timeout');
            }, 10000); // 10 second timeout
            
            let response;
            
            if (this.browserCapabilities.fetch) {
                response = await fetch(this.contentPath, {
                    cache: 'default',
                    headers: {
                        'Accept': 'application/json',
                        'Cache-Control': 'max-age=300' // 5 minutes cache
                    }
                });
            } else {
                // Fallback for older browsers
                response = await this.loadContentWithXHR();
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid content type. Expected JSON.');
            }
            
            this.contentData = await response.json();
            
            // Validate content structure
            this.validateContentStructure(this.contentData);
            
            clearTimeout(this.loadingTimeout);
            
        } catch (error) {
            clearTimeout(this.loadingTimeout);
            console.error('Error loading language data:', error);
            throw error;
        }
    }

    /**
     * Fallback content loading using XMLHttpRequest for older browsers
     * @returns {Promise<Response>} Response-like object
     */
    loadContentWithXHR() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', this.contentPath, true);
            xhr.setRequestHeader('Accept', 'application/json');
            
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve({
                        ok: true,
                        status: xhr.status,
                        statusText: xhr.statusText,
                        headers: {
                            get: (name) => xhr.getResponseHeader(name)
                        },
                        json: () => Promise.resolve(JSON.parse(xhr.responseText))
                    });
                } else {
                    reject(new Error(`XHR error! status: ${xhr.status}`));
                }
            };
            
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.ontimeout = () => reject(new Error('Request timeout'));
            xhr.timeout = 8000; // 8 second timeout for XHR
            
            xhr.send();
        });
    }

    /**
     * Validate content structure to ensure it has required properties
     * @param {Object} content - Content object to validate
     */
    validateContentStructure(content) {
        const requiredLanguages = ['en', 'ta'];
        const requiredFields = ['pageTitle', 'pageHeader', 'breadcrumb', 'sectionTitle', 'historyContent', 'imageAlt'];
        
        for (const lang of requiredLanguages) {
            if (!content[lang]) {
                throw new Error(`Missing language content for: ${lang}`);
            }
            
            for (const field of requiredFields) {
                if (field === 'breadcrumb') {
                    if (!content[lang][field] || !content[lang][field].home || !content[lang][field].about) {
                        throw new Error(`Missing breadcrumb content for language: ${lang}`);
                    }
                } else if (!content[lang][field]) {
                    throw new Error(`Missing field '${field}' for language: ${lang}`);
                }
            }
        }
    }

    /**
     * Set up event handlers for language toggle buttons
     */
    setupEventHandlers() {
        const languageButtons = document.querySelectorAll('.lang-btn');
        
        languageButtons.forEach(button => {
            // Click event handler
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const langCode = button.getAttribute('data-lang');
                if (langCode && langCode !== this.currentLanguage) {
                    this.switchLanguage(langCode);
                }
            });

            // Enhanced keyboard support - Tab navigation only
            button.addEventListener('keydown', (e) => {
                const langCode = button.getAttribute('data-lang');
                
                // Handle Enter and Space keys for activation
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (langCode && langCode !== this.currentLanguage) {
                        this.switchLanguage(langCode);
                    }
                }
                
                // Remove arrow key navigation - users should use Tab instead
                // This ensures standard keyboard navigation behavior
            });

            // Add focus event for screen reader announcements
            button.addEventListener('focus', () => {
                this.announceButtonFocus(button);
            });
        });
    }

    /**
     * Announce button focus for screen readers
     * @param {HTMLElement} button - Focused button
     */
    announceButtonFocus(button) {
        const langCode = button.getAttribute('data-lang');
        const isActive = button.classList.contains('active');
        const langName = langCode === 'en' ? 'English' : 'Tamil';
        
        const announcement = isActive 
            ? `${langName} language currently selected`
            : `Switch to ${langName} language`;
            
        this.announceToScreenReader(announcement);
    }

    /**
     * Switch to the specified language with enhanced performance and error handling
     * @param {string} langCode - Language code ('en' or 'ta')
     */
    async switchLanguage(langCode) {
        if (this.isLoading || !this.contentData[langCode]) {
            if (!this.contentData[langCode]) {
                this.showErrorMessage(`Language '${langCode}' is not available.`);
            }
            return;
        }

        try {
            this.performanceMetrics.switchStartTime = performance.now();
            this.isLoading = true;
            
            // Show loading state with timeout protection
            this.showLoadingStateWithTimeout();
            
            // Announce language change start to screen readers
            const langName = langCode === 'en' ? 'English' : 'Tamil';
            this.announceToScreenReader(`Switching to ${langName} language`);
            
            // Add smooth transition effect with performance optimization
            if (this.browserCapabilities.intersectionObserver) {
                await this.fadeOutContentOptimized();
            } else {
                await this.fadeOutContent();
            }
            
            // Update content with error handling
            this.updateContentSafely(langCode);
            
            // Update UI state and ARIA attributes
            this.updateLanguageToggle(langCode);
            
            // Update document language attributes
            this.updateDocumentLanguage(langCode);
            
            // Save preference with error handling
            this.saveLanguagePreferenceSafely(langCode);
            
            // Update current language
            this.currentLanguage = langCode;
            
            // Fade content back in
            if (this.browserCapabilities.intersectionObserver) {
                await this.fadeInContentOptimized();
            } else {
                await this.fadeInContent();
            }
            
            // Announce completion to screen readers
            this.announceToScreenReader(`Language changed to ${langName}. Page content is now in ${langName}.`);
            
            // Focus management - return focus to the activated button
            this.manageFocusAfterSwitch(langCode);
            
            this.performanceMetrics.switchEndTime = performance.now();
            this.logPerformanceMetrics('language-switch');
            
        } catch (error) {
            console.error('Error switching language:', error);
            this.handleLanguageSwitchError(error, langCode);
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
        }
    }

    /**
     * Update content with error handling and validation
     * @param {string} langCode - Language code
     */
    updateContentSafely(langCode) {
        try {
            const content = this.contentData[langCode];
            if (!content) {
                throw new Error(`No content found for language: ${langCode}`);
            }

            // Validate content before updating
            this.validateContentBeforeUpdate(content);
            
            // Update content with error handling for each element
            this.updateContentElements(content, langCode);
            
        } catch (error) {
            console.error('Error updating content:', error);
            this.handleContentUpdateError(error, langCode);
        }
    }

    /**
     * Validate content before updating DOM
     * @param {Object} content - Content object to validate
     */
    validateContentBeforeUpdate(content) {
        const requiredFields = ['pageTitle', 'pageHeader', 'sectionTitle', 'historyContent'];
        
        for (const field of requiredFields) {
            if (!content[field] || typeof content[field] !== 'string' || content[field].trim() === '') {
                console.warn(`Invalid or empty content for field: ${field}`);
            }
        }
    }

    /**
     * Update individual content elements with error handling
     * @param {Object} content - Content object
     * @param {string} langCode - Language code
     */
    updateContentElements(content, langCode) {
        const updates = [
            {
                selector: 'h1, .page-title, [data-lang-key="pageTitle"]',
                content: content.pageTitle,
                type: 'text'
            },
            {
                selector: '.page-header h1, [data-lang-key="pageHeader"]',
                content: content.pageHeader,
                type: 'text'
            },
            {
                selector: '.breadcrumb [data-lang-key="home"], .breadcrumb a[href="/"]',
                content: content.breadcrumb?.home,
                type: 'text'
            },
            {
                selector: '.breadcrumb [data-lang-key="about"], .breadcrumb .active',
                content: content.breadcrumb?.about,
                type: 'text'
            },
            {
                selector: '.section-title, [data-lang-key="sectionTitle"]',
                content: content.sectionTitle,
                type: 'text'
            },
            {
                selector: '.history-content, [data-lang-key="historyContent"]',
                content: content.historyContent,
                type: 'text'
            },
            {
                selector: '.temple-image, [data-lang-key="imageAlt"]',
                content: content.imageAlt,
                type: 'alt'
            }
        ];

        updates.forEach(update => {
            try {
                const element = document.querySelector(update.selector);
                if (element && update.content) {
                    if (update.type === 'alt') {
                        element.setAttribute('alt', update.content);
                    } else {
                        element.textContent = update.content;
                    }
                    
                    // Update language attribute for the element
                    element.setAttribute('lang', langCode === 'ta' ? 'ta' : 'en');
                }
            } catch (error) {
                console.warn(`Failed to update element with selector '${update.selector}':`, error);
            }
        });

        // Update browser tab title safely
        try {
            if (content.pageTitle) {
                document.title = `${content.pageTitle} - Sri Kaliyuga Ranganathar Temple`;
            }
        } catch (error) {
            console.warn('Failed to update document title:', error);
        }

        // Update elements with data-lang-key attributes
        this.updateDataLangKeyElements(content, langCode);

        // Update document language attribute
        try {
            document.documentElement.setAttribute('lang', langCode === 'ta' ? 'ta' : 'en');
        } catch (error) {
            console.warn('Failed to update document language:', error);
        }
    }

    /**
     * Update elements with data-lang-key attributes safely
     * @param {Object} content - Content object
     * @param {string} langCode - Language code
     */
    updateDataLangKeyElements(content, langCode) {
        try {
            document.querySelectorAll('[data-lang-key]').forEach(element => {
                try {
                    const key = element.getAttribute('data-lang-key');
                    const value = this.getNestedValue(content, key);
                    if (value) {
                        if (element.tagName === 'IMG') {
                            element.setAttribute('alt', value);
                        } else {
                            element.textContent = value;
                        }
                        
                        // Update language attribute for the element
                        element.setAttribute('lang', langCode === 'ta' ? 'ta' : 'en');
                    }
                } catch (error) {
                    console.warn('Failed to update element with data-lang-key:', error);
                }
            });
        } catch (error) {
            console.warn('Failed to update data-lang-key elements:', error);
        }
    }

    /**
     * Set up navigation persistence to maintain language state across pages
     */
    setupNavigationPersistence() {
        // Listen for page visibility changes to save state
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.saveCurrentState();
            }
        });

        // Listen for beforeunload to save state before navigation
        window.addEventListener('beforeunload', () => {
            this.saveCurrentState();
        });

        // Listen for page focus to restore state if needed
        window.addEventListener('focus', () => {
            this.validateCurrentState();
        });

        // Set up periodic state validation (every 30 seconds)
        setInterval(() => {
            this.validateCurrentState();
        }, 30000);
    }

    /**
     * Save current language state
     */
    saveCurrentState() {
        if (this.currentLanguage) {
            this.saveLanguagePreference(this.currentLanguage);
            
            // Also save timestamp for state validation
            const stateData = {
                language: this.currentLanguage,
                timestamp: Date.now()
            };
            
            try {
                if (this.isStorageAvailable('sessionStorage')) {
                    sessionStorage.setItem('temple-language-state', JSON.stringify(stateData));
                }
            } catch (error) {
                console.warn('Failed to save language state:', error);
            }
        }
    }

    /**
     * Validate and restore current state if needed
     */
    validateCurrentState() {
        try {
            if (this.isStorageAvailable('sessionStorage')) {
                const stateData = sessionStorage.getItem('temple-language-state');
                if (stateData) {
                    const parsed = JSON.parse(stateData);
                    const timeDiff = Date.now() - parsed.timestamp;
                    
                    // If state is recent (within 1 hour) and different from current, restore it
                    if (timeDiff < 3600000 && parsed.language !== this.currentLanguage) {
                        if (this.contentData[parsed.language]) {
                            this.switchLanguage(parsed.language);
                        }
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to validate language state:', error);
        }
    }

    /**
     * Clear stored language state (useful for testing or reset)
     */
    clearStoredState() {
        try {
            if (this.isStorageAvailable('localStorage')) {
                localStorage.removeItem('temple-language-preference');
            }
            if (this.isStorageAvailable('sessionStorage')) {
                sessionStorage.removeItem('temple-language-preference');
                sessionStorage.removeItem('temple-language-state');
            }
            
            // Clear cookie
            document.cookie = 'temple-language-preference=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            
            // Reset to default language
            this.switchLanguage('en');
        } catch (error) {
            console.warn('Failed to clear stored state:', error);
        }
    }

    /**
     * Update language toggle button states
     * @param {string} langCode - Active language code
     */
    updateLanguageToggle(langCode) {
        const languageButtons = document.querySelectorAll('.lang-btn');
        
        languageButtons.forEach(button => {
            const buttonLang = button.getAttribute('data-lang');
            const langName = buttonLang === 'en' ? 'English' : 'Tamil';
            
            if (buttonLang === langCode) {
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
                button.setAttribute('aria-label', `${langName} language (current selection)`);
                button.setAttribute('title', `${langName} (current)`);
                // Both buttons should be in tab order for standard navigation
                button.setAttribute('tabindex', '0');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-pressed', 'false');
                button.setAttribute('aria-label', `${langName} language`);
                button.setAttribute('title', `Switch to ${langName}`);
                // Both buttons should be in tab order for standard navigation
                button.setAttribute('tabindex', '0');
            }
        });
    }

    /**
     * Update document language attributes for accessibility
     * @param {string} langCode - Language code
     */
    updateDocumentLanguage(langCode) {
        // Update main document language
        document.documentElement.setAttribute('lang', langCode === 'ta' ? 'ta' : 'en');
        
        // Update content sections with language attributes
        const contentSections = document.querySelectorAll('.history-section, .history-content, [role="article"]');
        contentSections.forEach(section => {
            section.setAttribute('lang', langCode === 'ta' ? 'ta' : 'en');
        });
        
        // Update page title language
        const pageTitle = document.querySelector('title');
        if (pageTitle) {
            pageTitle.setAttribute('lang', langCode === 'ta' ? 'ta' : 'en');
        }
        
        // Update breadcrumb navigation language
        const breadcrumb = document.querySelector('[aria-label="breadcrumb"]');
        if (breadcrumb) {
            breadcrumb.setAttribute('lang', langCode === 'ta' ? 'ta' : 'en');
        }
    }

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - Announcement priority ('polite' or 'assertive')
     */
    announceToScreenReader(message, priority = 'polite') {
        const statusElement = document.getElementById('lang-status');
        if (statusElement) {
            // Clear previous message
            statusElement.textContent = '';
            statusElement.setAttribute('aria-live', priority);
            
            // Set new message after a brief delay to ensure it's announced
            setTimeout(() => {
                statusElement.textContent = message;
            }, 100);
            
            // Clear message after announcement
            setTimeout(() => {
                statusElement.textContent = '';
            }, 3000);
        }
    }

    /**
     * Save language preference with multiple fallback mechanisms
     * @param {string} langCode - Language code to save
     */
    saveLanguagePreference(langCode) {
        let saved = false;

        // Try localStorage first
        if (this.isStorageAvailable('localStorage')) {
            try {
                localStorage.setItem('temple-language-preference', langCode);
                saved = true;
            } catch (error) {
                console.warn('Failed to save to localStorage:', error);
            }
        }

        // Fallback to sessionStorage if localStorage failed
        if (!saved && this.isStorageAvailable('sessionStorage')) {
            try {
                sessionStorage.setItem('temple-language-preference', langCode);
                saved = true;
            } catch (error) {
                console.warn('Failed to save to sessionStorage:', error);
            }
        }

        // Final fallback: save to cookie
        if (!saved) {
            try {
                const expiryDate = new Date();
                expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year expiry
                document.cookie = `temple-language-preference=${langCode}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
                saved = true;
            } catch (error) {
                console.warn('Failed to save to cookie:', error);
            }
        }

        if (!saved) {
            console.error('Unable to save language preference using any storage method');
        }
    }

    /**
     * Update content without animation (used during initialization)
     * @param {string} langCode - Language code
     */
    updateContent(langCode) {
        try {
            const content = this.contentData[langCode];
            if (content) {
                this.updateContentElements(content, langCode);
            }
        } catch (error) {
            console.warn('Failed to update content:', error);
        }
    }

    /**
     * Load user's language preference and apply it
     */
    loadUserPreference() {
        const savedLanguage = this.getStoredLanguagePreference();
        
        // Apply saved language or default to English
        const languageToApply = savedLanguage && this.contentData[savedLanguage] ? savedLanguage : 'en';
        
        if (languageToApply !== this.currentLanguage) {
            this.updateContent(languageToApply);
            this.updateLanguageToggle(languageToApply);
            this.updateDocumentLanguage(languageToApply);
            this.currentLanguage = languageToApply;
        } else {
            // Still need to update toggle state and accessibility attributes for default language
            this.updateLanguageToggle(this.currentLanguage);
            this.updateDocumentLanguage(this.currentLanguage);
        }
        
        // Set up initial accessibility state
        this.setupInitialAccessibility();
    }

    /**
     * Set up initial accessibility features
     */
    setupInitialAccessibility() {
        // Add skip link for keyboard navigation
        this.addSkipLink();
        
        // Set up focus trap for language toggle when needed
        this.setupFocusManagement();
        
        // Announce initial language state
        const langName = this.currentLanguage === 'en' ? 'English' : 'Tamil';
        setTimeout(() => {
            this.announceToScreenReader(`Page loaded in ${langName} language. Use language toggle to switch languages.`);
        }, 1000);
    }

    /**
     * Add skip link for keyboard navigation
     */
    addSkipLink() {
        const existingSkipLink = document.querySelector('.skip-link');
        if (!existingSkipLink) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.textContent = 'Skip to main content';
            skipLink.setAttribute('aria-label', 'Skip navigation and go to main content');
            
            document.body.insertBefore(skipLink, document.body.firstChild);
            
            // Add main content landmark if it doesn't exist
            const mainContent = document.querySelector('main, [role="main"]');
            if (mainContent && !mainContent.id) {
                mainContent.id = 'main-content';
            }
        }
    }

    /**
     * Set up focus management for better keyboard navigation
     */
    setupFocusManagement() {
        // Set up standard button navigation for language toggle
        const languageButtons = document.querySelectorAll('.lang-btn');
        languageButtons.forEach((button, index) => {
            // Set proper ARIA attributes
            button.setAttribute('aria-setsize', languageButtons.length.toString());
            button.setAttribute('aria-posinset', (index + 1).toString());
            
            // Both buttons should be in tab order for standard navigation
            button.setAttribute('tabindex', '0');
        });
        
        // Update the language toggle container to use group instead of radiogroup
        const languageToggle = document.querySelector('.language-toggle');
        if (languageToggle) {
            languageToggle.setAttribute('role', 'group');
            languageToggle.setAttribute('aria-label', 'Language selection');
        }
    }

    /**
     * Get stored language preference with fallback mechanisms
     * @returns {string|null} Stored language preference or null
     */
    getStoredLanguagePreference() {
        // Try localStorage first
        if (this.isStorageAvailable('localStorage')) {
            try {
                const preference = localStorage.getItem('temple-language-preference');
                if (preference) {
                    return preference;
                }
            } catch (error) {
                console.warn('Failed to read from localStorage:', error);
            }
        }

        // Fallback to sessionStorage
        if (this.isStorageAvailable('sessionStorage')) {
            try {
                const preference = sessionStorage.getItem('temple-language-preference');
                if (preference) {
                    return preference;
                }
            } catch (error) {
                console.warn('Failed to read from sessionStorage:', error);
            }
        }

        // Final fallback: check for URL parameter or cookie
        return this.getLanguageFromAlternativeSources();
    }

    /**
     * Check if storage type is available
     * @param {string} type - Storage type ('localStorage' or 'sessionStorage')
     * @returns {boolean} True if storage is available
     */
    isStorageAvailable(type) {
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

    /**
     * Get language preference from alternative sources (URL params, cookies)
     * @returns {string|null} Language preference or null
     */
    getLanguageFromAlternativeSources() {
        // Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && (urlLang === 'en' || urlLang === 'ta')) {
            return urlLang;
        }

        // Check for language cookie as final fallback
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'temple-language-preference' && (value === 'en' || value === 'ta')) {
                return value;
            }
        }

        return null;
    }

    /**
     * Show loading state during language switching with timeout protection
     */
    showLoadingStateWithTimeout() {
        this.showLoadingState();
        
        // Set timeout to prevent infinite loading state
        setTimeout(() => {
            if (this.isLoading) {
                this.hideLoadingState();
                this.isLoading = false;
                this.showErrorMessage('Language switching took too long. Please try again.');
            }
        }, 5000); // 5 second timeout
    }

    /**
     * Show loading state during language switching
     */
    showLoadingState() {
        const toggleContainer = document.querySelector('.language-toggle');
        if (toggleContainer) {
            toggleContainer.classList.add('loading');
            
            // Add loading indicator
            let loadingIndicator = toggleContainer.querySelector('.loading-indicator');
            if (!loadingIndicator) {
                loadingIndicator = document.createElement('div');
                loadingIndicator.className = 'loading-indicator';
                loadingIndicator.innerHTML = '<span class="spinner" aria-hidden="true"></span>';
                loadingIndicator.setAttribute('aria-label', 'Loading language content');
                toggleContainer.appendChild(loadingIndicator);
            }
            loadingIndicator.style.display = 'block';
        }
        
        // Disable language buttons during loading
        const languageButtons = document.querySelectorAll('.lang-btn');
        languageButtons.forEach(button => {
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');
        });
    }

    /**
     * Hide loading state after language switching
     */
    hideLoadingState() {
        const toggleContainer = document.querySelector('.language-toggle');
        if (toggleContainer) {
            toggleContainer.classList.remove('loading');
            
            const loadingIndicator = toggleContainer.querySelector('.loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }
        
        // Re-enable language buttons
        const languageButtons = document.querySelectorAll('.lang-btn');
        languageButtons.forEach(button => {
            button.disabled = false;
            button.setAttribute('aria-busy', 'false');
        });
    }

    /**
     * Optimized fade out content for better performance
     * @returns {Promise<void>}
     */
    fadeOutContentOptimized() {
        return new Promise(resolve => {
            const mainContent = document.querySelector('main, .main-content, .container');
            if (mainContent && this.browserCapabilities.intersectionObserver) {
                // Use CSS transforms for better performance
                mainContent.style.transform = 'translateY(-10px)';
                mainContent.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out';
                mainContent.style.opacity = '0.8';
                
                // Use requestAnimationFrame for smooth animation
                requestAnimationFrame(() => {
                    setTimeout(resolve, 150);
                });
            } else {
                this.fadeOutContent().then(resolve);
            }
        });
    }

    /**
     * Optimized fade in content for better performance
     * @returns {Promise<void>}
     */
    fadeInContentOptimized() {
        return new Promise(resolve => {
            const mainContent = document.querySelector('main, .main-content, .container');
            if (mainContent && this.browserCapabilities.intersectionObserver) {
                // Use requestAnimationFrame for smooth animation
                requestAnimationFrame(() => {
                    mainContent.style.opacity = '1';
                    mainContent.style.transform = 'translateY(0)';
                    
                    setTimeout(() => {
                        mainContent.style.transition = '';
                        mainContent.style.transform = '';
                        resolve();
                    }, 150);
                });
            } else {
                this.fadeInContent().then(resolve);
            }
        });
    }

    /**
     * Manage focus after language switch
     * @param {string} langCode - Language code that was switched to
     */
    manageFocusAfterSwitch(langCode) {
        try {
            const activeButton = document.querySelector(`.lang-btn[data-lang="${langCode}"]`);
            if (activeButton && document.activeElement !== activeButton) {
                // Only move focus if it was on a language button
                const focusedElement = document.activeElement;
                if (focusedElement && focusedElement.classList.contains('lang-btn')) {
                    activeButton.focus();
                }
            }
        } catch (error) {
            console.warn('Failed to manage focus after language switch:', error);
        }
    }

    /**
     * Handle language switch errors
     * @param {Error} error - The error that occurred
     * @param {string} langCode - Language code that failed to switch
     */
    handleLanguageSwitchError(error, langCode) {
        const langName = langCode === 'en' ? 'English' : 'Tamil';
        const errorMessage = `Failed to switch to ${langName}. Please try again.`;
        
        this.showErrorMessage(errorMessage);
        this.announceToScreenReader(`Error: ${errorMessage}`);
        
        // Try to revert to previous language if possible
        if (this.contentData[this.currentLanguage]) {
            setTimeout(() => {
                this.updateContentSafely(this.currentLanguage);
                this.updateLanguageToggle(this.currentLanguage);
            }, 1000);
        }
    }

    /**
     * Handle content update errors
     * @param {Error} error - The error that occurred
     * @param {string} langCode - Language code that failed to update
     */
    handleContentUpdateError(error, langCode) {
        console.error('Content update error:', error);
        
        // Try to use fallback content for this language
        if (this.fallbackContent[langCode]) {
            try {
                this.updateContentElements(this.fallbackContent[langCode], langCode);
                this.showFallbackMessage();
            } catch (fallbackError) {
                console.error('Fallback content update also failed:', fallbackError);
                this.showErrorMessage('Unable to display content. Please refresh the page.');
            }
        }
    }

    /**
     * Cache content locally for offline use
     * @param {Object} content - Content to cache
     */
    cacheContentLocally(content) {
        try {
            if (this.browserCapabilities.localStorage) {
                const cacheData = {
                    content: content,
                    timestamp: Date.now(),
                    version: '1.0'
                };
                localStorage.setItem('temple-language-content-cache', JSON.stringify(cacheData));
            }
        } catch (error) {
            console.warn('Failed to cache content locally:', error);
        }
    }

    /**
     * Get cached content for offline use
     * @returns {Object|null} Cached content or null
     */
    getCachedContent() {
        try {
            if (this.browserCapabilities.localStorage) {
                const cached = localStorage.getItem('temple-language-content-cache');
                if (cached) {
                    const cacheData = JSON.parse(cached);
                    
                    // Check if cache is not too old (24 hours)
                    const cacheAge = Date.now() - cacheData.timestamp;
                    if (cacheAge < 24 * 60 * 60 * 1000) {
                        return cacheData.content;
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to retrieve cached content:', error);
        }
        return null;
    }

    /**
     * Retry content loading when network comes back online
     */
    async retryContentLoad() {
        if (this.errorState && this.networkStatus === 'online') {
            try {
                await this.loadLanguageDataWithRetry();
                this.errorState = false;
                this.hideErrorMessage();
                this.announceToScreenReader('Language content reloaded successfully.');
            } catch (error) {
                console.warn('Failed to reload content after network recovery:', error);
            }
        }
    }

    /**
     * Save language preference with enhanced error handling
     * @param {string} langCode - Language code to save
     */
    saveLanguagePreferenceSafely(langCode) {
        try {
            this.saveLanguagePreference(langCode);
        } catch (error) {
            console.warn('Failed to save language preference:', error);
            // Continue without saving preference - not critical for functionality
        }
    }

    /**
     * Show error message to user
     * @param {string} message - Error message to display
     */
    showErrorMessage(message) {
        const errorContainer = document.querySelector('.language-error');
        if (errorContainer) {
            errorContainer.textContent = message;
            errorContainer.style.display = 'block';
            errorContainer.setAttribute('role', 'alert');
            
            // Auto-hide after 8 seconds
            setTimeout(() => {
                this.hideErrorMessage();
            }, 8000);
        }
    }

    /**
     * Hide error message
     */
    hideErrorMessage() {
        const errorContainer = document.querySelector('.language-error');
        if (errorContainer) {
            errorContainer.style.display = 'none';
            errorContainer.removeAttribute('role');
        }
    }

    /**
     * Show offline message
     */
    showOfflineMessage() {
        this.showErrorMessage('You are currently offline. Using cached content.');
    }

    /**
     * Show cached content message
     */
    showCachedContentMessage() {
        this.showErrorMessage('Using cached content. Some information may not be up to date.');
    }

    /**
     * Show fallback message
     */
    showFallbackMessage() {
        this.showErrorMessage('Loading basic content. Please check your internet connection.');
    }

    /**
     * Show initialization error
     */
    showInitializationError() {
        this.showErrorMessage('Language switching is temporarily unavailable. Please refresh the page.');
    }

    /**
     * Log performance metrics for monitoring
     * @param {string} operation - Operation name
     */
    logPerformanceMetrics(operation) {
        if (!this.browserCapabilities.performanceAPI) {
            return;
        }
        
        try {
            let duration = 0;
            
            if (operation === 'initialization') {
                duration = this.performanceMetrics.loadEndTime - this.performanceMetrics.loadStartTime;
            } else if (operation === 'language-switch') {
                duration = this.performanceMetrics.switchEndTime - this.performanceMetrics.switchStartTime;
            }
            
            console.log(`Language Manager ${operation} took ${duration.toFixed(2)}ms`);
            
            // Log to performance API if available
            if ('mark' in performance && 'measure' in performance) {
                performance.mark(`language-manager-${operation}-end`);
                performance.measure(`language-manager-${operation}`, `language-manager-${operation}-start`, `language-manager-${operation}-end`);
            }
            
        } catch (error) {
            console.warn('Failed to log performance metrics:', error);
        }
    }

    /**
     * Utility function to create a delay
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise<void>}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Fade out content for smooth transition
     * @returns {Promise<void>}
     */
    fadeOutContent() {
        return new Promise(resolve => {
            const mainContent = document.querySelector('main, .main-content, .container');
            if (mainContent) {
                mainContent.style.transition = 'opacity 0.2s ease-out';
                mainContent.style.opacity = '0.7';
                setTimeout(resolve, 200);
            } else {
                resolve();
            }
        });
    }

    /**
     * Fade in content after language switch
     * @returns {Promise<void>}
     */
    fadeInContent() {
        return new Promise(resolve => {
            const mainContent = document.querySelector('main, .main-content, .container');
            if (mainContent) {
                mainContent.style.opacity = '1';
                setTimeout(() => {
                    mainContent.style.transition = '';
                    resolve();
                }, 200);
            } else {
                resolve();
            }
        });
    }

    /**
     * Handle errors during language operations with enhanced error reporting
     * @param {string} message - Error message to display
     */
    handleError(message) {
        console.error('LanguageManager Error:', message);
        
        // Show user-friendly error message
        this.showErrorMessage(message);
        
        // Log error for debugging
        this.logError(message);
    }

    /**
     * Log error for debugging and monitoring
     * @param {string} message - Error message
     */
    logError(message) {
        try {
            const errorData = {
                message: message,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                networkStatus: this.networkStatus,
                browserCapabilities: this.browserCapabilities
            };
            
            // Store error in sessionStorage for debugging
            if (this.browserCapabilities.sessionStorage) {
                const existingErrors = sessionStorage.getItem('language-manager-errors');
                const errors = existingErrors ? JSON.parse(existingErrors) : [];
                errors.push(errorData);
                
                // Keep only last 10 errors
                if (errors.length > 10) {
                    errors.splice(0, errors.length - 10);
                }
                
                sessionStorage.setItem('language-manager-errors', JSON.stringify(errors));
            }
        } catch (error) {
            console.warn('Failed to log error:', error);
        }
    }

    /**
     * Get current language code
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Check if language switching is available
     * @returns {boolean} True if language switching is available
     */
    isLanguageSwitchingAvailable() {
        return Object.keys(this.contentData).length > 1;
    }

    /**
     * Get nested value from object using dot notation
     * @param {Object} obj - Object to search in
     * @param {string} path - Dot notation path (e.g., 'breadcrumb.home')
     * @returns {*} Value at the path or null if not found
     */
    getNestedValue(obj, path) {
        if (!obj || !path) {
            return null;
        }
        
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }

    /**
     * Get current language state information
     * @returns {Object} Current state information
     */
    getLanguageState() {
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
}

// Initialize LanguageManager when DOM is ready - only on pages with language toggle
document.addEventListener('DOMContentLoaded', () => {
    // Check if language toggle exists on this page
    const languageToggle = document.querySelector('.language-toggle');
    if (languageToggle) {
        window.languageManager = new LanguageManager();
    }
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}