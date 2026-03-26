/* FORSA Design 1 — Immersive Industry Interactions */
document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        let current = '';
        sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
        navLinks.forEach(l => { l.classList.toggle('active', l.getAttribute('href') === `#${current}`); });
    }, { passive: true });

    // Mobile menu
    const navToggle = document.getElementById('navToggle');
    const navLinksEl = document.getElementById('navLinks');
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksEl.classList.toggle('open');
        document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
    });
    navLinksEl.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
        navToggle.classList.remove('active'); navLinksEl.classList.remove('open'); document.body.style.overflow = '';
    }));

    // Scroll animations
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const d = parseInt(e.target.dataset.delay) || 0;
                setTimeout(() => e.target.classList.add('visible'), d);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-animate]').forEach(el => obs.observe(el));

    // Counter animations
    function animateCounter(el) {
        const target = parseInt(el.dataset.count), duration = 2000, start = performance.now();
        function step(now) {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    const cObs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cObs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(el => cObs.observe(el));

    // Stat ring progress animation
    const ringObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const percent = parseInt(e.target.dataset.percent);
                const circumference = 327; // 2 * PI * 52
                const offset = circumference - (circumference * percent / 100);
                e.target.style.strokeDashoffset = offset;
                ringObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-progress').forEach(el => ringObs.observe(el));

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const t = document.querySelector(a.getAttribute('href'));
            if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        });
    });

    // Video overlay play
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            const overlay = playBtn.closest('.video-overlay');
            const iframe = overlay.previousElementSibling;
            const src = iframe.getAttribute('src');
            iframe.setAttribute('src', src.replace('autoplay=0', 'autoplay=1'));
            overlay.classList.add('hidden');
        });
    }

    // Service card tilt on hover
    document.querySelectorAll('.svc-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-6px) perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Form submission — sends to mailer.php
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;

        btn.innerHTML = '<span>Enviando...</span><i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        const data = new FormData();
        data.append('nombre',   document.getElementById('name').value);
        data.append('empresa',  document.getElementById('company').value);
        data.append('email',    document.getElementById('email').value);
        data.append('telefono', document.getElementById('phone').value);
        data.append('servicio', document.getElementById('service').value);
        data.append('mensaje',  document.getElementById('message').value);

        try {
            const res  = await fetch('mailer.php', { method: 'POST', body: data });
            const json = await res.json();

            if (json.success) {
                btn.innerHTML = '<span>¡Enviado!</span><i class="fas fa-check"></i>';
                btn.style.background = '#009DD9';
                btn.style.color = '#fff';
                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.disabled = false;
                    form.reset();
                }, 3000);
            } else {
                btn.innerHTML = '<span>Error. Intente de nuevo.</span><i class="fas fa-times"></i>';
                btn.style.background = '#e53e3e';
                btn.style.color = '#fff';
                setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.style.color = ''; btn.disabled = false; }, 3000);
            }
        } catch (err) {
            btn.innerHTML = '<span>Error de conexión.</span><i class="fas fa-times"></i>';
            btn.style.background = '#e53e3e';
            btn.style.color = '#fff';
            setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.style.color = ''; btn.disabled = false; }, 3000);
        }
    });

    // Parallax hero elements
    const heroLeft = document.querySelector('.hero-left');
    const heroRight = document.querySelector('.hero-right');
    window.addEventListener('scroll', () => {
        const s = window.scrollY;
        if (s < window.innerHeight && heroLeft && heroRight) {
            heroLeft.style.transform = `translateY(${s * 0.15}px)`;
            heroRight.style.transform = `translateY(${s * 0.08}px)`;
        }
    }, { passive: true });

    // Team Collage Mobile Arrow Controls
    const collageGrid = document.querySelector('.collage-grid');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    
    if (collageGrid && prevArrow && nextArrow) {
        prevArrow.addEventListener('click', () => {
            // Scroll by approximately the width of one image + gap
            collageGrid.scrollBy({ left: -260, behavior: 'smooth' });
        });
        nextArrow.addEventListener('click', () => {
            collageGrid.scrollBy({ left: 260, behavior: 'smooth' });
        });
    }
});
