/**
 * Meyller Aufzüge - Cookie Management System
 * Professional GDPR-compliant cookie consent management
 * 
 * Features:
 * - GDPR compliant
 * - Granular cookie controls
 * - One-time consent across all pages
 * - Analytics and Marketing cookie management
 * - Local storage for preferences
 * - Automatic script loading based on consent
 */

class CookieManager {
    constructor() {
        this.cookieName = 'meyller_cookie_consent';
        this.consentVersion = '1.0';
        this.consent = this.getStoredConsent();
        
        this.categories = {
            necessary: {
                name: 'Notwendige Cookies',
                description: 'Diese Cookies sind für die grundlegende Funktionalität der Website erforderlich.',
                required: true,
                cookies: ['session', 'csrf_token', 'language_preference']
            },
            analytics: {
                name: 'Analytics Cookies',
                description: 'Helfen uns zu verstehen, wie Besucher mit der Website interagieren.',
                required: false,
                cookies: ['_ga', '_gid', '_gat', 'gtag'],
                scripts: [
                    {
                        type: 'google-analytics',
                        id: 'GA_MEASUREMENT_ID', // Replace with actual GA4 ID
                        src: 'https://www.googletagmanager.com/gtag/js'
                    }
                ]
            },
            marketing: {
                name: 'Marketing Cookies',
                description: 'Werden verwendet, um Besuchern relevante Anzeigen zu zeigen.',
                required: false,
                cookies: ['_fbp', '_fbc', 'fr'],
                scripts: [
                    {
                        type: 'facebook-pixel',
                        id: 'FB_PIXEL_ID', // Replace with actual Facebook Pixel ID
                        src: 'https://connect.facebook.net/de_DE/fbevents.js'
                    }
                ]
            }
        };

        this.init();
    }

    init() {
        this.createBannerHTML();
        this.createModalHTML();
        this.bindEvents();
        this.checkConsent();
    }

    createBannerHTML() {
        const banner = document.getElementById('cookieBanner');
        if (!banner) return;

        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-text">
                    <h4>Cookie-Einstellungen</h4>
                    <p>Wir verwenden Cookies, um Ihnen die bestmögliche Nutzererfahrung zu bieten. Durch die weitere Nutzung unserer Website stimmen Sie der Verwendung von Cookies zu. 
                    <a href="/datenschutz.html" class="cookie-link">Mehr in der Datenschutzerklärung</a></p>
                </div>
                <div class="cookie-buttons">
                    <button class="btn-cookie-accept" onclick="cookieManager.acceptAllCookies()">
                        Alle akzeptieren
                    </button>
                    <button class="btn-cookie-settings" onclick="cookieManager.openCookieSettings()">
                        Einstellungen
                    </button>
                    <button class="btn-cookie-decline" onclick="cookieManager.declineOptionalCookies()">
                        Nur notwendige
                    </button>
                </div>
            </div>
        `;
    }

    createModalHTML() {
        const modal = document.getElementById('cookieModal');
        if (!modal) return;

        const categoriesHTML = Object.entries(this.categories).map(([key, category]) => `
            <div class="cookie-category">
                <div class="cookie-category-header">
                    <h4>${category.name}</h4>
                    <label class="toggle">
                        <input type="checkbox" 
                               id="${key}Cookies" 
                               ${category.required ? 'checked disabled' : ''}
                               ${this.consent[key] ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <p>${category.description}</p>
                ${category.cookies ? `
                    <div class="cookie-details">
                        <small>Cookies: ${category.cookies.join(', ')}</small>
                    </div>
                ` : ''}
            </div>
        `).join('');

        modal.innerHTML = `
            <div class="cookie-modal-content">
                <div class="modal-header">
                    <h3>Cookie-Einstellungen verwalten</h3>
                    <button class="modal-close" onclick="cookieManager.closeCookieModal()">×</button>
                </div>
                <div class="modal-body">
                    <p>Wir respektieren Ihre Privatsphäre und geben Ihnen die volle Kontrolle über Ihre Cookie-Einstellungen. Sie können jederzeit Ihre Präferenzen ändern.</p>
                    <div class="cookie-categories">
                        ${categoriesHTML}
                    </div>
                </div>
                <div class="cookie-modal-buttons">
                    <button class="btn-save-settings" onclick="cookieManager.saveCookieSettings()">
                        Einstellungen speichern
                    </button>
                    <button class="btn-accept-all" onclick="cookieManager.acceptAllCookies()">
                        Alle akzeptieren
                    </button>
                    <button class="btn-close-modal" onclick="cookieManager.closeCookieModal()">
                        Schließen
                    </button>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Close modal on outside click
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('cookieModal');
            if (e.target === modal && modal.classList.contains('show')) {
                this.closeCookieModal();
            }
        });

