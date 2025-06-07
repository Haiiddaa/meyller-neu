/**
 * Meyller Aufzüge - Main JavaScript
 * Hauptlogik und Initialisierung aller Komponenten
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialisierung aller Module
    initializeWebsite();
});

function initializeWebsite() {
    console.log('🚀 Meyller Aufzüge Website wird initialisiert...');
    
    // Loading-Screen sofort verstecken falls JavaScript geladen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 500);
    
    // Hero-Animationen initialisieren
    initHeroAnimations();
    
    // Scroll-Animationen initialisieren
    initScrollAnimations();
    
    // Kontaktformular initialisieren
    initContactForm();
    
    // Telefon-Links optimieren
    initPhoneLinks();
    
    // Lazy Loading für Bilder
    initLazyLoading();
    
    // Print-Optimierung
    initPrintOptimization();
    
    console.log('✅ Website erfolgreich initialisiert');
}

// Hero-Animationen
function initHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroActions = document.querySelector('.hero-actions');
    const heroStats = document.querySelector('.hero-stats');
    
    if (heroTitle) {
        // Titel-Animation mit Typewriter-Effekt
        const titleText = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        heroTitle.style.opacity = '1';
        
        let index = 0;
        function typeWriter() {
            if (index < titleText.length) {
                heroTitle.innerHTML += titleText.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            } else {
                // Nach Titel-Animation die anderen Elemente einblenden
                if (heroSubtitle) {
                    setTimeout(() => {
                        heroSubtitle.style.opacity = '1';
                        heroSubtitle.style.transform = 'translateY(0)';
                    }, 200);
                }
                
                if (heroStats) {
                    setTimeout(() => {
                        heroStats.style.opacity = '1';
                        heroStats.style.transform = 'translateY(0)';
                        animateCounters();
                    }, 400);
                }
                
                if (heroActions) {
                    setTimeout(() => {
                        heroActions.style.opacity = '1';
                        heroActions.style.transform = 'translateY(0)';
                    }, 600);
                }
            }
        }
        
        setTimeout(typeWriter, 800);
    }
}

// Counter-Animationen
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isNumber = /^\d+$/.test(target);
        
        if (isNumber) {
            const finalNumber = parseInt(target);
            counter.textContent = '0';
            
            const increment = finalNumber / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalNumber) {
                    counter.textContent = finalNumber;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 30);
        }
    });
}

// Scroll-Animationen
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Spezielle Animationen für bestimmte Elemente
                if (entry.target.classList.contains('service-card')) {
                    animateServiceCard(entry.target);
                }
                
                if (entry.target.classList.contains('stat-number') && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateSingleCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Elemente für Animation registrieren
    const animatedElements = document.querySelectorAll(`
        .service-card,
        .value-item,
        .trust-item,
        .stat-item,
        .gallery-item,
        .team-member,
        .testimonial
    `);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

function animateServiceCard(card) {
    const icon = card.querySelector('.service-icon, .service-icon-large');
    if (icon) {
        icon.style.animation = 'bounce 0.6s ease';
    }
}

function animateSingleCounter(counter) {
    const target = counter.textContent.replace(/[^\d]/g, '');
    if (target) {
        const finalNumber = parseInt(target);
        const originalText = counter.textContent;
        const prefix = originalText.replace(/\d+/g, '');
        
        counter.textContent = prefix.replace(/\d+/, '0');
        
        const increment = finalNumber / 30;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= finalNumber) {
                counter.textContent = originalText;
                clearInterval(timer);
            } else {
                counter.textContent = prefix.replace(/\d+/, Math.floor(current));
            }
        }, 50);
    }
}

// Kontaktformular
function initContactForm() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Real-time Validierung
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('[type="submit"], .submit-btn');
    const originalText = submitBtn.textContent;
    
    // Validierung
    if (!validateForm(form)) {
        showFormError('Bitte füllen Sie alle Pflichtfelder korrekt aus.');
        return;
    }
    
    // Loading-State
    submitBtn.textContent = 'Wird gesendet...';
    submitBtn.disabled = true;
    
    // Formulardaten sammeln
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Simulation der Formular-Übertragung
    setTimeout(() => {
        // Hier würde normalerweise die echte Server-Übertragung stattfinden
        console.log('Formulardaten:', data);
        
        // Erfolg-Nachricht
        showFormSuccess('Vielen Dank für Ihre Nachricht! Wir melden uns schnellstmöglich bei Ihnen.');
        form.reset();
        
        // Button zurücksetzen
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Analytics Event (wenn Cookie-Zustimmung vorliegt)
        if (window.cookieManager && window.cookieManager.hasConsent('analytics') && typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'engagement',
                event_label: 'contact_form'
            });
        }
        
    }, 2000);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Pflichtfeld-Prüfung
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Dieses Feld ist erforderlich.';
    }
    
    // E-Mail-Validierung
    else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
        }
    }
    
    // Telefon-Validierung
    else if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 6) {
            isValid = false;
            errorMessage = 'Bitte geben Sie eine gültige Telefonnummer ein.';
        }
    }
    
    // Mindestlänge für Textnachrichten
    else if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Die Nachricht sollte mindestens 10 Zeichen lang sein.';
    }
    
    showFieldValidation(field, isValid, errorMessage);
    return isValid;
}

function showFieldValidation(field, isValid, errorMessage) {
    clearFieldError(field);
    
    if (!isValid) {
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = errorMessage;
        
        field.parentNode.appendChild(errorDiv);
    } else {
        field.classList.remove('error');
        field.classList.add('valid');
    }
}

function clearFieldError(field) {
    field.classList.remove('error', 'valid');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showFormSuccess(message) {
    if (window.coreManager) {
        window.coreManager.showNotification(message, 'success', 5000);
    } else {
        alert(message);
    }
}

function showFormError(message) {
    if (window.coreManager) {
        window.coreManager.showNotification(message, 'error', 5000);
    } else {
        alert(message);
    }
}

// Telefon-Links optimieren
function initPhoneLinks() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Analytics Event
            if (window.cookieManager && window.cookieManager.hasConsent('analytics') && typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    event_category: 'engagement',
                    event_label: this.href
                });
            }
        });
    });
}

// Lazy Loading für Bilder
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback für ältere Browser
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Print-Optimierung
function initPrintOptimization() {
    window.addEventListener('beforeprint', function() {
        // Alle Bilder für Druck laden
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
        
        // Externe Links für Druck formatieren
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        externalLinks.forEach(link => {
            const url = link.href;
            if (!link.querySelector('.print-url')) {
                const urlSpan = document.createElement('span');
                urlSpan.className = 'print-url';
                urlSpan.textContent = ` (${url})`;
                link.appendChild(urlSpan);
            }
        });
    });
}

// CSS für Animationen und Validierung hinzufügen
function addDynamicStyles() {
    if (document.querySelector('#dynamic-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'dynamic-styles';
    styles.textContent = `
        /* Animation Klassen */
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Bounce Animation */
        @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
                transform: translate3d(0,0,0);
            }
            40%, 43% {
                transform: translate3d(0,-15px,0);
            }
            70% {
                transform: translate3d(0,-7px,0);
            }
            90% {
                transform: translate3d(0,-2px,0);
            }
        }
        
        /* Formular-Validierung */
        .form-group input.error,
        .form-group textarea.error {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .form-group input.valid,
        .form-group textarea.valid {
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        
        .field-error {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        
        /* Lazy Loading */
        img.lazy {
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        /* Print Styles */
        @media print {
            .print-url {
                font-size: 0.8em;
                color: #666;
            }
        }
        
        /* Keyboard Navigation */
        .keyboard-navigation *:focus {
            outline: 2px solid #3b82f6 !important;
            outline-offset: 2px !important;
        }
        
        /* Hero Elemente initial verstecken */
        .hero-subtitle,
        .hero-stats,
        .hero-actions {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
    `;
    document.head.appendChild(styles);
}

// Styles beim Laden hinzufügen
addDynamicStyles();

// Globale Funktionen für onclick-Handler
window.showNotification = function(message, type = 'info') {
    if (window.coreManager) {
        window.coreManager.showNotification(message, type);
    }
};

// Export für Module
window.MainApp = {
    initializeWebsite,
    animateCounters,
    validateForm,
    showFormSuccess,
    showFormError
};

// Service Worker Registration (optional für Progressive Web App)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch(function(error) {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Zusätzliche Hilfsfunktionen
window.MeyllerUtils = {
    // Telefonnummer formatieren
    formatPhoneNumber: function(phone) {
        return phone.replace(/\D/g, '').replace(/(\d{2})(\d{2})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4 $5');
    },
    
    // E-Mail obfuskieren (Spam-Schutz)
    obfuscateEmail: function(email) {
        return email.replace('@', ' [at] ').replace('.', ' [dot] ');
    },
    
    // Scroll zu Element mit Offset
    scrollToElement: function(selector, offset = 80) {
        const element = document.querySelector(selector);
        if (element) {
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },
    
    // Cookie-freundliche Analytics Events
    trackEvent: function(eventName, category = 'engagement', label = '') {
        if (window.cookieManager && window.cookieManager.hasConsent('analytics')) {
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    event_category: category,
                    event_label: label
                });
            }
            
            // Custom Event für andere Tracking-Tools
            window.dispatchEvent(new CustomEvent('meyller_track', {
                detail: { eventName, category, label }
            }));
        }
    },
    
    // Geräte-Typ erkennen
    getDeviceType: function() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    },
    
    // Browser-Features prüfen
    checkBrowserSupport: function() {
        const features = {
            webp: this.supportsWebP(),
            intersectionObserver: 'IntersectionObserver' in window,
            customProperties: CSS.supports('color', 'var(--test)'),
            grid: CSS.supports('display', 'grid'),
            flexbox: CSS.supports('display', 'flex')
        };
        
        // Fallbacks für nicht unterstützte Features
        if (!features.intersectionObserver) {
            this.loadIntersectionObserverPolyfill();
        }
        
        return features;
    },
    
    // WebP-Support prüfen
    supportsWebP: function() {
        const canvas = document.createElement('canvas');
        return canvas.toDataURL('image/webp').indexOf('webp') !== -1;
    },
    
    // IntersectionObserver Polyfill laden
    loadIntersectionObserverPolyfill: function() {
        const script = document.createElement('script');
        script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
        document.head.appendChild(script);
    },
    
    // Performance-optimierte Bild-URLs generieren
    getOptimizedImageUrl: function(imagePath, width, height, format = 'auto') {
        // Hier könnte eine CDN-Integration implementiert werden
        // Beispiel für Cloudinary oder ähnliche Services
        return imagePath; // Placeholder
    },
    
    // Kontakt-Informationen formatieren
    formatContactInfo: function() {
        // Telefonnummern formatieren
        document.querySelectorAll('.phone-number').forEach(el => {
            el.textContent = this.formatPhoneNumber(el.textContent);
        });
        
        // E-Mail-Adressen für Spam-Schutz obfuskieren
        document.querySelectorAll('.email-obfuscated').forEach(el => {
            const email = el.dataset.email;
            if (email) {
                el.innerHTML = `<a href="mailto:${email}">${this.obfuscateEmail(email)}</a>`;
            }
        });
    },
    
    // Lokale Speicherung mit Fallback
    storage: {
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('localStorage not available, using sessionStorage');
                try {
                    sessionStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (e2) {
                    console.warn('No storage available');
                    return false;
                }
            }
        },
        
        get: function(key) {
            try {
                const item = localStorage.getItem(key) || sessionStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.warn('Error reading from storage');
                return null;
            }
        },
        
        remove: function(key) {
            try {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            } catch (e) {
                console.warn('Error removing from storage');
            }
        }
    }
};

// Accessibility-Verbesserungen
function enhanceAccessibility() {
    // Skip-Link hinzufügen
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Zum Hauptinhalt springen';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // ARIA-Labels für interaktive Elemente
    document.querySelectorAll('button:not([aria-label])').forEach(button => {
        if (!button.textContent.trim()) {
            button.setAttribute('aria-label', 'Schaltfläche');
        }
    });
    
    // Focus-Management für Modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const modal = document.querySelector('.modal.show, .cookie-modal.show');
            if (modal) {
                trapFocus(modal, e);
            }
        }
    });
}

function trapFocus(modal, event) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey) {
        if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
        }
    } else {
        if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
        }
    }
}

// SEO-Verbesserungen
function enhanceSEO() {
    // Canonical URL setzen falls nicht vorhanden
    if (!document.querySelector('link[rel="canonical"]')) {
        const canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = window.location.href.split('?')[0].split('#')[0];
        document.head.appendChild(canonical);
    }
    
    // Meta-Description aus Seiteninhalt generieren falls nicht vorhanden
    if (!document.querySelector('meta[name="description"]')) {
        const firstParagraph = document.querySelector('main p');
        if (firstParagraph) {
            const description = firstParagraph.textContent.substring(0, 155) + '...';
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = description;
            document.head.appendChild(meta);
        }
    }
    
    // Structured Data für Kontaktinformationen
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Meyller Aufzüge GmbH",
        "url": "https://meylleraufzuege.de",
        "telephone": "+49-40-123456789",
        "email": "info@meylleraufzuege.de",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "DE",
            "addressLocality": "Hamburg"
        },
        "founder": [
            {
                "@type": "Person",
                "name": "Michael Meyer"
            },
            {
                "@type": "Person", 
                "name": "Christian Müller"
            }
        ],
        "serviceArea": "Deutschland",
        "services": [
            "Aufzug Neuinstallation",
            "Aufzug Modernisierung", 
            "Aufzug Wartung",
            "24/7 Notdienst"
        ]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// Browser-Kompatibilität prüfen und Fallbacks laden
function checkCompatibilityAndLoadFallbacks() {
    const support = window.MeyllerUtils.checkBrowserSupport();
    
    // IE-Support (falls noch benötigt)
    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Trident/') !== -1) {
        document.body.classList.add('ie-browser');
        
        // Zusätzliche Polyfills für IE laden
        const polyfills = [
            'https://polyfill.io/v3/polyfill.min.js?features=es6,Array.prototype.forEach,Promise'
        ];
        
        polyfills.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            document.head.appendChild(script);
        });
    }
    
    // CSS-Grid Fallback
    if (!support.grid) {
        document.body.classList.add('no-grid');
    }
    
    // Custom Properties Fallback
    if (!support.customProperties) {
        document.body.classList.add('no-custom-properties');
    }
}

// Alles beim DOMContentLoaded initialisieren
document.addEventListener('DOMContentLoaded', function() {
    enhanceAccessibility();
    enhanceSEO();
    checkCompatibilityAndLoadFallbacks();
    window.MeyllerUtils.formatContactInfo();
    
    // Browser-Support-Info für Debugging
    console.log('🔍 Browser-Support:', window.MeyllerUtils.checkBrowserSupport());
    console.log('📱 Geräte-Typ:', window.MeyllerUtils.getDeviceType());
});

// Skip-Link Styles hinzufügen
const skipLinkStyles = document.createElement('style');
skipLinkStyles.textContent = `
    .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 0 0 4px 4px;
    }
    .skip-link:focus {
        top: 0;
    }
    
    /* IE Fallbacks */
    .ie-browser .hero {
        background: #1e40af;
    }
    .ie-browser .services-grid {
        display: block;
    }
    .ie-browser .service-card {
        width: 48%;
        display: inline-block;
        vertical-align: top;
        margin: 1%;
    }
    
    /* No-Grid Fallback */
    .no-grid .services-grid {
        display: block;
    }
    .no-grid .service-card {
        width: 100%;
        margin-bottom: 2rem;
    }
    
    @media (min-width: 768px) {
        .no-grid .service-card {
            width: 48%;
            display: inline-block;
            vertical-align: top;
            margin: 1%;
        }
    }
    
    @media (min-width: 1024px) {
        .no-grid .service-card {
            width: 31%;
        }
    }
`;
document.head.appendChild(skipLinkStyles);