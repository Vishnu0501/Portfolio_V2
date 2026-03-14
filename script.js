/* ═══════════════════════════════════════════════
   VISHNU A C — FINAL BOSS PORTFOLIO
   Lenis + GSAP + Aurora + Web3Forms
   ═══════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ━━━ LENIS SMOOTH SCROLL ━━━
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
});

// Connect Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Disable Lenis during preload
lenis.stop();

// ━━━ AURORA CANVAS ━━━
const canvas = document.getElementById('auroraCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const orbs = [
    { x: 0.3, y: 0.3, r: 350, color: 'rgba(108,99,255,', speed: 0.0004, phase: 0 },
    { x: 0.7, y: 0.6, r: 300, color: 'rgba(78,205,196,', speed: 0.0003, phase: 2 },
    { x: 0.5, y: 0.2, r: 280, color: 'rgba(108,99,255,', speed: 0.0005, phase: 4 },
    { x: 0.2, y: 0.8, r: 250, color: 'rgba(78,205,196,', speed: 0.0002, phase: 1 },
];

let auroraTime = 0;
function drawAurora() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    auroraTime++;

    orbs.forEach(orb => {
        const ox = (orb.x + Math.sin(auroraTime * orb.speed + orb.phase) * 0.15) * canvas.width;
        const oy = (orb.y + Math.cos(auroraTime * orb.speed * 0.7 + orb.phase) * 0.1) * canvas.height;

        const gradient = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r);
        gradient.addColorStop(0, orb.color + '0.12)');
        gradient.addColorStop(1, orb.color + '0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    requestAnimationFrame(drawAurora);
}
drawAurora();

// ━━━ PRELOADER ━━━
const preloader = document.getElementById('preloader');
const preloaderBar = document.getElementById('preloaderBar');
const preloaderPercent = document.getElementById('preloaderPercent');
let loadCount = 0;

const loadInterval = setInterval(() => {
    loadCount += Math.floor(Math.random() * 6) + 2;
    if (loadCount >= 100) {
        loadCount = 100;
        clearInterval(loadInterval);
        preloaderBar.style.width = '100%';
        preloaderPercent.textContent = '100%';
        setTimeout(() => {
            preloader.classList.add('done');
            lenis.start();
            setTimeout(() => {
                runHeroAnimation();
                initScrollAnimations();
                ScrollTrigger.refresh();
            }, 200);
        }, 500);
    }
    preloaderBar.style.width = loadCount + '%';
    preloaderPercent.textContent = loadCount + '%';
}, 45);

// ━━━ CURSOR ━━━
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
const cursorLabel = document.getElementById('cursorLabel');
let mx = 0, my = 0, fx = 0, fy = 0;

if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cursor.style.left = mx + 'px';
        cursor.style.top = my + 'px';
    });

    (function followLoop() {
        fx += (mx - fx) * 0.1;
        fy += (my - fy) * 0.1;
        follower.style.left = fx + 'px';
        follower.style.top = fy + 'px';
        requestAnimationFrame(followLoop);
    })();

    // Hover states
    document.querySelectorAll('a, button, .skill-pill, .cc-card, .exp-card, .cert').forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
        el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); cursorLabel.textContent = ''; });
    });

    // Cursor labels for project rows
    document.querySelectorAll('[data-cursor-label]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorLabel.textContent = el.dataset.cursorLabel;
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorLabel.textContent = '';
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
}

// ━━━ HERO ANIMATION ━━━
function runHeroAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.8 })
        .from('.word', {
            y: '110%', opacity: 0, duration: 1.2,
            stagger: 0.07, ease: 'power4.out',
        }, '-=0.4')
        .from('.hero-desc', { y: 24, opacity: 0, duration: 0.8 }, '-=0.5')
        .from('.hero-actions a', { y: 16, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.3')
        .from('.stat', { y: 28, opacity: 0, stagger: 0.1, duration: 0.7 }, '-=0.4')
        .from('.scroll-indicator', { opacity: 0, duration: 0.6 }, '-=0.2')
        .from('.social-sidebar a, .sidebar-line', { y: 20, opacity: 0, stagger: 0.08, duration: 0.5 }, '-=0.4');

    // Counter animation
    document.querySelectorAll('.stat-num[data-count]').forEach(el => {
        const target = parseFloat(el.dataset.count);
        const isDecimal = el.hasAttribute('data-decimal');
        gsap.to(el, {
            textContent: target, duration: 2, ease: 'power2.out',
            snap: isDecimal ? { textContent: 0.1 } : { textContent: 1 },
            onUpdate: function () { if (isDecimal) el.textContent = parseFloat(el.textContent).toFixed(1); },
            scrollTrigger: { trigger: el, start: 'top 90%' }
        });
    });
}

// ━━━ SCROLL ANIMATIONS ━━━
function initScrollAnimations() {
    // Section headers
    gsap.utils.toArray('.sec-header').forEach(h => {
        gsap.from(h.children, {
            x: -30, opacity: 0, duration: 0.8, stagger: 0.08,
            scrollTrigger: { trigger: h, start: 'top 85%' }
        });
    });

    // Bento grid cards
    gsap.from('.bento-heading', {
        y: 40, opacity: 0, duration: 1,
        scrollTrigger: { trigger: '.bento-heading', start: 'top 85%' }
    });

    // Experience header
    gsap.from('.exp-header > div', {
        y: 20, opacity: 0, duration: 0.7, stagger: 0.12,
        scrollTrigger: { trigger: '.exp-header', start: 'top 80%' }
    });

    // Contact hero
    gsap.from('.contact-hero > *', {
        y: 30, opacity: 0, duration: 0.8, stagger: 0.12,
        scrollTrigger: { trigger: '.contact-hero', start: 'top 80%' }
    });

    // Hero parallax
    gsap.to('.hero-inner', {
        y: 100, opacity: 0.2, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 }
    });

    // IntersectionObserver for .reveal-el
    const ro = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                ro.unobserve(e.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    document.querySelectorAll('.reveal-el').forEach((el, i) => {
        el.style.transitionDelay = `${(i % 6) * 0.06}s`;
        ro.observe(el);
    });

    ScrollTrigger.refresh();
}

// ━━━ NAVIGATION ━━━
const nav = document.getElementById('nav');
const navBurger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
const btt = document.getElementById('btt');

window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 60);
    btt.classList.toggle('show', y > 500);
});

// Active link tracking
const sectionEls = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
    let current = '';
    sectionEls.forEach(s => { if (window.scrollY >= s.offsetTop - 250) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === current));
});

// Smooth scroll nav
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, { offset: -80, duration: 1.2 });
        }
        mobileMenu.classList.remove('open');
        navBurger.classList.remove('open');
    });
});

// Burger menu
navBurger.addEventListener('click', () => {
    navBurger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    if (mobileMenu.classList.contains('open')) lenis.stop(); else lenis.start();
});

// Back to top
btt.addEventListener('click', () => lenis.scrollTo(0, { duration: 1.5 }));

// ━━━ EXPERIENCE TRACK DRAG ━━━
const expTrack = document.getElementById('expTrack');
if (expTrack) {
    let dragging = false, startX, scrollL;
    const wrapper = expTrack.closest('.exp-scroll-wrapper');

    // Track drag (existing)
    wrapper.addEventListener('mousedown', e => { dragging = true; startX = e.pageX; scrollL = wrapper.scrollLeft; wrapper.style.cursor = 'grabbing'; });
    wrapper.addEventListener('mouseup', () => { dragging = false; wrapper.style.cursor = 'grab'; });
    wrapper.addEventListener('mouseleave', () => { dragging = false; wrapper.style.cursor = ''; });
    wrapper.addEventListener('mousemove', e => {
        if (!dragging) return; e.preventDefault();
        wrapper.scrollLeft = scrollL - (e.pageX - startX) * 2;
    });
    wrapper.style.cursor = 'grab';

    // ━━━ SLIDER CONTROL ━━━
    const slider = document.querySelector('.exp-slider-track');
    const thumb = document.querySelector('.exp-slider-thumb');
    const fill = document.querySelector('.exp-slider-fill');

    if (slider && thumb && fill) {
        let sliderDrag = false;

        // Update slider position from scroll
        const syncSlider = () => {
            const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
            if (maxScroll <= 0) return;
            const pct = (wrapper.scrollLeft / maxScroll) * 100;
            thumb.style.left = pct + '%';
            fill.style.width = pct + '%';
        };

        // Update scroll from slider position
        const setScrollFromX = (clientX) => {
            const rect = slider.getBoundingClientRect();
            let pct = (clientX - rect.left) / rect.width;
            pct = Math.max(0, Math.min(1, pct));
            const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
            wrapper.scrollLeft = pct * maxScroll;
            syncSlider();
        };

        // Mouse events for slider thumb
        thumb.addEventListener('mousedown', e => {
            e.preventDefault();
            sliderDrag = true;
            thumb.classList.add('dragging');
        });

        document.addEventListener('mousemove', e => {
            if (!sliderDrag) return;
            e.preventDefault();
            setScrollFromX(e.clientX);
        });

        document.addEventListener('mouseup', () => {
            if (sliderDrag) {
                sliderDrag = false;
                thumb.classList.remove('dragging');
            }
        });

        // Click on track to jump
        slider.addEventListener('click', e => {
            if (e.target === thumb || thumb.contains(e.target)) return;
            setScrollFromX(e.clientX);
        });

        // Touch events for slider thumb
        thumb.addEventListener('touchstart', e => {
            sliderDrag = true;
            thumb.classList.add('dragging');
        }, { passive: true });

        document.addEventListener('touchmove', e => {
            if (!sliderDrag) return;
            setScrollFromX(e.touches[0].clientX);
        }, { passive: true });

        document.addEventListener('touchend', () => {
            if (sliderDrag) {
                sliderDrag = false;
                thumb.classList.remove('dragging');
            }
        });

        // Sync slider when scrolling by any method
        wrapper.addEventListener('scroll', syncSlider);
        syncSlider();
    }
}

// ━━━ MAGNETIC BUTTONS ━━━
document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
});

// ━━━ CODE WINDOW TILT ━━━
document.querySelectorAll('.code-window').forEach(cw => {
    cw.addEventListener('mousemove', e => {
        const r = cw.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        cw.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    cw.addEventListener('mouseleave', () => {
        cw.style.transform = '';
        cw.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
    });
    cw.addEventListener('mouseenter', () => { cw.style.transition = 'none'; });
});

// ━━━ CONTACT FORM (Web3Forms) ━━━
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('submitBtn');
        const formData = new FormData(contactForm);

        // Validate
        if (!formData.get('name') || !formData.get('email') || !formData.get('message')) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        // Button loading state
        const origHTML = btn.innerHTML;
        btn.innerHTML = '<span>Sending...</span><i class="fas fa-circle-notch fa-spin" style="margin-left:8px"></i>';
        btn.disabled = true;

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                btn.innerHTML = '<span>Sent!</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
                btn.style.background = 'linear-gradient(135deg, #4ECDC4, #2ECC71)';
                showToast('Message sent successfully! I\'ll get back to you soon. 🎉', 'success');
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            showToast('Failed to send. Try emailing me directly!', 'error');
        }

        setTimeout(() => {
            btn.innerHTML = origHTML;
            btn.style.background = '';
            btn.disabled = false;
        }, 3500);
    });
}

function showToast(msg, type) {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 50);
    setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 500);
    }, 4000);
}