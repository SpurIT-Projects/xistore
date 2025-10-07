// Main JavaScript functionality for XISTORE website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initHeroSlider();
    initBackToTop();
    initMobileMenu();
    initSearchFunctionality();
    initContactForm();
    initProductInteractions();
    initScrollAnimations();
    
    // Show page load complete
    console.log('XISTORE website loaded successfully');
});

// Header functionality
function initHeader() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add shadow on scroll
        if (currentScrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down - hide header
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up - show header
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Hero slider functionality
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    let currentSlide = 0;
    let slideInterval;
    
    if (slides.length === 0) return;
    
    function showSlide(index, direction = 'next') {
        const prevIndex = currentSlide;
        
        // Remove all classes
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next');
            if (i === prevIndex && i !== index) {
                slide.classList.add(direction === 'next' ? 'prev' : 'next');
            }
        });
        
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide with animation
        setTimeout(() => {
            slides[index].classList.add('active');
            if (dots[index]) {
                dots[index].classList.add('active');
            }
        }, 50);
    }
    
    function nextSlide() {
        const newSlide = (currentSlide + 1) % slides.length;
        showSlide(newSlide, 'next');
        currentSlide = newSlide;
    }
    
    function prevSlide() {
        const newSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(newSlide, 'prev');
        currentSlide = newSlide;
    }
    
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const direction = index > currentSlide ? 'next' : 'prev';
            showSlide(index, direction);
            currentSlide = index;
            stopAutoSlide();
            startAutoSlide();
        });
    });
    
    // Pause on hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAutoSlide);
        heroSection.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Initialize first slide
    showSlide(0, 'next');
    
    // Start automatic sliding
    startAutoSlide();
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (!mobileMenuBtn || !nav) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('mobile-active');
        mobileMenuBtn.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            nav.classList.remove('mobile-active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            nav.classList.remove('mobile-active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// Search functionality
function initSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (!searchInput || !searchBtn) return;
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // In a real application, this would perform an actual search
            showToast('Поиск: \"' + query + '\"', 'info');
            console.log('Searching for:', query);
        } else {
            showToast('Введите поисковый запрос', 'warning');
        }
    }
    
    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Search suggestions (placeholder functionality)
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = searchInput.value.trim();
            if (query.length > 2) {
                // In a real app, show search suggestions
                console.log('Search suggestions for:', query);
            }
        }, 300);
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.querySelector('.contact-form .form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('.form-btn');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.innerHTML = '<span class="loading"></span> Отправляется...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success
            showToast('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
            contactForm.reset();
            
        } catch (error) {
            // Error
            showToast('Ошибка отправки заявки. Попробуйте еще раз.', 'error');
            console.error('Form submission error:', error);
            
        } finally {
            // Restore button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Product interactions
function initProductInteractions() {
    const productBtns = document.querySelectorAll('.product-btn');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = 0;
    
    productBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const productCard = btn.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            // Add to cart animation
            btn.innerHTML = '<span class="loading"></span> Добавляется...';
            btn.disabled = true;
            
            setTimeout(() => {
                // Update cart count
                cartItems++;
                if (cartCount) {
                    cartCount.textContent = cartItems;
                    cartCount.style.transform = 'scale(1.3)';
                    setTimeout(() => {
                        cartCount.style.transform = 'scale(1)';
                    }, 200);
                }
                
                // Show success message
                showToast(`${productTitle} добавлен в корзину`, 'success');
                
                // Restore button
                btn.textContent = 'Добавлено';
                btn.disabled = false;
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    btn.textContent = 'В корзину';
                }, 2000);
                
            }, 1000);
        });
    });
    
    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const image = card.querySelector('.product-image img');
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const image = card.querySelector('.product-image img');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate counters
                if (entry.target.classList.contains('stat-item')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-item, .product-card, .service-card, .stat-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Counter animation
function animateCounter(element) {
    const numberElement = element.querySelector('.stat-number');
    if (!numberElement) return;
    
    const targetNumber = parseInt(numberElement.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const increment = targetNumber / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
            current = targetNumber;
            clearInterval(timer);
        }
        
        const suffix = numberElement.textContent.includes('+') ? '+' : '';
        numberElement.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 16);
}

// Utility functions
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="toast-icon ${iconMap[type]}"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
    
    // Close on click
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });
}

// Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
});

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll events
const debouncedScroll = debounce(() => {
    // Any additional scroll-based functionality can go here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key closes modals and mobile menu
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        const mobileMenu = document.querySelector('.nav.mobile-active');
        
        if (activeModal) {
            activeModal.classList.remove('active');
        }
        
        if (mobileMenu) {
            mobileMenu.classList.remove('mobile-active');
            document.querySelector('.mobile-menu-btn').classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
});

// Initialize lazy loading for images
function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}
