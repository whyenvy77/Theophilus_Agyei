import React, { useEffect, useRef } from "react";

export default function NetworkBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        let particles = [];
        let pulses = [];
        const particleCount = 120;
        const connectionDistance = 170;
        const mouse = { x: null, y: null, radius: 250 };
        const clickWave = { x: null, y: null, radius: 0, active: false };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        const handleMouseMove = (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        const handleClick = (event) => {
            clickWave.x = event.clientX;
            clickWave.y = event.clientY;
            clickWave.radius = 0;
            clickWave.active = true;

            // Randomly reset some particles hues on click for "color flash"
            particles.forEach(p => {
                if (Math.random() > 0.7) p.hue = (p.hue + 60) % 360;
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("mousedown", handleClick);

        class Particle {
            constructor(layer = 1) {
                this.layer = layer; // 1 for foreground, 0.5 for background
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = (Math.random() * 2 + 1) * this.layer;
                this.speedX = (Math.random() - 0.5) * 0.7 * this.layer;
                this.speedY = (Math.random() - 0.5) * 0.7 * this.layer;
                this.hue = 180 + Math.random() * 30; // Neon Cyan to Blue
                this.opacity = (Math.random() * 0.4 + 0.3) * this.layer;
                this.pulseSpeed = 0.01 + Math.random() * 0.02;
                this.pulseDir = 1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Color cycle shift
                this.hue += 0.1;
                if (this.hue > 210) this.hue = 180;

                // Opacity pulse
                this.opacity += this.pulseSpeed * this.pulseDir;
                if (this.opacity > 0.8 * this.layer || this.opacity < 0.2 * this.layer) this.pulseDir *= -1;

                // Mouse interaction: Strong Magnetism + Orbital Dampening
                if (mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius * this.layer) {
                        const force = (mouse.radius * this.layer - distance) / (mouse.radius * this.layer);

                        // Stronger acceleration towards mouse
                        const attraction = 0.8 * force * this.layer;
                        this.speedX += (dx / distance) * attraction;
                        this.speedY += (dy / distance) * attraction;

                        // Velocity damping to prevent overshooting
                        this.speedX *= 0.92;
                        this.speedY *= 0.92;

                        // Subtle orbital swirl remains but is less dominant
                        this.speedX += (dy / distance) * 0.02 * this.layer;
                        this.speedY -= (dx / distance) * 0.02 * this.layer;
                    }
                }

                // Click Shockwave repulsion
                if (clickWave.active) {
                    const dx = this.x - clickWave.x;
                    const dy = this.y - clickWave.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (Math.abs(distance - clickWave.radius) < 30) {
                        const push = 20 * this.layer;
                        this.x += (dx / distance) * push;
                        this.y += (dy / distance) * push;
                        this.hue += 30; // Color flash on hit
                    }
                }

                // Boundaries (Wrap-around)
                if (this.x < -50) this.x = canvas.width + 50;
                if (this.x > canvas.width + 50) this.x = -50;
                if (this.y < -50) this.y = canvas.height + 50;
                if (this.y > canvas.height + 50) this.y = -50;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

                const color = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
                const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 5);
                glow.addColorStop(0, color);
                glow.addColorStop(1, "transparent");

                ctx.fillStyle = glow;
                ctx.fill();
            }
        }

        class Pulse {
            constructor(p1, p2) {
                this.p1 = p1;
                this.p2 = p2;
                this.progress = 0;
                this.speed = 0.02 + Math.random() * 0.03;
                this.hue = p1.hue;
            }

            update() {
                this.progress += this.speed;
                return this.progress < 1;
            }

            draw() {
                const x = this.p1.x + (this.p2.x - this.p1.x) * this.progress;
                const y = this.p1.y + (this.p2.y - this.p1.y) * this.progress;

                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 80%, 0.8)`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = `hsla(${this.hue}, 100%, 80%, 0.5)`;
                ctx.fill();
                ctx.shadowBlur = 0; // reset
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                const layer = Math.random() > 0.6 ? 1 : 0.5;
                particles.push(new Particle(layer));
            }
        };

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const alpha = (1 - distance / connectionDistance) * 0.3;
                        ctx.beginPath();
                        const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        grad.addColorStop(0, `hsla(${particles[i].hue}, 70%, 65%, ${alpha})`);
                        grad.addColorStop(1, `hsla(${particles[j].hue}, 70%, 65%, ${alpha})`);

                        ctx.strokeStyle = grad;
                        ctx.lineWidth = 1 * (particles[i].layer + particles[j].layer) / 2;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();

                        // Occasional data pulse spawn along the line
                        if (Math.random() > 0.9995 && pulses.length < 10) {
                            pulses.push(new Pulse(particles[i], particles[j]));
                        }
                    }
                }
            }
        };

        const animate = () => {
            // Motion blur trail
            ctx.fillStyle = "rgba(3, 7, 18, 0.2)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (clickWave.active) {
                clickWave.radius += 15;
                if (clickWave.radius > canvas.width * 1.5) {
                    clickWave.active = false;
                }

                // Visible shockwave ring
                ctx.beginPath();
                ctx.arc(clickWave.x, clickWave.y, clickWave.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `hsla(180, 100%, 70%, ${0.4 * (1 - clickWave.radius / (canvas.width * 1.5))})`;
                ctx.lineWidth = 4;
                ctx.stroke();
            }

            // Interactive Mouse Glow
            if (mouse.x !== null) {
                const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
                mouseGlow.addColorStop(0, "rgba(0, 243, 255, 0.15)");
                mouseGlow.addColorStop(1, "transparent");
                ctx.fillStyle = mouseGlow;
                ctx.fillRect(mouse.x - 150, mouse.y - 150, 300, 300);
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            drawConnections();

            // Handle pulses
            pulses = pulses.filter(p => {
                const active = p.update();
                if (active) p.draw();
                return active;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("mousedown", handleClick);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-70"
        />
    );
}
