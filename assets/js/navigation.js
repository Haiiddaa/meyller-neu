/**
 * Meyller Aufzüge - Navigation System
 * Professional navigation with scroll effects, mobile menu, and accessibility
 */

class NavigationManager {
    constructor() {
        this.header = document.getElementById('header');
        this.navMenu = document.getElementById('navMenu');
        this.mobileToggle = document.getElementById('mobileToggle');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.dropdowns = document.querySelectorAll('.nav-dropdown');
        
        this.isScrolled = false;
        this.isMobileMenuOpen = false;
        this.lastScrollTop = 0;
        this.scrollThreshold = 100;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initScrollEffects();
        this.initMobileMenu();
        this.initDropdowns();
        this.initAccessibility();
        this.updateActiveNavLink();
    }

    bindEvents() {
        // Scroll events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        
        // Mobile menu toggle
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (this.isMobileMenuOpen && !this.navMenu.contains(e.target) && !this.mobileToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Navigation link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavLinkClick.bind(this));
        });

        // Window resize
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 250));
    }

    initScrollEffects() {
        // Initial state
        this.updateHeaderState();
    }

    initMobileMenu() {
        if (!this.navMenu) return;

        // Add mobile menu styles
        this.navMenu.classList.add('nav-menu-mobile');
        
        // Create mobile menu backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'mobile-menu-backdrop';
        backdrop.addEventListener('click', this.closeMobileMenu.bind(this));
        document.body.appendChild(backdrop);
    }

    initDropdowns() {
        this.dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.nav-link');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (!trigger || !menu) return;

            // Desktop hover events
            dropdown.addEventListener('mouseenter', () => {
                if (window.innerWidth >= 1024) {
                    this.openDropdown(dropdown);
                }
            });

            dropdown.addEventListener('mouseleave', () => {
                if (window.innerWidth >= 1024) {
                    this.closeDropdown(dropdown);
                }
            });

            // Mobile click events
            trigger.addEventListener('click', (e) => {
                if (window.innerWidth < 1024) {
                    e.preventDefault();
                    this.toggleDropdown(dropdown);
                }
            });

            // Keyboard navigation
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleDropdown(dropdown);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.openDropdown(dropdown);
                    const firstLink = menu.querySelector('a');
                    if (firstLink) firstLink.focus();
                }
            });

            // Close dropdown on outside click
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    this.closeDropdown(dropdown);
                }
            });
        });
    }

    initAccessibility() {
        // Add ARIA attributes
        if (this.mobileToggle) {
            this.mobileToggle.setAttribute('aria-label', 'Menü öffnen/schließen');
            this.mobileToggle.setAttribute('aria-expanded', 'false');
            this.mobileToggle.setAttribute('aria-controls', 'navMenu');
        }

        if (this.navMenu) {
            this.navMenu.setAttribute('role', 'navigation');
            this.navMenu.setAttribute('aria-label', 'Hauptnavigation');
        }

        // Dropdown accessibility
        this.dropdowns.forEach((dropdown, index) => {
            const trigger = dropdown.querySelector('.nav-link');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (trigger && menu) {
                const menuId = `dropdown-menu-${index}`;
                menu.id = menuId;
                trigger.setAttribute('aria-haspopup', 'true');
                trigger.setAttribute('aria-expanded', 'false');
                trigger.setAttribute('aria-controls', menuId);
            }
        });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = scrollTop > this.lastScrollTop ? 'down' : 'up';
        
        // Update scroll state
        const wasScrolled = this.isScrolled;
        this.isScrolled = scrollTop > this.scrollThreshold;
        
        if (wasScrolled !== this.isScrolled) {
            this.updateHeaderState();
        }

        // Hide/show header on scroll (mobile)
        if (window.innerWidth < 1024) {
            if (scrollDirection === 'down' && scrollTop > 200) {
                this.header.style.transform = 'translateY(-100%)';
            } else if (scrollDirection === 'up') {
                this.header.style.transform = 'translateY(0)';
            }
        } else {
            this.header.style.transform = 'translateY(0)';
        }

        this.lastScrollTop = scrollTop;
        this.updateActiveNavLink();
    }

    updateHeaderState() {
        if (!this.header) return;

        if (this.isScrolled) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }

    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        if (!this.navMenu) return;

        this.isMobileMenuOpen = true;
        this.navMenu.classList.add('open');
        document.body.classList.add('mobile-menu-open');
        
        if (this.mobileToggle) {
            this.mobileToggle.classList.add('active');
            this.mobileToggle.setAttribute('aria-expanded', 'true');
            this.mobileToggle.setAttribute('aria-label', 'Menü schließen');
        }

        // Focus management
        const firstLink = this.navMenu.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 300);
        }
    }

    closeMobileMenu() {
        if (!this.navMenu) return;

        this.isMobileMenuOpen = false;
        this.navMenu.classList.remove('open');
        document.body.classList.remove('mobile-menu-open');
        
        if (this.mobileToggle) {
            this.mobileToggle.classList.remove('active');
            this.mobileToggle.setAttribute('aria-expanded', 'false');
            this.mobileToggle.setAttribute('aria-label', 'Menü öffnen');
        }

        // Close all dropdowns
        this.dropdowns.forEach(dropdown => {
            this.closeDropdown(dropdown);
        });
    }

    openDropdown(dropdown) {
        const trigger = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (trigger && menu) {
            dropdown.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
            menu.style.visibility = 'visible';
            menu.style.opacity = '1';
            menu.style.transform = 'translateY(0)';
        }
    }

    closeDropdown(dropdown) {
        const trigger = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (trigger && menu) {
            dropdown.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
            menu.style.visibility = 'hidden';
            menu.style.opacity = '0';
            menu.style.transform = 'translateY(-10px)';
        }
    }

    toggleDropdown(dropdown) {
        if (dropdown.classList.contains('open')) {
            this.closeDropdown(dropdown);
        } else {
            // Close other dropdowns first
            this.dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    this.closeDropdown(otherDropdown);
                }
            });
            this.openDropdown(dropdown);
        }
    }

    handleNavLinkClick(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');
        
        // Handle anchor links
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                // Close mobile menu if open
                if (this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
                
                // Smooth scroll to target
                this.scrollToElement(target);
                
                // Update URL without triggering scroll
                history.pushState(null, null, href);
            }
        } else if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            // Internal page navigation - close mobile menu
            if (this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        }
    }

    scrollToElement(element) {
        const headerHeight = this.header ? this.header.offsetHeight : 80;
        const targetPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    updateActiveNavLink() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            
            // Check for exact path match
            if (href === currentPath || (currentPath === '/' && href === 'index.html')) {
                link.classList.add('active');
            }
            // Check for hash match on same page
            else if (href === currentHash && currentHash) {
                link.classList.add('active');
            }
            // Check for section visibility (for single-page navigation)
            else if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target && this.isElementInViewport(target)) {
                    link.classList.add('active');
                }
            }
        });
    }

    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const headerHeight = this.header ? this.header.offsetHeight : 80;
        
        return (
            rect.top <= headerHeight + 100 &&
            rect.bottom >= headerHeight
        );
    }

    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth >= 1024 && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }

        // Reset header transform
        if (this.header) {
            this.header.style.transform = 'translateY(0)';
        }

        // Close dropdowns on mobile
        if (window.innerWidth < 1024) {
            this.dropdowns.forEach(dropdown => {
                this.closeDropdown(dropdown);
            });
        }
    }

    // Utility function for throttling
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Public API methods
    navigateTo(href) {
        if (href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                this.scrollToElement(target);
                history.pushState(null, null, href);
            }
        } else {
            window.location.href = href;
        }
    }

    highlightNavLink(href) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    }

    addCustomNavItem(text, href, position = 'end') {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        a.className = 'nav-link';
        a.addEventListener('click', this.handleNavLinkClick.bind(this));
        li.appendChild(a);

        if (position === 'start') {
            this.navMenu.insertBefore(li, this.navMenu.firstChild);
        } else {
            this.navMenu.appendChild(li);
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.navigationManager = new NavigationManager();
});

