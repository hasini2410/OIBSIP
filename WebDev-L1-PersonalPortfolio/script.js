/* ==========================================================================
   HASINI RAPARTHI — TACTILE & SENSORY INTERACTIVITY ENGINE (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Web Audio API Sound Synthesizer
    initAudioSynth();

    // 2. Ambient Canvas Starfield Background
    initParticleCanvas();

    // 3. Auto-Typing Hero Subtitle
    initAutoTyping();

    // 4. 3D Card Mouse Parallax Tilt
    init3DTilt();

    // 5. Number Rollup Counters
    initNumberCounters();

    // 6. Scroll-Reveal Observer
    initScrollReveal();

    // 7. Copy Email Utility
    initCopyEmail();

    // 8. Interactive Python Code Runner
    initPythonDemo();

    // 9. Navigation & ScrollSpy
    initNavigation();

    // 10. Floating Back-to-Top Button
    initFloatingTopBtn();

    // 11. Interactive Chart Visualizer
    initAnalyticsChart();

    // 12. Contact Form Handling
    initContactForm();
});

/* ==========================================================================
   1. WEB AUDIO API SYNTHESIZER (SELF-CONTAINED SOUNDS)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioSynth() {
    const soundBtn = document.getElementById('sound-toggle-btn');

    function playClickSound(freq = 600, type = 'sine', duration = 0.05) {
        if (!soundEnabled) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq / 2, audioCtx.currentTime + duration);

            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.warn('Audio Context disabled');
        }
    }

    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundBtn.classList.toggle('muted', !soundEnabled);
            const icon = soundBtn.querySelector('i');
            if (soundEnabled) {
                icon.className = 'fa-solid fa-volume-high';
                playClickSound(800, 'sine', 0.08);
            } else {
                icon.className = 'fa-solid fa-volume-xmark';
            }
        });
    }

    // Attach click sound triggers to buttons & interactive elements
    document.querySelectorAll('.btn, .ds-btn, .btn-run-code, .s-link, .nav-item').forEach(el => {
        el.addEventListener('click', () => {
            playClickSound(520, 'sine', 0.06);
        });
    });
}

/* ==========================================================================
   2. AMBIENT CANVAS PARTICLES (MOUSE REACTIVE)
   ========================================================================== */
function initParticleCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 20), 60);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.5 + 0.2
        });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    function draw() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.vx + (mouseX - width / 2) * 0.00005;
            p.y += p.vy + (mouseY - height / 2) * 0.00005;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    draw();
}

/* ==========================================================================
   3. AUTO-TYPING HERO SUBTITLE
   ========================================================================== */
function initAutoTyping() {
    const typingSpan = document.getElementById('typing-text');
    if (!typingSpan) return;

    const roles = [
        "B.Com (IT) Specialist",
        "Python Scripting Aspirant",
        "Data Analytics Aspirant",
        "MS Office Automation Expert"
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentRole = roles[roleIdx];

        if (isDeleting) {
            typingSpan.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
            typeSpeed = 40;
        } else {
            typingSpan.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
            typeSpeed = 90;
        }

        if (!isDeleting && charIdx === currentRole.length) {
            typeSpeed = 2200; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/* ==========================================================================
   4. 3D MOUSE PARALLAX TILT
   ========================================================================== */
function init3DTilt() {
    const tiltCards = document.querySelectorAll('[data-tilt-card]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

/* ==========================================================================
   5. NUMBER ROLLUP COUNTERS
   ========================================================================== */
function initNumberCounters() {
    const counterElements = document.querySelectorAll('.count-up');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const targetVal = parseFloat(entry.target.getAttribute('data-target'));
                const isDecimal = entry.target.getAttribute('data-decimal');
                const duration = 1500;
                const startTime = performance.now();

                function updateCount(currentTime) {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    const currentVal = progress * targetVal;

                    if (isDecimal) {
                        entry.target.textContent = currentVal.toFixed(1);
                    } else {
                        entry.target.textContent = Math.floor(currentVal).toLocaleString();
                    }

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        entry.target.textContent = isDecimal ? targetVal.toFixed(1) : targetVal.toLocaleString();
                    }
                }

                requestAnimationFrame(updateCount);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
}

/* ==========================================================================
   6. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   7. COPY EMAIL UTILITY
   ========================================================================== */
function initCopyEmail() {
    const copyBtn = document.getElementById('copy-email-hero-btn');
    const copyTextSpan = document.getElementById('copy-text-span');

    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
        const email = 'raparthihasini@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
            const originalText = copyTextSpan.textContent;
            copyTextSpan.textContent = 'Copied!';
            copyBtn.style.color = '#10b981';

            setTimeout(() => {
                copyTextSpan.textContent = originalText;
                copyBtn.style.color = '';
            }, 2500);
        }).catch(err => {
            console.error('Clipboard copy failed:', err);
        });
    });
}

