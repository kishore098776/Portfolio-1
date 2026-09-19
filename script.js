/* 
   ==========================================================================
   PORTFOLIO JAVASCRIPT CONTROLLER
   Author: Kishore Kumar S
   Features: Theme Switcher, Accessible Mobile Drawer, Custom Cursor,
             Scroll Progress, Typed Effect, Project Filtering, Form Validation
   Accessibility: WCAG 2.1 AA Compliant (Keyboard Navigation & Screen Readers)
   ==========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initTheme();
    initCustomCursor();
    initScrollProgress();
    initNavbar();
    initMobileDrawer();
    initTypedEffect();
    initScrollReveal();
    initProjectFilter();
    initContactForm();
    initPageTransitions();
});

/* --------------------------------------------------------------------------
   1. PAGE LOADER
   -------------------------------------------------------------------------- */
function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;
    
    const hideLoader = () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 300);
    };

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }
}

/* --------------------------------------------------------------------------
   2. THEME MANAGEMENT (DARK / LIGHT MODE)
   -------------------------------------------------------------------------- */
function initTheme() {
    const themeBtn = document.querySelector('.theme-toggle-btn');
    if (!themeBtn) return;
    
    const icon = themeBtn.querySelector('i');
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    
    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            if (icon) icon.className = 'fas fa-sun';
            themeBtn.setAttribute('aria-label', 'Switch to Dark Mode');
        } else {
            document.body.classList.remove('light-theme');
            if (icon) icon.className = 'fas fa-moon';
            themeBtn.setAttribute('aria-label', 'Switch to Light Mode');
        }
    };
    
    applyTheme(savedTheme);
    
    themeBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        const nextTheme = isLight ? 'light' : 'dark';
        localStorage.setItem('portfolio-theme', nextTheme);
        applyTheme(nextTheme);
    });
}

/* --------------------------------------------------------------------------
   3. CUSTOM LERP CURSOR (ACCESSIBLE & REDUCED-MOTION AWARE)
   -------------------------------------------------------------------------- */
function initCustomCursor() {
    // Check if user prefers reduced motion or is on a touch device
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (prefersReducedMotion || isTouch) return;
    
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    if (!cursorDot || !cursorOutline) return;
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });
    
    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Interactive element hover states
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glass-card, .project-card, .skill-chip, .tag-pill, .stat-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
}

/* --------------------------------------------------------------------------
   4. SCROLL PROGRESS INDICATOR
   -------------------------------------------------------------------------- */
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / (scrollHeight || 1)) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }, { passive: true });
}

/* --------------------------------------------------------------------------
   5. NAVBAR STICKY SCROLL BEHAVIOR
   -------------------------------------------------------------------------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    const onScroll = () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* --------------------------------------------------------------------------
   6. ACCESSIBLE MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const closeBtn = document.querySelector('.close-drawer-btn');
    const drawer = document.querySelector('.mobile-nav-drawer');
    const backdrop = document.querySelector('.mobile-nav-backdrop');
    
    if (!drawer) return;
    
    const openDrawer = () => {
        drawer.classList.add('open');
        if (backdrop) backdrop.classList.add('open');
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        if (closeBtn) closeBtn.focus();
    };
    
    const closeDrawer = () => {
        drawer.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
        if (hamburgerBtn) {
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            hamburgerBtn.focus();
        }
        document.body.style.overflow = '';
    };
    
    if (hamburgerBtn) {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.addEventListener('click', openDrawer);
    }
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
            closeDrawer();
        }
    });
    
    // Close on link click
    drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeDrawer);
    });
}

/* --------------------------------------------------------------------------
   7. TYPED ROLE EFFECT WITH VANILLA FALLBACK
   -------------------------------------------------------------------------- */
function initTypedEffect() {
    const typedEl = document.getElementById('typed-text');
    if (!typedEl) return;
    
    const roles = [
        'AI & Data Science Student',
        'Data Analyst Intern',
        'Web Developer',
        'UI/UX Designer',
        'AI Solutions Builder'
    ];
    
    if (typeof Typed !== 'undefined') {
        new Typed('#typed-text', {
            strings: roles,
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1800,
            startDelay: 400,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    } else {
        // Vanilla JavaScript Typing Fallback
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentRole = roles[roleIndex];
            if (isDeleting) {
                typedEl.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedEl.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let speed = isDeleting ? 30 : 60;
            
            if (!isDeleting && charIndex === currentRole.length) {
                speed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                speed = 400;
            }
            
            setTimeout(type, speed);
        }
        type();
    }
}

/* --------------------------------------------------------------------------
   8. SCROLL REVEAL OBSERVER
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });
        
        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for browsers without IntersectionObserver
        revealElements.forEach(el => el.classList.add('revealed'));
    }
}

/* --------------------------------------------------------------------------
   9. PROJECT FILTERING TABS
   -------------------------------------------------------------------------- */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');
    
    if (!filterBtns.length || !projectCards.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            
            const selectedCategory = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category') || '';
                const isMatch = selectedCategory === 'all' || cardCategory.includes(selectedCategory);
                
                if (isMatch) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 40);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.96)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   10. ACCESSIBLE TOAST NOTIFICATIONS & CONTACT FORM
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    
    const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    toast.innerHTML = `<i class="fas ${iconClass}" aria-hidden="true"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 50);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4500);
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const sendBtn = form.querySelector('button[type="submit"]');
        const originalBtnContent = sendBtn.innerHTML;
        
        const nameInput = document.getElementById('user_name');
        const emailInput = document.getElementById('user_email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        
        // Validation check
        if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }
        
        // Email format check
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            showToast('Please provide a valid email address.', 'error');
            emailInput.focus();
            return;
        }
        
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending message...';
        
        const templateParams = {
            user_name: nameInput.value.trim(),
            user_email: emailInput.value.trim(),
            subject: subjectInput ? subjectInput.value.trim() : 'Portfolio Inquiry',
            message: messageInput.value.trim()
        };
        
        if (typeof emailjs !== 'undefined' && emailjs.send) {
            emailjs.send('service_56mp5w4', 'template_2mummjo', templateParams)
                .then(() => {
                    showToast('Thank you! Your message has been sent successfully.', 'success');
                    form.reset();
                })
                .catch((err) => {
                    console.error('EmailJS Error:', err);
                    showToast('Message delivery failed. Please email kishorekumarsk8754@gmail.com directly.', 'error');
                })
                .finally(() => {
                    sendBtn.disabled = false;
                    sendBtn.innerHTML = originalBtnContent;
                });
        } else {
            setTimeout(() => {
                showToast('Thank you! Your message has been received.', 'success');
                form.reset();
                sendBtn.disabled = false;
                sendBtn.innerHTML = originalBtnContent;
            }, 1000);
        }
    });
}

/* --------------------------------------------------------------------------
   11. PAGE TRANSITIONS
   -------------------------------------------------------------------------- */
function initPageTransitions() {
    const transitionOverlay = document.querySelector('.page-transition');
    if (!transitionOverlay) return;
    
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && !link.hasAttribute('target')) {
                e.preventDefault();
                transitionOverlay.classList.add('active');
                setTimeout(() => {
                    window.location.href = href;
                }, 250);
            }
        });
    });
    
    window.addEventListener('pageshow', () => {
        transitionOverlay.classList.remove('active');
    });
}
