import React, { useEffect, useRef } from "react";

export default function NetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    let animationFrameId;

    let particles = [];
    let pulses = [];

    // NEW: radar ping (subtle) + target lock
    const radar = {
      x: null,
      y: null,
      r: 0,
      active: false,
      speed: 2.2,
    };

    // NEW: respect reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // HiDPI for crisp lines
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Responsive tuning
    const isSmallScreen = window.innerWidth < 768;
    const isMediumScreen = window.innerWidth < 1200;

    const particleCount = isSmallScreen ? 35 : isMediumScreen ? 65 : 105;
    const connectionDistance = isSmallScreen ? 95 : isMediumScreen ? 135 : 175;

    const mouse = {
      x: null,
      y: null,
      radius: isSmallScreen ? 110 : isMediumScreen ? 170 : 230,
    };

    const clickWave = { x: null, y: null, radius: 0, active: false };

    const resizeCanvas = () => {
      // Fit viewport
      const w = window.innerWidth;
      const h = window.innerHeight;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Small throttle for resize
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        init(); // keep density consistent
      }, 120);
    };

    window.addEventListener("resize", onResize);
    resizeCanvas();

    const handleMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;

      // NEW: radar follows cursor, activates
      radar.x = mouse.x;
      radar.y = mouse.y;
      radar.active = true;
    };

    const handleTouchMove = (event) => {
      if (event.touches && event.touches[0]) {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
        radar.x = mouse.x;
        radar.y = mouse.y;
        radar.active = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
      radar.active = false;
      radar.r = 0;
    };

    const handleClick = (event) => {
      const x = event.touches ? event.touches[0].clientX : event.clientX;
      const y = event.touches ? event.touches[0].clientY : event.clientY;

      clickWave.x = x;
      clickWave.y = y;
      clickWave.radius = 0;
      clickWave.active = true;

      // Make the click feel “reactive”
      particles.forEach((p) => {
        if (Math.random() > 0.7) p.hue = (p.hue + 60) % 360;
      });

      // Also trigger a radar burst
      radar.x = x;
      radar.y = y;
      radar.active = true;
      radar.r = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchend", handleMouseLeave);
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("touchstart", handleClick, { passive: true });

    class Particle {
      constructor(layer = 1) {
        this.layer = layer; // 1 for foreground, 0.5 for background
        this.reset();
      }

      reset() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        this.x = Math.random() * w;
        this.y = Math.random() * h;

        this.size = (Math.random() * 2 + 1) * this.layer;
        this.speedX = (Math.random() - 0.5) * 0.7 * this.layer;
        this.speedY = (Math.random() - 0.5) * 0.7 * this.layer;

        this.hue = 180 + Math.random() * 30; // Neon Cyan → Blue
        this.opacity = (Math.random() * 0.4 + 0.3) * this.layer;

        this.pulseSpeed = 0.01 + Math.random() * 0.02;
        this.pulseDir = 1;
      }

      update() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        if (!prefersReducedMotion) {
          this.x += this.speedX;
          this.y += this.speedY;
        }

        // Color cycle shift
        this.hue += 0.08;
        if (this.hue > 210) this.hue = 180;

        // Opacity pulse
        this.opacity += this.pulseSpeed * this.pulseDir;
        if (this.opacity > 0.8 * this.layer || this.opacity < 0.2 * this.layer) {
          this.pulseDir *= -1;
        }

        // Mouse/Touch interaction (with safe distance check)
        if (mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 0.0001;

          if (distance < mouse.radius * this.layer) {
            const force = (mouse.radius * this.layer - distance) / (mouse.radius * this.layer);
            const attraction = 0.8 * force * this.layer;

            this.speedX += (dx / distance) * attraction;
            this.speedY += (dy / distance) * attraction;

            this.speedX *= 0.92;
            this.speedY *= 0.92;

            // tiny swirl = “cyber fluid”
            this.speedX += (dy / distance) * 0.02 * this.layer;
            this.speedY -= (dx / distance) * 0.02 * this.layer;
          }
        }

        // Shockwave repulsion (safe distance)
        if (clickWave.active) {
          const dx = this.x - clickWave.x;
          const dy = this.y - clickWave.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 0.0001;

          if (Math.abs(distance - clickWave.radius) < 30) {
            const push = 18 * this.layer;
            this.x += (dx / distance) * push;
            this.y += (dy / distance) * push;
            this.hue += 25;
          }
        }

        // Wrap edges
        if (this.x < -50) this.x = w + 50;
        if (this.x > w + 50) this.x = -50;
        if (this.y < -50) this.y = h + 50;
        if (this.y > h + 50) this.y = -50;
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
        if (prefersReducedMotion) return false;
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
        ctx.shadowBlur = 0;
      }
    }

    const init = () => {
      particles = [];
      pulses = [];

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
            const alpha = (1 - distance / connectionDistance) * 0.28;
            ctx.beginPath();

            const grad = ctx.createLinearGradient(
              particles[i].x,
              particles[i].y,
              particles[j].x,
              particles[j].y
            );
            grad.addColorStop(0, `hsla(${particles[i].hue}, 70%, 65%, ${alpha})`);
            grad.addColorStop(1, `hsla(${particles[j].hue}, 70%, 65%, ${alpha})`);

            ctx.strokeStyle = grad;
            ctx.lineWidth = (particles[i].layer + particles[j].layer) / 2;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();

            // Occasional data pulse
            if (!prefersReducedMotion && Math.random() > 0.9995 && pulses.length < 10) {
              pulses.push(new Pulse(particles[i], particles[j]));
            }
          }
        }
      }
    };

    // NEW: Radar ping + “target lock” ring
    const drawRadar = () => {
      if (!radar.active || radar.x == null) return;
      if (prefersReducedMotion) return;

      radar.r += radar.speed;
      if (radar.r > 220) radar.r = 0;

      // Outer expanding ring
      ctx.beginPath();
      ctx.arc(radar.x, radar.y, radar.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(34, 211, 238, ${0.22 * (1 - radar.r / 220)})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner static lock ring
      ctx.beginPath();
      ctx.arc(radar.x, radar.y, 22, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(34, 211, 238, 0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Crosshair lines
      ctx.beginPath();
      ctx.moveTo(radar.x - 28, radar.y);
      ctx.lineTo(radar.x - 16, radar.y);
      ctx.moveTo(radar.x + 16, radar.y);
      ctx.lineTo(radar.x + 28, radar.y);
      ctx.moveTo(radar.x, radar.y - 28);
      ctx.lineTo(radar.x, radar.y - 16);
      ctx.moveTo(radar.x, radar.y + 16);
      ctx.lineTo(radar.x, radar.y + 28);
      ctx.strokeStyle = "rgba(34, 211, 238, 0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Background fade (trail)
      ctx.fillStyle = "rgba(3, 7, 18, 0.20)";
      ctx.fillRect(0, 0, w, h);

      // Click shockwave
      if (clickWave.active && !prefersReducedMotion) {
        clickWave.radius += 14;
        if (clickWave.radius > w * 1.5) clickWave.active = false;

        ctx.beginPath();
        ctx.arc(clickWave.x, clickWave.y, clickWave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(180, 100%, 70%, ${0.35 * (1 - clickWave.radius / (w * 1.5))})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Mouse glow
      if (mouse.x !== null && !prefersReducedMotion) {
        const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
        mouseGlow.addColorStop(0, "rgba(34, 211, 238, 0.12)");
        mouseGlow.addColorStop(1, "transparent");
        ctx.fillStyle = mouseGlow;
        ctx.fillRect(mouse.x - 150, mouse.y - 150, 300, 300);
      }

      // NEW: radar / crosshair
      drawRadar();

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      drawConnections();

      pulses = pulses.filter((p) => {
        const active = p.update();
        if (active) p.draw();
        return active;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchend", handleMouseLeave);
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("touchstart", handleClick);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-70" />;
}
