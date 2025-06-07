/**
 * Meyller Aufzüge - Animation System
 * Professionelle Scroll-Animationen und Interaktionen
 */

class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    init() {
        if (this.isReducedMotion) {
            document.body.classList.add('reduced-motion');
            console.log('⚠️ Reduzierte Bewegungen aktiviert');
            return;
        }

        this.initScrollAnimations();
        this.initHoverEffects();
        this.initParallaxEffects();
        this.initCounterAnimations();
        this.initTypewriterEffects();
        this.bindEvents();
        
        console.log('🎨 Animation-System initialisiert');
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                    fadeInObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.observers.set('fadeIn', fadeInObserver);

        // Elemente für Fade-In Animation registrieren
        const fadeInElements = document.querySelectorAll(`
            .service-card,
            .value-item,
            .trust-item,
            .gallery-item,
            .team-member,
            .testimonial,
            .service-card-detailed,
            .advantage-item,
            .area-card,
            .step,
            .benefit-item
        `);

        fadeInElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            fadeInObserver.observe(el);
        });
    }

    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        // Spezielle Animationen für verschiedene Element-Typen
        if (element.classList.contains('service-card')) {
            this.animateServiceCard(element);
        } else if (element.classList.contains('stat-item')) {
            this.animateStatItem(element);
        } else if (element.querySelector('.service-icon, .service-icon-large')) {
            this.animateIcon(element.querySelector('.service-icon, .service-icon-large'));
        }
    }

    animateServiceCard(card) {
        const icon = card.querySelector('.service-icon, .service-icon-large');
        if (icon) {
            setTimeout(() => {
                icon.style.animation = 'iconBounce 0.6s ease';
            }, 300);
        }

        // Hover-Effekt hinzufügen
        card.addEventListener('mouseenter', () => {
            if (!this.isReducedMotion) {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        });
    }

    animateStatItem(statItem) {
        const number = statItem.querySelector('.stat-number');
        if (number && !number.classList.contains('animated')) {
            number.classList.add('animated');
            this.animateCounter(number);
        }
    }

    animateIcon(icon) {
        if (icon) {
            setTimeout(() => {
                icon.style.animation = 'iconPulse 1s ease';
            }, 200);
        }
    }

    initHoverEffects() {
        // Button-Hover-Effekte
        const buttons = document.querySelectorAll(`
            .btn-primary,
            .btn-secondary,
            .btn-outline,
            .btn-cta,
            .btn-emergency
        `);

        buttons.forEach(button => {
            this.addButtonEffects(button);
        });

        // Card-Hover-Effekte
        const cards = document.querySelectorAll(`
            .service-card,
            .value-card,
            .gallery-item,
            .team-card
        `);

        cards.forEach(card => {
            this.addCardEffects(card);
        });
    }

    addButtonEffects(button) {
        if (this.isReducedMotion) return;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '';
        });

        // Ripple-Effekt bei Klick
        button.addEventListener('click', (e) => {
            this.createRipple(e, button);
        });
    }

    addCardEffects(card) {
        if (this.isReducedMotion) return;

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        });
    }

    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    initParallaxEffects() {
        if (this.isReducedMotion) return;

        const parallaxElements = document.querySelectorAll('.hero-background, .parallax-bg');
        
        if (parallaxElements.length === 0) return;

        const parallaxObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.addEventListener('scroll', this.handleParallax.bind(this));
                } else {
                    window.removeEventListener('scroll', this.handleParallax.bind(this));
                }
            });
        });

        parallaxElements.forEach(el => parallaxObserver.observe(el));
        this.observers.set('parallax', parallaxObserver);
    }

    handleParallax() {
        if (this.isReducedMotion) return;

        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-background, .parallax-bg');

        parallaxElements.forEach(element => {
            const speed = element.dataset.parallaxSpeed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    initCounterAnimations() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat-number');
                    counters.forEach(counter => {
                        if (!counter.classList.contains('animated')) {
                            counter.classList.add('animated');
                            this.animateCounter(counter);
                        }
                    });
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const statSections = document.querySelectorAll('.hero-stats, .about-stats, .stats-grid');
        statSections.forEach(section => counterObserver.observe(section));
        
        this.observers.set('counter', counterObserver);
    }

    animateCounter(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const hasSlash = text.includes('/');
        
        if (hasSlash) {
            // Für "24/7" keine Animation
            return;
        }

        const number = parseInt(text.replace(/\D/g, ''));
        if (isNaN(number)) return;

        const duration = 2000;
        const steps = 60;
        const increment = number / steps;
        const stepDuration = duration / steps;

        let current = 0;
        element.textContent = '0' + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');

        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                element.textContent = text;
                clearInterval(timer);
            } else {
                const displayNumber = Math.floor(current);
                element.textContent = displayNumber + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
            }
        }, stepDuration);
    }

    initTypewriterEffects() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.startTypewriter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        });
    }

    startTypewriter(element) {
        if (this.isReducedMotion) return;

        const text = element.textContent;
        const speed = element.dataset.typewriterSpeed || 50;
        
        element.textContent = '';
        element.style.borderRight = '2px solid';
        element.style.animation = 'blink 1s infinite';

        let index = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(index);
            index++;
            
            if (index >= text.length) {
                clearInterval(timer);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                    element.style.animation = 'none';
                }, 1000);
            }
        }, speed);
    }

    bindEvents() {
        // Scroll-Performance optimieren
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Resize-Events
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Reduced Motion Changes
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            this.isReducedMotion = e.matches;
            if (this.isReducedMotion) {
                this.disableAnimations();
            }
        });
    }

    updateScrollAnimations() {
        // Hier können zusätzliche scroll-basierte Animationen hinzugefügt werden
        this.updateProgressBars();
        this.updateStickyElements();
    }

    updateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        progressBars.forEach(bar => {
            bar.style.width = `${scrollPercent}%`;
        });
    }

    updateStickyElements() {
        const stickyElements = document.querySelectorAll('.sticky-on-scroll');
        const scrollTop = window.pageYOffset;

        stickyElements.forEach(element => {
            const triggerPoint = element.dataset.stickyTrigger || 200;
            if (scrollTop > triggerPoint) {
                element.classList.add('is-sticky');
            } else {
                element.classList.remove('is-sticky');
            }
        });
    }

    handleResize() {
        // Animation-Parameter bei Resize neu berechnen
        this.animatedElements.clear();
        
        // Observer neu initialisieren falls nötig
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        
        if (!this.isReducedMotion) {
            this.initScrollAnimations();
        }
    }

    disableAnimations() {
        document.body.classList.add('reduced-motion');
        
        // Alle Observer stoppen
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        
        // Inline-Styles entfernen
        const animatedElements = document.querySelectorAll('[style*="transform"], [style*="opacity"]');
        animatedElements.forEach(el => {
            el.style.transform = '';
            el.style.opacity = '';
            el.style.transition = '';
        });
    }

    // Utility-Funktionen
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Öffentliche API
    animateElementOnDemand(element, animation = 'fadeIn') {
        if (this.isReducedMotion) return;

        switch (animation) {
            case 'fadeIn':
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'all 0.6s ease';
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 50);
                break;
            case 'slideLeft':
                element.style.transform = 'translateX(-100%)';
                element.style.transition = 'transform 0.6s ease';
                setTimeout(() => {
                    element.style.transform = 'translateX(0)';
                }, 50);
                break;
            case 'bounce':
                element.style.animation = 'bounce 0.6s ease';
                break;
        }
    }

    createScrollProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #1e40af);
            z-index: 10000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        });
    }
}