/* ==========================================================================
   8. PYTHON DEMO RUNNER
   ========================================================================== */
function initPythonDemo() {
    const runBtn = document.getElementById('run-demo-btn');
    const outputBar = document.getElementById('code-output-bar');

    if (!runBtn || !outputBar) return;

    runBtn.addEventListener('click', () => {
        const outText = outputBar.querySelector('.out-text');
        outText.style.color = '#fbbf24';
        outText.textContent = 'Executing Python evaluation script...';

        setTimeout(() => {
            outText.style.color = '#34d399';
            outText.textContent = '"Ready for entry-level IT roles & internships!" (Execution time: 0.02s)';
        }, 500);
    });
}

/* ==========================================================================
   9. NAVIGATION & SCROLLSPY
   ========================================================================== */
function initNavigation() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section, .bento-section');

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                if (id) {
                    navItems.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   10. FLOATING BACK TO TOP BUTTON
   ========================================================================== */
function initFloatingTopBtn() {
    const topBtn = document.getElementById('floating-top-btn');
    if (!topBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
            topBtn.classList.add('visible');
        } else {
            topBtn.classList.remove('visible');
        }
    });

    topBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   11. INTERACTIVE CHART VISUALIZER
   ========================================================================== */
function initAnalyticsChart() {
    const canvas = document.getElementById('analyticsChart');
    const dsBtns = document.querySelectorAll('.ds-btn');

    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');

    const datasets = {
        sales: {
            labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'],
            datasets: [
                {
                    label: 'Revenue Analytics (₹ Lakhs)',
                    data: [12.4, 18.2, 24.5, 31.0, 38.6, 45.2],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                },
                {
                    label: 'Automated Expenses (₹ Lakhs)',
                    data: [6.1, 8.4, 11.2, 12.8, 14.5, 16.0],
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.08)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                }
            ]
        },
        python: {
            labels: ['1K Rows', '5K Rows', '10K Rows', '25K Rows', '50K Rows'],
            datasets: [
                {
                    label: 'Python Processing Speed (ms)',
                    data: [12, 45, 82, 190, 340],
                    borderColor: '#38bdf8',
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                    fill: true,
                    tension: 0.3,
                    borderWidth: 2
                }
            ]
        },
        skills: {
            labels: ['Python', 'MS Excel', 'Data Analytics', 'SQL Basics', 'Web Tech', 'Problem Solving'],
            datasets: [
                {
                    label: 'Proficiency Level (%)',
                    data: [85, 90, 80, 75, 80, 95],
                    borderColor: '#fbbf24',
                    backgroundColor: 'rgba(251, 191, 36, 0.2)',
                    fill: true,
                    tension: 0.2,
                    borderWidth: 2
                }
            ]
        }
    };

    let activeChart = new Chart(ctx, {
        type: 'line',
        data: datasets.sales,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 600,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#94a3b8',
                        font: { family: 'Inter', size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: '#10121a',
                    titleColor: '#ffffff',
                    bodyColor: '#34d399',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#64748b' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#64748b' }
                }
            }
        }
    });

    dsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            dsBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const dsKey = btn.getAttribute('data-dataset');
            if (datasets[dsKey]) {
                activeChart.data = datasets[dsKey];
                activeChart.update();
            }
        });
    });
}

/* ==========================================================================
   12. CONTACT FORM
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('toast-notify');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('form-submit-btn');
        const originalContent = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;

            form.reset();

            if (toast) {
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 4000);
            }
        }, 800);
    });
}
