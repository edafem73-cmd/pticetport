// ==================== THEME TOGGLE (LIGHT / DARK MODE) ====================
(function () {
    const STORAGE_KEY = 'cetd-theme';
    const toggleBtn = document.getElementById('themeToggle');
    const label = toggleBtn ? toggleBtn.querySelector('.theme-toggle-label') : null;
    const saved = localStorage.getItem(STORAGE_KEY);

    function updateLabel() {
        if (!label) return;
        const isLight = document.body.classList.contains('light-mode');
        label.textContent = isLight ? 'Dark Mode' : 'Light Mode';
    }

    if (saved === 'light') {
        document.body.classList.add('light-mode');
    }
    updateLabel();

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark');
            updateLabel();
        });
    }
})();

// ==================== IMAGE LIGHTBOX (CLICK-TO-ZOOM) ====================
(function () {
    const zoomableImages = document.querySelectorAll('.timetable-img');
    if (!zoomableImages.length) return;

    // Build overlay once
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close">&times;</button>
            <img src="" alt="">
            <span class="lightbox-hint">Tap outside or press Esc to close</span>
        </div>
    `;
    document.body.appendChild(overlay);

    const overlayImg = overlay.querySelector('img');
    const closeBtn = overlay.querySelector('.lightbox-close');

    function openLightbox(src, alt) {
        overlayImg.src = src;
        overlayImg.alt = alt || '';
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    zoomableImages.forEach(img => {
        img.addEventListener('click', () => openLightbox(img.src, img.alt));
    });

    closeBtn.addEventListener('click', closeLightbox);

    // Click outside the image (on the dark backdrop) closes it
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeLightbox();
    });

    // Esc key closes it
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeLightbox();
        }
    });
})();

// ==================== NAVIGATION MENU TOGGLE ====================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ==================== STICKY NAVBAR EFFECT ====================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 102, 255, 0.1)';
        navbar.classList.remove('scrolled');
    } else {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 102, 255, 0.2)';
        navbar.classList.add('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Only prevent default for valid hash links
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==================== CAROUSEL FUNCTIONALITY ====================
let currentSlide = 0;
const carouselTrack = document.getElementById('carouselTrack');

if (carouselTrack) {
    const cards = document.querySelectorAll('.carousel-card');
    const totalSlides = cards.length;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.dot');

    // Update carousel display
    function updateCarousel() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next');
            
            if (index === currentSlide) {
                card.classList.add('active');
            } else if (index === (currentSlide - 1 + totalSlides) % totalSlides) {
                card.classList.add('prev');
            } else if (index === (currentSlide + 1) % totalSlides) {
                card.classList.add('next');
            }
        });

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentSlide) {
                dot.classList.add('active');
            }
        });
    }

    // Navigate to specific slide
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }

    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // Event listeners for buttons
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Auto-play carousel
    let autoplay = setInterval(nextSlide, 5000);

    // Pause on hover
    carouselTrack.addEventListener('mouseenter', () => {
        clearInterval(autoplay);
    });

    carouselTrack.addEventListener('mouseleave', () => {
        autoplay = setInterval(nextSlide, 5000);
    });

    // Initialize carousel
    updateCarousel();
}

// ==================== FORM VALIDATION ====================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');

    // Validation functions
    function validateName() {
        const name = nameInput.value.trim();
        if (name.length < 3) {
            nameError.textContent = 'Name must be at least 3 characters';
            nameError.classList.add('show');
            return false;
        }
        nameError.classList.remove('show');
        return true;
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailError.classList.add('show');
            return false;
        }
        emailError.classList.remove('show');
        return true;
    }

    function validateSubject() {
        const subject = subjectInput.value.trim();
        if (subject.length < 5) {
            subjectError.textContent = 'Subject must be at least 5 characters';
            subjectError.classList.add('show');
            return false;
        }
        subjectError.classList.remove('show');
        return true;
    }

    function validateMessage() {
        const message = messageInput.value.trim();
        if (message.length < 10) {
            messageError.textContent = 'Message must be at least 10 characters';
            messageError.classList.add('show');
            return false;
        }
        messageError.classList.remove('show');
        return true;
    }

    // Real-time validation
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    subjectInput.addEventListener('blur', validateSubject);
    messageInput.addEventListener('blur', validateMessage);

    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();

        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            // If all validations pass, submit the form
            contactForm.submit();
        }
    });
}

// ==================== SCROLL REVEAL ANIMATIONS ====================
function revealOnScroll() {
    const reveals = document.querySelectorAll('.update-card, .course-card, .lecturer-card, .value-card');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize elements for scroll reveal
document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.update-card, .course-card, .lecturer-card, .value-card');
    reveals.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

window.addEventListener('scroll', revealOnScroll);

// ==================== ACTIVE LINK HIGHLIGHTING ====================
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === '/' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Set active link on page load
document.addEventListener('DOMContentLoaded', setActiveLink);

// ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.stat-item, .info-item, .timetable-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});