// CSS-Animationen hinzufügen
function addAnimationStyles() {
    if (document.querySelector('#animation-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'animation-styles';
    styles.textContent = `
        /* Keyframe Animationen */
        @keyframes iconBounce {
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

        @keyframes iconPulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
            100% {
                transform: scale(1);
            }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
                transform: translate3d(0,0,0);
            }
            40%, 43% {
                transform: translate3d(0,-30px,0);
            }
            70% {
                transform: translate3d(0,-15px,0);
            }
            90% {
                transform: translate3d(0,-5px,0);
            }
        }

        @keyframes blink {
            0%, 50% {
                border-color: transparent;
            }
            51%, 100% {
                border-color: currentColor;
            }
        }

        @keyframes slideInFromBottom {
            from {
                transform: translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        @keyframes zoomIn {
            from {
                transform: scale(0.3);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }

        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-20px);
            }
        }

        @keyframes rotateIn {
            from {
                transform: rotate(-200deg);
                opacity: 0;
            }
            to {
                transform: rotate(0);
                opacity: 1;
            }
        }

        @keyframes flipInX {
            from {
                transform: perspective(400px) rotateX(90deg);
                opacity: 0;
            }
            40% {
                transform: perspective(400px) rotateX(-20deg);
            }
            60% {
                transform: perspective(400px) rotateX(10deg);
                opacity: 1;
            }
            80% {
                transform: perspective(400px) rotateX(-5deg);
            }
            to {
                transform: perspective(400px) rotateX(0deg);
                opacity: 1;
            }
        }

        /* Ripple-Effekt */
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: rippleEffect 0.6s linear;
            pointer-events: none;
        }

        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        /* Hover-Effekte */
        .hover-lift {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .hover-scale {
            transition: transform 0.3s ease;
        }

        .hover-scale:hover {
            transform: scale(1.05);
        }

        .hover-glow {
            transition: all 0.3s ease;
        }

        .hover-glow:hover {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }

        /* Loading-Animationen */
        .loading-dots {
            display: inline-block;
        }

        .loading-dots::after {
            content: '';
            animation: loadingDots 1.5s infinite;
        }

        @keyframes loadingDots {
            0%, 20% {
                content: '';
            }
            40% {
                content: '.';
            }
            60% {
                content: '..';
            }
            80%, 100% {
                content: '...';
            }
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f4f6;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Scroll-Animationen */
        .scroll-fade-in {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scroll-fade-in.animate {
            opacity: 1;
            transform: translateY(0);
        }

        .scroll-slide-left {
            opacity: 0;
            transform: translateX(-50px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scroll-slide-left.animate {
            opacity: 1;
            transform: translateX(0);
        }

        .scroll-slide-right {
            opacity: 0;
            transform: translateX(50px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scroll-slide-right.animate {
            opacity: 1;
            transform: translateX(0);
        }

        .scroll-zoom-in {
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scroll-zoom-in.animate {
            opacity: 1;
            transform: scale(1);
        }

        /* Staggered Animationen */
        .stagger-animation {
            animation-delay: calc(var(--stagger-delay, 0) * 100ms);
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
            
            .reduced-motion * {
                animation: none !important;
                transition: none !important;
            }
        }

        /* Progress Bar */
        .scroll-progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #1e40af);
            z-index: 10000;
            transition: width 0.1s ease;
        }

        /* Custom Easing */
        .ease-out-expo {
            transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ease-out-back {
            transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .ease-out-elastic {
            transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        /* Particle Animation für Hero */
        .hero-particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 1;
        }

        .particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: floatParticle 6s infinite ease-in-out;
        }

        @keyframes floatParticle {
            0%, 100% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(100px);
                opacity: 0;
            }
        }

        /* Text-Animationen */
        .text-gradient {
            background: linear-gradient(45deg, #3b82f6, #1e40af, #3b82f6);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientShift 3s ease infinite;
        }

        @keyframes gradientShift {
            0%, 100% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
        }

        .text-reveal {
            overflow: hidden;
        }

        .text-reveal span {
            display: inline-block;
            opacity: 0;
            transform: translateY(100%);
            animation: textReveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes textReveal {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Morphing Shapes */
        .morphing-shape {
            border-radius: 60% 40% 30% 70%/60% 30% 70% 40%;
            animation: morphing 8s ease-in-out infinite;
        }

        @keyframes morphing {
            0%, 100% {
                border-radius: 60% 40% 30% 70%/60% 30% 70% 40%;
            }
            25% {
                border-radius: 30% 60% 70% 40%/50% 60% 30% 60%;
            }
            50% {
                border-radius: 70% 30% 60% 40%/60% 40% 60% 30%;
            }
            75% {
                border-radius: 40% 60% 30% 70%/40% 70% 60% 30%;
            }
        }

        /* Glitch-Effekt */
        .glitch {
            animation: glitch 1s linear infinite;
        }

        @keyframes glitch {
            2%, 64% {
                transform: translate(2px, 0) skew(0deg);
            }
            4%, 60% {
                transform: translate(-2px, 0) skew(0deg);
            }
            62% {
                transform: translate(0, 0) skew(5deg);
            }
        }

        /* Heartbeat Animation */
        .heartbeat {
            animation: heartbeat 1.5s ease-in-out infinite both;
        }

        @keyframes heartbeat {
            from {
                transform: scale(1);
                transform-origin: center center;
                animation-timing-function: ease-out;
            }
            10% {
                transform: scale(0.91);
                animation-timing-function: ease-in;
            }
            17% {
                transform: scale(0.98);
                animation-timing-function: ease-out;
            }
            33% {
                transform: scale(0.87);
                animation-timing-function: ease-in;
            }
            45% {
                transform: scale(1);
                animation-timing-function: ease-out;
            }
        }
    `;
    document.head.appendChild(styles);
}

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    addAnimationStyles();
    window.animationManager = new AnimationManager();
    
    // Scroll-Progress-Bar erstellen
    if (!document.querySelector('.scroll-progress-bar')) {
        window.animationManager.createScrollProgressBar();
    }
});

