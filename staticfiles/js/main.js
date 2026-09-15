// ==========================================
// 1. NEON BLUE ANIMATION & CONSTELLATION CURSOR
// ==========================================
(function () {
    let canvas = document.getElementById('bg-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'bg-canvas';
        document.body.prepend(canvas);
    }

    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '1'
    });

    const ctx = canvas.getContext('2d');
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Glowing Neon Cursor
    const cursorRing = document.createElement('div');
    const cursorDot = document.createElement('div');

    Object.assign(cursorDot.style, {
        position: 'fixed',
        width: '6px',
        height: '6px',
        backgroundColor: '#00d2ff',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: '99999',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 10px #00d2ff, 0 0 20px #00d2ff'
    });

    Object.assign(cursorRing.style, {
        position: 'fixed',
        width: '32px',
        height: '32px',
        border: '2px solid #00d2ff',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: '99998',
        transform: 'translate(-50%, -50%)',
        transition: 'transform 0.08s ease-out, width 0.2s, height 0.2s',
        boxShadow: '0 0 15px rgba(0, 210, 255, 0.4)'
    });

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);

    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorRing.style.left = `${e.clientX}px`;
        cursorRing.style.top = `${e.clientY}px`;
    });

    // Particle Constellation Engine
    const particles = [];
    const particleCount = 55;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 210, 255, 0.8)";
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();

            // Inter-Particle Connections
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 210, 255, ${0.35 - dist / 350})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Mouse to Particle Connections
            if (mouse.x !== null && mouse.y !== null) {
                const mdx = particles[i].x - mouse.x;
                const mdy = particles[i].y - mouse.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                if (mdist < mouse.radius) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(0, 210, 255, ${0.6 - mdist / 250})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

// ==========================================
// 2. AUTOMATIC SMOOTH POP-UP ON SCROLL
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const style = document.createElement('style');
    style.innerHTML = `
        .auto-pop {
            opacity: 0 !important;
            transform: scale(0.92) translateY(20px) !important;
            filter: blur(6px) !important;
            transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1) !important;
        }
        .auto-pop.pop-active {
            opacity: 1 !important;
            transform: scale(1) translateY(0) !important;
            filter: blur(0px) !important;
        }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('pop-active');
            } else {
                entry.target.classList.remove('pop-active');
            }
        });
    }, { threshold: 0.1 });

    const targets = document.querySelectorAll('.project-card, .contact-card-section, .resume-card, .contact-direct-info, h1, h2');
    targets.forEach(el => {
        el.classList.add('auto-pop');
        observer.observe(el);
    });
});