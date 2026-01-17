// Smooth Scrolling for Navigation Links
document.addEventListener('DOMContentLoaded', function() {
    // Get all anchor links that point to sections
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || href === '') {
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            }
        });
    });
    
    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');
    
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100; // Offset for navbar
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Throttle scroll event for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateActiveNavLink();
                toggleBackToTopButton();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    // Back to Top Button Functionality
    const backToTopButton = document.getElementById('backToTop');
    
    function toggleBackToTopButton() {
        if (!backToTopButton) return;
        
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }
    
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Initialize back to top button visibility
    toggleBackToTopButton();

    // Profile gallery smooth continuous horizontal slider
    const slider = document.querySelector('.profile-slider');
    const track = document.querySelector('.profile-slider-track');
    const slides = document.querySelectorAll('.profile-slide');

    if (slider && track && slides.length > 0) {
        // Duplicate slides to create an infinite loop effect
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            track.appendChild(clone);
        });

        let position = 0; // current translateX in pixels
        let lastTime = null;
        const speed = 40; // pixels per second
        let animationId = null;

        function step(timestamp) {
            if (!lastTime) {
                lastTime = timestamp;
            }
            const deltaSeconds = (timestamp - lastTime) / 1000;
            lastTime = timestamp;

            const totalWidth = track.scrollWidth / 2; // width of original content

            // Move left continuously
            position -= speed * deltaSeconds;

            // Reset position when we've scrolled one full set of slides
            if (-position >= totalWidth) {
                position += totalWidth;
            }

            track.style.transform = `translateX(${position}px)`;
            animationId = window.requestAnimationFrame(step);
        }

        function startAnimation() {
            if (animationId === null) {
                lastTime = null;
                animationId = window.requestAnimationFrame(step);
            }
        }

        function stopAnimation() {
            if (animationId !== null) {
                window.cancelAnimationFrame(animationId);
                animationId = null;
            }
        }

        // Start continuous animation
        startAnimation();

        // Pause on hover, resume on leave
        slider.addEventListener('mouseenter', stopAnimation);
        slider.addEventListener('mouseleave', startAnimation);

        // Keep things stable on resize
        window.addEventListener('resize', () => {
            position = 0;
            track.style.transform = `translateX(${position}px)`;
        });
    }
});