// Add required CSS if not already included
document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('#navigation-styles')) {
        const style = document.createElement('style');
        style.id = 'navigation-styles';
        style.textContent = `
            /* Mobile Menu Styles */
            .mobile-menu-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .mobile-menu-open .mobile-menu-backdrop {
                opacity: 1;
                visibility: visible;
            }

            @media (max-width: 1023px) {
                .nav-menu-mobile {
                    position: fixed;
                    top: 80px;
                    left: 0;
                    width: 100%;
                    height: calc(100vh - 80px);
                    background: white;
                    flex-direction: column;
                    padding: 2rem;
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                    overflow-y: auto;
                    z-index: 1000;
                }

                .nav-menu-mobile.open {
                    transform: translateX(0);
                }

                .nav-menu-mobile .nav-link {
                    padding: 1rem;
                    border-bottom: 1px solid #e2e8f0;
                    font-size: 1.1rem;
                }

                .nav-dropdown .dropdown-menu {
                    position: static;
                    box-shadow: none;
                    border: none;
                    padding-left: 1rem;
                    background: #f8fafc;
                    margin-top: 0.5rem;
                    border-radius: 0.5rem;
                }

                .mobile-toggle.active span:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }

                .mobile-toggle.active span:nth-child(2) {
                    opacity: 0;
                }

                .mobile-toggle.active span:nth-child(3) {
                    transform: rotate(-45deg) translate(7px, -6px);
                }
            }

            /* Dropdown Animation */
            .dropdown-menu {
                transition: all 0.3s ease;
            }

            /* Header Scroll Animation */
            .header {
                transition: all 0.3s ease;
            }

            /* Smooth Scroll */
            html {
                scroll-behavior: smooth;
            }

            /* Focus Styles */
            .nav-link:focus,
            .mobile-toggle:focus {
                outline: 2px solid #3b82f6;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
});

// Expose NavigationManager globally
window.NavigationManager = NavigationManager;