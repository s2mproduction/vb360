// ===== S2M PRODUCTION - PREMIUM JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen();
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
    initFAQ();
    initScrollAnimations();
    initVideoAutoplay();
    initTestimonialSlider();
    initScrollProgress();
    initBackToTop();
    initParallax();
    initCounterAnimation();
    initTiltEffect();
    initRippleEffect();
});

// Loading Screen
function initLoadingScreen() {
    const loading = document.getElementById('loadingScreen');
    if (!loading) return;
    
    const hide = () => loading.classList.add('hidden');
    
    if (document.readyState === 'complete') {
        setTimeout(hide, 300);
    } else {
        window.addEventListener('load', () => setTimeout(hide, 300));
    }
    
    setTimeout(hide, 2000); // Fallback
}

// Mobile Menu
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 0;
                window.scrollTo({
                    top: target.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', throttle(() => {
        const currentScroll = window.pageYOffset;
        
        header.classList.toggle('scrolled', currentScroll > 50);
        
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    }, 100));
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
            
            item.classList.toggle('active', !isActive);
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const elements = document.querySelectorAll(
        '.layanan-card, .benefit-card, .gallery-card, .testimonial-card, .process-card, .faq-item, .pricing-card, .section-header, .bonus-banner, .pricing-note, .cta-wrapper'
    );
    
    if (!('IntersectionObserver' in window)) {
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        const parent = el.closest('.layanan-grid, .benefits-grid, .gallery-grid, .pricing-grid, .process-grid');
        if (parent) {
            const siblings = Array.from(parent.children);
            el.dataset.delay = siblings.indexOf(el) * 80;
        }
        
        observer.observe(el);
    });
}

// Video Autoplay
function initVideoAutoplay() {
    const videos = document.querySelectorAll('.gallery-video');
    
    if (!('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.3 });
    
    videos.forEach(video => {
        video.muted = true;
        video.playsInline = true;
        video.loop = true;
        observer.observe(video);
    });
}

// Testimonial Slider - Enhanced
function initTestimonialSlider() {
    const slider = document.getElementById('testimonialSlider');
    const dotsContainer = document.getElementById('sliderDots');
    const counterEl = document.getElementById('sliderCounter');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (!slider || !dotsContainer) return;
    
    const slides = slider.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;
    let currentSlide = 0;
    let autoSlideInterval;
    let isAnimating = false;
    
    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.setAttribute('aria-label', `Testimoni ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            if (!isAnimating) goToSlide(i);
        });
        dotsContainer.appendChild(dot);
    }
    
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    
    function updateUI() {
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Update counter
        if (counterEl) {
            counterEl.textContent = `${currentSlide + 1} / ${totalSlides}`;
        }
        
        // Update arrow states
        if (prevBtn) {
            prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
        }
        if (nextBtn) {
            nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
        }
    }
    
    function goToSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        currentSlide = index;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        if (currentSlide >= totalSlides) currentSlide = 0;
        
        const slideWidth = slides[0].offsetWidth;
        const gap = 25; // gap from CSS
        const scrollPosition = currentSlide * (slideWidth + gap);
        
        slider.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        updateUI();
        resetAutoSlide();
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    function nextSlide() { 
        if (!isAnimating) goToSlide(currentSlide + 1); 
    }
    function prevSlide() { 
        if (!isAnimating) goToSlide(currentSlide - 1); 
    }
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 4000);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Touch/Swipe support - improved
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isSwiping = true;
        clearInterval(autoSlideInterval);
    }, { passive: true });
    
    slider.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        const touchMoveX = e.changedTouches[0].screenX;
        const touchMoveY = e.changedTouches[0].screenY;
        const diffX = Math.abs(touchStartX - touchMoveX);
        const diffY = Math.abs(touchStartY - touchMoveY);
        
        // If horizontal swipe is dominant, prevent vertical scroll
        if (diffX > diffY && diffX > 10) {
            e.preventDefault();
        }
    }, { passive: false });
    
    slider.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        isSwiping = false;
        
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoSlide();
    }, { passive: true });
    
    // Mouse drag support for desktop
    let isDragging = false;
    let startX = 0;
    
    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        slider.style.cursor = 'grabbing';
        clearInterval(autoSlideInterval);
    });
    
    slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    slider.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        slider.style.cursor = 'grab';
        
        const diff = startX - e.pageX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextSlide() : prevSlide();
        }
        startAutoSlide();
    });
    
    slider.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            slider.style.cursor = 'grab';
            startAutoSlide();
        }
    });
    
    // Keyboard navigation
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // Pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    slider.addEventListener('mouseleave', () => {
        if (!isDragging) startAutoSlide();
    });
    
    // Handle scroll snap detection
    let scrollTimeout;
    slider.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const slideWidth = slides[0].offsetWidth;
            const gap = 25;
            const newSlide = Math.round(slider.scrollLeft / (slideWidth + gap));
            if (newSlide !== currentSlide && newSlide >= 0 && newSlide < totalSlides) {
                currentSlide = newSlide;
                updateUI();
            }
        }, 100);
    }, { passive: true });
    
    // Initial setup
    slider.style.cursor = 'grab';
    updateUI();
    startAutoSlide();
}

// Scroll Progress
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }, 10));
}

// Back to Top
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', throttle(() => {
        backToTop.classList.toggle('visible', window.pageYOffset > 500);
    }, 100));
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Utility: Throttle
function throttle(func, limit) {
    let inThrottle;
    return function() {
        if (!inThrottle) {
            func.apply(this, arguments);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Parallax Effect
function initParallax() {
    const floatCircles = document.querySelectorAll('.float-circle');
    if (!floatCircles.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        floatCircles.forEach((circle, index) => {
            const speed = (index + 1) * 0.15;
            circle.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, 16), { passive: true });
}

// Counter Animation
function initCounterAnimation() {
    const stats = document.querySelectorAll('.stat-num');
    if (!('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const text = entry.target.textContent;
                const match = text.match(/^(\d+)(.*)$/);
                
                if (match) {
                    const end = parseInt(match[1]);
                    const suffix = match[2];
                    animateCounter(entry.target, 0, end, suffix, 2000);
                }
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, start, end, suffix, duration) {
    const startTime = performance.now();
    
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(start + (end - start) * easedProgress);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Tilt Effect for Cards
function initTiltEffect() {
    if (window.innerWidth < 1024) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const cards = document.querySelectorAll('.pricing-card, .layanan-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Ripple Effect for Buttons
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .pricing-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                width: 10px;
                height: 10px;
                margin-left: -5px;
                margin-top: -5px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation to stylesheet
    if (!document.getElementById('rippleStyle')) {
        const style = document.createElement('style');
        style.id = 'rippleStyle';
        style.textContent = `
            @keyframes ripple {
                to { transform: scale(40); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Console Easter Egg
console.log('%c🎬 S2M Production', 'font-size: 24px; font-weight: bold; color: #C9A227;');
console.log('%cVideobooth 360° Premium', 'font-size: 14px; color: #888;');
console.log('%c✨ Hubungi: wa.me/6281211114522', 'font-size: 12px; color: #25D366;');
