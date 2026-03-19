/**
 * NEWBIE - Modern Mentorluk Platformu
 * I am still learning
 * JavaScript Functionality
 */

/* ── Splash Screen ── */
(function initSplash() {
    const canvas = document.getElementById('space-canvas');
    const ctx    = canvas.getContext('2d');
    const flash  = document.getElementById('splash-flash');

    let stars        = [];
    let animId;
    let isVortex     = false;
    let vortexT      = 0;   // 0→1 vortex progress

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars(n) {
        stars = [];
        for (let i = 0; i < n; i++) {
            const blue = Math.random() > 0.65;
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.2,
                alpha: Math.random(),
                speed: Math.random() * 0.25 + 0.04,
                tSpeed: Math.random() * 0.018 + 0.004,
                tDir:   Math.random() > 0.5 ? 1 : -1,
                blue,
            });
        }
    }

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width  / 2;
        const cy = canvas.height / 2;

        stars.forEach(s => {
            if (isVortex) {
                vortexT = Math.min(vortexT + 0.008, 1);
                // Sadece hafif hızlanma — spiral/glow yok
                s.y += s.speed * (1 + vortexT * 3);
                if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }

                const color = s.blue
                    ? `rgba(180,210,255,${s.alpha})`
                    : `rgba(255,255,255,${s.alpha})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            } else {
                // Normal idle twinkle + slow drift
                s.alpha += s.tSpeed * s.tDir;
                if (s.alpha >= 1) { s.alpha = 1; s.tDir = -1; }
                if (s.alpha <= 0) { s.alpha = 0; s.tDir =  1; }
                s.y += s.speed;
                if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }

                const color = s.blue
                    ? `rgba(180,210,255,${s.alpha})`
                    : `rgba(255,255,255,${s.alpha})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            }
        });

        animId = requestAnimationFrame(drawStars);
    }

    resize();
    createStars(260);
    drawStars();
    window.addEventListener('resize', () => { resize(); createStars(260); });

    window.hideSplash = function () {
        const splash  = document.getElementById('splash-screen');
        const content = document.querySelector('.splash-content');

        // 1 — içerik yavaşça solar
        content.style.transition = 'opacity 0.8s ease';
        content.style.opacity    = '0';

        // 2 — yıldızlar hafifçe hızlanır
        setTimeout(() => { isVortex = true; }, 600);

        // 3 — ekran yavaşça kararır
        setTimeout(() => {
            splash.style.transition = 'opacity 1.6s ease';
            splash.style.opacity    = '0';
        }, 1000);

        // 4 — splash kaldırılır, site altta zaten hazır
        setTimeout(() => {
            cancelAnimationFrame(animId);
            splash.style.display = 'none';
        }, 2700);
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initAnimations();
    initFAQ();
    initCounters();
    initFormValidation();
    initSmoothScroll();
});

/**
 * Navigation Functionality
 */
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = navToggle.querySelectorAll('span');
            if (navToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Scroll-triggered Animations
 */
function initScrollEffects() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Handle staggered animations
                const delay = entry.target.dataset.aosDelay || 0;
                entry.target.style.transitionDelay = `${delay}ms`;
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Custom Animations
 */
function initAnimations() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (hero && heroVisual) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            if (scrolled < hero.offsetHeight) {
                heroVisual.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    // Floating cards animation enhancement
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.5}s`;
    });

    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Open first FAQ item by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
}

/**
 * Animated Counters
 */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const speed = 200; // Animation duration in ms per unit
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.count);
        const increment = target / speed;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment * 10;
                counter.textContent = Math.ceil(current).toLocaleString('tr-TR');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString('tr-TR');
            }
        };
        
        updateCounter();
    };
    
    // Observe counters for scroll trigger
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

/**
 * Form Validation
 */
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Simple validation
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    showInputError(input, 'Bu alan zorunludur');
                } else if (input.type === 'email' && !isValidEmail(input.value)) {
                    isValid = false;
                    showInputError(input, 'Geçerli bir e-posta adresi girin');
                } else {
                    clearInputError(input);
                }
            });
            
            if (isValid) {
                // Show success message
                showNotification('Mesajınız başarıyla gönderildi!', 'success');
                contactForm.reset();
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    showInputError(input, 'Bu alan zorunludur');
                } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
                    showInputError(input, 'Geçerli bir e-posta adresi girin');
                } else {
                    clearInputError(input);
                }
            });
            
            input.addEventListener('input', () => {
                clearInputError(input);
            });
        });
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showInputError(input, message) {
    clearInputError(input);
    
    input.style.borderColor = '#ef4444';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 4px;
    `;
    
    input.parentElement.appendChild(errorDiv);
}

function clearInputError(input) {
    input.style.borderColor = '';
    const existingError = input.parentElement.querySelector('.input-error');
    if (existingError) {
        existingError.remove();
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
    `;
    closeBtn.addEventListener('click', () => notification.remove());
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
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

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Add CSS for notifications
 */
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

/**
 * Testimonials Slider (Auto-scroll for mobile)
 */
function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    
    if (slider && window.innerWidth < 768) {
        let isScrolling = false;
        let scrollInterval;
        
        const startAutoScroll = () => {
            scrollInterval = setInterval(() => {
                if (!isScrolling) {
                    slider.scrollLeft += 1;
                    
                    // Reset to beginning when reached end
                    if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
                        slider.scrollLeft = 0;
                    }
                }
            }, 30);
        };
        
        slider.addEventListener('touchstart', () => isScrolling = true);
        slider.addEventListener('touchend', () => setTimeout(() => isScrolling = false, 1000));
        
        startAutoScroll();
    }
}

// Initialize testimonials slider on load
window.addEventListener('load', initTestimonialsSlider);

/**
 * Lazy Loading Images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Call lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

/**
 * Active Navigation Link Highlight
 */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', debounce(() => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                link.style.color = '#131922';
                link.style.background = '#f1f3f8';
            } else {
                link.style.color = '';
                link.style.background = '';
            }
        });
    }, 100));
}

// Initialize active nav highlight
document.addEventListener('DOMContentLoaded', initActiveNavHighlight);

/**
 * Preloader (Optional)
 */
function hidePreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
}

window.addEventListener('load', hidePreloader);

/**
 * Back to Top Button
 */
function initBackToTop() {
    // Create button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Yukarı Çık');
    
    backToTop.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #131922;
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(19, 25, 34, 0.3);
        z-index: 999;
    `;
    
    document.body.appendChild(backToTop);
    
    // Show/hide on scroll
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    }, 100));
    
    // Scroll to top on click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    backToTop.addEventListener('mouseenter', () => {
        backToTop.style.transform = 'translateY(-4px)';
        backToTop.style.background = '#1e2633';
    });
    
    backToTop.addEventListener('mouseleave', () => {
        backToTop.style.transform = 'translateY(0)';
        backToTop.style.background = '#131922';
    });
}

// Initialize back to top
document.addEventListener('DOMContentLoaded', initBackToTop);

console.log('🚀 Newbie - I am still learning');
console.log('Website loaded successfully!');