        // Close modal on escape key
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Escape') {
                this.closeCookieModal();
            }
        });

        // Handle cookie banner close on scroll (after significant scroll)
        let scrolled = false;
        window.addEventListener('scroll', () => {
            if (!scrolled && window.scrollY > 200) {
                scrolled = true;
                // Auto-hide banner after scrolling if no action taken after 10 seconds
                setTimeout(() => {
                    const banner = document.getElementById('cookieBanner');
                    if (banner && banner.classList.contains('show')) {
                        this.acceptNecessaryCookies();
                    }
                }, 10000);
            }
        });
    }

    checkConsent() {
        if (!this.consent.timestamp || this.isConsentExpired()) {
            this.showCookieBanner();
        } else {
            this.loadConsentedScripts();
        }
    }

    isConsentExpired() {
        const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
        return Date.now() - this.consent.timestamp > maxAge;
    }

    getStoredConsent() {
        try {
            const stored = localStorage.getItem(this.cookieName);
            if (stored) {
                const consent = JSON.parse(stored);
                // Validate consent structure
                if (consent.version === this.consentVersion) {
                    return consent;
                }
            }
        } catch (error) {
            console.warn('Error reading stored consent:', error);
        }

        // Return default consent (only necessary cookies)
        return {
            version: this.consentVersion,
            timestamp: null,
            necessary: true,
            analytics: false,
            marketing: false
        };
    }

    storeConsent(consent) {
        try {
            const consentData = {
                ...consent,
                version: this.consentVersion,
                timestamp: Date.now()
            };
            localStorage.setItem(this.cookieName, JSON.stringify(consentData));
            this.consent = consentData;
        } catch (error) {
            console.error('Error storing consent:', error);
        }
    }

    showCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.add('show');
            // Add accessibility attributes
            banner.setAttribute('role', 'banner');
            banner.setAttribute('aria-label', 'Cookie-Einstellungen');
        }
    }

    hideCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        }
    }

    openCookieSettings() {
        const modal = document.getElementById('cookieModal');
        if (modal) {
            // Update checkboxes based on current consent
            Object.keys(this.categories).forEach(category => {
                const checkbox = modal.querySelector(`#${category}Cookies`);
                if (checkbox && !checkbox.disabled) {
                    checkbox.checked = this.consent[category] || false;
                }
            });

            modal.classList.add('show');
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-labelledby', 'cookie-modal-title');
            
            // Focus management
            const firstFocusable = modal.querySelector('button, input');
            if (firstFocusable) firstFocusable.focus();
        }
    }

    closeCookieModal() {
        const modal = document.getElementById('cookieModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    acceptAllCookies() {
        const consent = {
            necessary: true,
            analytics: true,
            marketing: true
        };
        
        this.storeConsent(consent);
        this.hideCookieBanner();
        this.closeCookieModal();
        this.loadConsentedScripts();
        this.triggerConsentEvent('all_accepted');
        
        this.showConsentNotification('Alle Cookies wurden akzeptiert.');
    }

    declineOptionalCookies() {
        this.acceptNecessaryCookies();
    }

    acceptNecessaryCookies() {
        const consent = {
            necessary: true,
            analytics: false,
            marketing: false
        };
        
        this.storeConsent(consent);
        this.hideCookieBanner();
        this.closeCookieModal();
        this.loadConsentedScripts();
        this.triggerConsentEvent('necessary_only');
        
        this.showConsentNotification('Nur notwendige Cookies wurden akzeptiert.');
    }

    saveCookieSettings() {
        const modal = document.getElementById('cookieModal');
        if (!modal) return;

        const consent = {
            necessary: true, // Always true
        };

        // Get checkbox states
        Object.keys(this.categories).forEach(category => {
            if (category !== 'necessary') {
                const checkbox = modal.querySelector(`#${category}Cookies`);
                consent[category] = checkbox ? checkbox.checked : false;
            }
        });

        this.storeConsent(consent);
        this.hideCookieBanner();
        this.closeCookieModal();
        this.loadConsentedScripts();
        this.triggerConsentEvent('custom_settings');
        
        this.showConsentNotification('Cookie-Einstellungen wurden gespeichert.');
    }

    loadConsentedScripts() {
        Object.entries(this.categories).forEach(([category, config]) => {
            if (this.consent[category] && config.scripts) {
                config.scripts.forEach(script => {
                    this.loadScript(script);
                });
            }
        });
    }

    loadScript(scriptConfig) {
        // Prevent duplicate loading
        if (document.querySelector(`[data-cookie-script="${scriptConfig.type}"]`)) {
            return;
        }

        switch (scriptConfig.type) {
            case 'google-analytics':
                this.loadGoogleAnalytics(scriptConfig.id);
                break;
            case 'facebook-pixel':
                this.loadFacebookPixel(scriptConfig.id);
                break;
            default:
                this.loadGenericScript(scriptConfig);
        }
    }

    loadGoogleAnalytics(measurementId) {
        // Load gtag script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        script.setAttribute('data-cookie-script', 'google-analytics');
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', measurementId, {
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
        });

        console.log('Google Analytics loaded with consent');
    }

    loadFacebookPixel(pixelId) {
        // Facebook Pixel implementation
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        fbq('init', pixelId);
        fbq('track', 'PageView');
        
        // Mark as loaded
        const marker = document.createElement('script');
        marker.setAttribute('data-cookie-script', 'facebook-pixel');
        document.head.appendChild(marker);

        console.log('Facebook Pixel loaded with consent');
    }

    loadGenericScript(scriptConfig) {
        const script = document.createElement('script');
        script.src = scriptConfig.src;
        script.async = true;
        script.setAttribute('data-cookie-script', scriptConfig.type);
        document.head.appendChild(script);
    }

    triggerConsentEvent(action) {
        // Dispatch custom event for analytics tracking
        const event = new CustomEvent('cookieConsent', {
            detail: {
                action: action,
                consent: this.consent,
                timestamp: Date.now()
            }
        });
        window.dispatchEvent(event);

        // Google Analytics event (if available and consented)
        if (this.consent.analytics && typeof gtag !== 'undefined') {
            gtag('event', 'cookie_consent', {
                event_category: 'privacy',
                event_label: action,
                value: 1
            });
        }
    }

    showConsentNotification(message) {
        // Create and show a brief notification
        const notification = document.createElement('div');
        notification.className = 'consent-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✓</span>
                <span class="notification-text">${message}</span>
            </div>
        `;

        // Add styles if not already present
        if (!document.querySelector('#consent-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'consent-notification-styles';
            styles.textContent = `
                .consent-notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: #10b981;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                }
                .consent-notification.show {
                    transform: translateX(0);
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .notification-icon {
                    font-weight: bold;
                }
                .notification-text {
                    font-size: 14px;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Public API methods
    hasConsent(category) {
        return this.consent[category] || false;
    }

    getConsent() {
        return { ...this.consent };
    }

    revokeConsent() {
        this.storeConsent({
            necessary: true,
            analytics: false,
            marketing: false
        });
        
        // Remove tracking scripts
        document.querySelectorAll('[data-cookie-script]').forEach(script => {
            script.remove();
        });
        
        // Clear tracking cookies
        this.clearTrackingCookies();
        
        this.showConsentNotification('Cookie-Einwilligung wurde widerrufen.');
        this.triggerConsentEvent('consent_revoked');
    }

    clearTrackingCookies() {
        const trackingCookies = ['_ga', '_gid', '_gat', '_fbp', '_fbc'];
        trackingCookies.forEach(cookie => {
            document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
        });
    }

    // Method to update consent (for use by other scripts)
    updateConsent(category, value) {
        if (this.categories[category] && !this.categories[category].required) {
            this.consent[category] = value;
            this.storeConsent(this.consent);
            this.loadConsentedScripts();
            this.triggerConsentEvent('consent_updated');
        }
    }

    // Debug method
    debug() {
        console.group('Cookie Manager Debug');
        console.log('Current consent:', this.consent);
        console.log('Stored consent:', this.getStoredConsent());
        console.log('Categories:', this.categories);
        console.log('Loaded scripts:', document.querySelectorAll('[data-cookie-script]'));
        console.groupEnd();
    }
}

// Global functions for onclick handlers
window.acceptAllCookies = function() {
    if (window.cookieManager) {
        window.cookieManager.acceptAllCookies();
    }
};

window.openCookieSettings = function() {
    if (window.cookieManager) {
        window.cookieManager.openCookieSettings();
    }
};

window.declineOptionalCookies = function() {
    if (window.cookieManager) {
        window.cookieManager.declineOptionalCookies();
    }
};

window.saveCookieSettings = function() {
    if (window.cookieManager) {
        window.cookieManager.saveCookieSettings();
    }
};

window.closeCookieModal = function() {
    if (window.cookieManager) {
        window.cookieManager.closeCookieModal();
    }
};

// Initialize cookie manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cookieManager = new CookieManager();
    
    // Add global CSS for cookie components if not already included
    if (!document.querySelector('#cookie-styles')) {
        const link = document.createElement('link');
        link.id = 'cookie-styles';
        link.rel = 'stylesheet';
        link.href = 'assets/css/cookies.css';
        document.head.appendChild(link);
    }
});

// Expose API for external use
window.CookieManager = CookieManager;