// Globale Animation-Utilities
window.AnimationUtils = {
    // Element animieren
    animate: (element, animation, duration = 600) => {
        if (window.animationManager) {
            window.animationManager.animateElementOnDemand(element, animation);
        }
    },
    
    // Staggered Animation für mehrere Elemente
    staggerAnimate: (elements, animation = 'fadeIn', delay = 100) => {
        elements.forEach((element, index) => {
            setTimeout(() => {
                if (window.animationManager) {
                    window.animationManager.animateElementOnDemand(element, animation);
                }
            }, index * delay);
        });
    },
    
    // Text-Reveal-Animation
    revealText: (element) => {
        const text = element.textContent;
        element.innerHTML = '';
        element.classList.add('text-reveal');
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${index * 50}ms`;
            element.appendChild(span);
        });
    },
    
    // Partikel-Effekt erstellen
    createParticles: (container, count = 20) => {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'hero-particles';
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (3 + Math.random() * 3) + 's';
            particlesContainer.appendChild(particle);
        }
        
        container.appendChild(particlesContainer);
    },
    
    // Loading-Spinner erstellen
    createSpinner: (size = 40) => {
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.style.width = size + 'px';
        spinner.style.height = size + 'px';
        return spinner;
    },
    
    // Smooth Scroll mit Easing
    smoothScrollTo: (target, duration = 1000, easing = 'easeInOutCubic') => {
        const start = window.pageYOffset;
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        const targetPosition = targetElement.offsetTop - 80;
        const distance = targetPosition - start;
        const startTime = performance.now();
        
        const easingFunctions = {
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
            easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
            easeOutBack: t => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2)
        };
        
        const easingFunction = easingFunctions[easing] || easingFunctions.easeInOutCubic;
        
        function animation(currentTime) {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easingFunction(progress);
            
            window.scrollTo(0, start + distance * easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }
};

// Performance-Monitor für Animationen
class AnimationPerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        this.isMonitoring = false;
    }
    
    start() {
        this.isMonitoring = true;
        this.monitor();
    }
    
    stop() {
        this.isMonitoring = false;
    }
    
    monitor() {
        if (!this.isMonitoring) return;
        
        const currentTime = performance.now();
        this.frameCount++;
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Bei niedriger FPS Animationen reduzieren
            if (this.fps < 30) {
                document.body.classList.add('reduced-motion');
                console.warn('⚠️ Niedrige FPS erkannt, Animationen reduziert');
            }
        }
        
        requestAnimationFrame(() => this.monitor());
    }
    
    getFPS() {
        return this.fps;
    }
}

// Performance-Monitor initialisieren
window.addEventListener('load', () => {
    window.animationPerformanceMonitor = new AnimationPerformanceMonitor();
    window.animationPerformanceMonitor.start();
});

// Export
window.AnimationManager = AnimationManager;
window.AnimationPerformanceMonitor = AnimationPerformanceMonitor;