document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');

            const spans = mobileMenuBtn.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
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
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add reveal animation to cards
    document.querySelectorAll('.glass-card, .stat, .hero-badge').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        observer.observe(el);
    });

    // Add revealed class styles
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Hero elements immediate reveal
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-cta');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        el.style.transitionDelay = `${index * 0.15}s`;

        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });

    // Optimized Parallax effect for gradient orb
    let ticking = false;
    let lastStarTime = 0;
    
    // Track mouse position for "Idle" sparks
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isMoving = false;
    let moveTimeout;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
        
        // Clear the "stopped" timeout
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            isMoving = false;
        }, 100); // Consider stopped after 100ms of no movement

        if (!ticking) {
            window.requestAnimationFrame(() => {
                const orb = document.querySelector('.gradient-orb');
                if (orb) {
                    const x = (window.innerWidth / 2 - e.clientX) / 30;
                    const y = (window.innerHeight / 2 - e.clientY) / 30;
                    orb.style.transform = `translateX(calc(-50% + ${x}px)) translateY(${y}px)`;
                }
                
                // MOVEMENT SPARKS (Dense)
                const now = Date.now();
                if (now - lastStarTime > 20) { // Faster spawn rate while moving
                    createMagicStar(e.clientX, e.clientY, false); // false = normal size
                    createMagicStar(e.clientX, e.clientY, false);
                    lastStarTime = now;
                }

                ticking = false;
            });
            ticking = true;
        }
    });

    // IDLE SPARKS (The AI is always thinking)
    setInterval(() => {
        if (!isMoving) {
            // Spawn a single star occasionally at the resting position
             createMagicStar(mouseX, mouseY, false);
        }
    }, 200); // Every 200ms

    // CLICK BURST (Big Idea)
    document.addEventListener('click', (e) => {
        // Spawn a ring of stars
        for (let i = 0; i < 12; i++) {
            createMagicStar(e.clientX, e.clientY, true); // true = explosive
        }
    });
    
    // Magic Star Function
    function createMagicStar(x, y, isExplosion) {
        const star = document.createElement('div');
        star.classList.add('magic-particle');
        
        // Brand Colors + POP Colors
        const colors = [
            '#274c6f', '#3a6a9a', '#b5465a', '#d4738a', '#FFD700', '#00d2ff'
        ];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Size variation
        let size = Math.random() * 16 + 8;
        if (isExplosion) size *= 1.5; // Bigger stars for click explosions
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.background = color;
        
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;

        star.style.left = `${x + offsetX}px`;
        star.style.top = `${y + window.scrollY + offsetY}px`;
        
        // Shapes
        const shapeType = Math.random();
        if (shapeType < 0.33) {
            star.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
        } else if (shapeType < 0.66) {
            star.style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
        } else {
             star.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
        }
        
        document.body.appendChild(star);
        
        // ANIMATION
        // Distance depends on explosion type
        const distMult = isExplosion ? 250 : 150; // Fly further on click
        const destinationX = (Math.random() - 0.5) * distMult; 
        const destinationY = (Math.random() - 0.5) * distMult;
        const rotation = Math.random() * 360;
        
        // REVERTED SCALE to 1.5 (Normal) or 2.0 (Explosion)
        const finalScale = isExplosion ? 2.0 : 1.5; 

        const animation = star.animate([
            { transform: `translate(0, 0) rotate(0deg) scale(0.5)`, opacity: 1 },
            { transform: `translate(${destinationX}px, ${destinationY}px) rotate(${rotation}deg) scale(${finalScale})`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            fill: 'forwards'
        });
        
        animation.onfinish = () => {
            star.remove();
        };
    }

    // Back to Top Button
    const backToTopButton = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});
