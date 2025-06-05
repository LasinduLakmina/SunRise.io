document.addEventListener('DOMContentLoaded', function() {
    // Scroll Progress Indicator
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const progress = (window.pageYOffset / totalHeight) * 100;
            scrollProgress.style.width = progress + '%';
        });
    }

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle') || createDarkModeToggle();
    const body = document.body;
    const html = document.documentElement;

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        body.classList.add('dark-mode');
        html.setAttribute('data-theme', 'dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        html.setAttribute('data-theme', 'light');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        html.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        this.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');
    if (newsletterForm && newsletterMessage) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('newsletter-email').value;
            if (!validateEmail(email)) {
                showMessage(newsletterMessage, 'Please enter a valid email address', 'error');
                return;
            }
            newsletterMessage.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Subscribing...</div>';
            setTimeout(() => {
                showMessage(newsletterMessage, 'Thank you for subscribing!', 'success');
                newsletterForm.reset();
            }, 1500);
        });
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('#menu');
    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            menu.classList.toggle('active');
            menuBtn.innerHTML = menu.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('#navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            if (menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
                if (menuBtn) menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation on Scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                element.classList.add(element.classList.contains('feature-card') ? 'animate' : 'animated');
            }
        });
    };

    // Add Animation Classes
    const addAnimationClasses = () => {
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            card.classList.add('animate-on-scroll');
            card.style.animationDelay = `${0.1 * index}s`;
        });
        document.querySelectorAll('.product-card').forEach((card, index) => {
            card.classList.add('animate-on-scroll');
            card.style.animationDelay = `${0.1 * index}s`;
        });
        const aboutContent = document.querySelector('.about-content');
        if (aboutContent) aboutContent.classList.add('animate-on-scroll');
        const contactContent = document.querySelector('.contact-content');
        if (contactContent) contactContent.classList.add('animate-on-scroll');
    };

    // Testimonial Slider
    function setupTestimonialSlider() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentSlide = 0;
        const totalSlides = slides.length;

        function updateSlidePosition() {
            slides.forEach(slide => slide.classList.remove('active', 'prev'));
            dots.forEach((dot, index) => dot.classList.toggle('active', index === currentSlide));
            slides[currentSlide].classList.add('active');
            const prevSlideIndex = (currentSlide - 1 + totalSlides) % totalSlides;
            slides[prevSlideIndex].classList.add('prev');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlidePosition();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlidePosition();
        }

        if (nextBtn && prevBtn && dots.length) {
            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentSlide = index;
                    updateSlidePosition();
                });
            });

            const sliderContainer = document.querySelector('.testimonial-slider-container');
            let autoSlideInterval = setInterval(nextSlide, 5000);
            sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
            sliderContainer.addEventListener('mouseleave', () => {
                clearInterval(autoSlideInterval);
                autoSlideInterval = setInterval(nextSlide, 5000);
            });

            updateSlidePosition();
        }
    }

    // Product Filtering
    function setupProductFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filterValue = this.getAttribute('data-filter');
                productCards.forEach(card => {
                    const isVisible = filterValue === 'all' || card.getAttribute('data-category') === filterValue;
                    card.style.opacity = isVisible ? '1' : '0';
                    card.style.transform = isVisible ? 'translateY(0)' : 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = isVisible ? 'block' : 'none';
                    }, isVisible ? 0 : 300);
                });
            });
        });
    }

    // Image Modal
    function setupImageModal() {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-image');
        const captionText = document.getElementById('modal-caption');
        const closeBtn = document.querySelector('.close-modal');
        const productImages = document.querySelectorAll('.product-img img');

        if (modal && modalImg && captionText && closeBtn) {
            productImages.forEach(img => {
                img.addEventListener('click', function() {
                    modal.style.display = 'flex';
                    modalImg.src = this.src;
                    captionText.innerHTML = this.alt;
                    document.body.style.overflow = 'hidden';
                });
            });

            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
    }

    // Create Dark Mode Toggle
    function createDarkModeToggle() {
        const toggle = document.createElement('button');
        toggle.innerHTML = localStorage.getItem('theme') === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        toggle.className = 'dark-mode-toggle';
        toggle.id = 'dark-mode-toggle';
        document.body.appendChild(toggle);
        return toggle;
    }

    // Back to Top Button
    function createBackToTopButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        btn.className = 'back-to-top';
        btn.style.display = 'none';
        document.body.appendChild(btn);

        window.addEventListener('scroll', () => {
            btn.style.display = window.scrollY > 300 ? 'block' : 'none';
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Helper Functions
    function validateEmail(email) {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase());
    }

    function showMessage(element, message, type) {
        element.innerHTML = message;
        element.className = 'form-message ' + type;
        if (type === 'success') {
            setTimeout(() => {
                element.innerHTML = '';
                element.className = 'form-message';
            }, 5000);
        }
    }

    // Initialize
    addAnimationClasses();
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    setupTestimonialSlider();
    setupProductFiltering();
    setupImageModal();
    createBackToTopButton();
});