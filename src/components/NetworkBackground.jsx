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

    // Respect reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // HiDPI for crisp lines
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Responsive tuning (reduced)
    const isSmallScreen = window.innerWidth < 768;
    const isMediumScreen = window.innerWidth < 1200;

    // ✅ LOWER density + simpler feel
    const particleCount = isSmallScreen ? 18 : isMediumScreen ? 30 : 48; // was 35/65/105
    const connectionDistance = isSmallScreen ? 80 : isMediumScreen ? 110 : 140; // was 95/135/175

    // ✅ Smaller interaction radius
    const mouse = {
      x: null,
      y: null,
      radius: isSmallScreen ? 85 : isMediumScreen ? 120 : 160, // was 110/170/230
    };

    // ✅ Disable click shockwave by default (too much)
    const ENABLE_SHOCKWAVE = false;

    const clickWave = { x: null, y: null, radius: 0, active: false };

    // ✅ Radar: disabled by default (too much)
    const ENABLE_RADAR = false;
    const radar = {
      x: null,
      y: null,
      r: 0,
      active: false,
      speed: 1.0, // slower (was 2.2)
    };

    // ✅ Lower trail intensity (less “busy”)
    const TRAIL_ALPHA = 0.14; // was 0.20

    // ✅ Fewer pulses
    const MAX_PULSES = 4; // was 10
    const PULSE_CHANCE = 0.99985; // was 0.9995 (more frequent). Higher = rarer.

    // ✅ Only animate on desktop for heavy effects
    const ALLOW_HEAVY_EFFECTS = !isSmallScreen && !prefersReducedMotion;

    const resizeCanvas = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        init();
      }, 120);
    };

    window.addEventListener("resize", onResize);
    resizeCanvas();

    const handleMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;

      if (ENABLE_RADAR && ALLOW_HEAVY_EFFECTS) {
        radar.x = mouse.x;
        radar.y = mouse.y;
        radar.active = true;
      }
    };

    const handleTouchMove = (event) => {
      if (event.touches && event.touches[0]) {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;

        if (ENABLE_RADAR && ALLOW_HEAVY_EFFECTS) {
          radar.x = mouse.x;
          radar.y = mouse.y;
          radar.active = true;
        }
      }
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
      radar.active = false;
      radar.r = 0;
    };

    const handleClick = (event) => {
      if (!ENABLE_SHOCKWAVE) return;

      const x = event.touches ? event.touches[0].clientX : event.clientX;
      const y = event.touches ? event.touches[0].clientY : event.clientY;

      clickWave.x = x;
      clickWave.y = y;
      clickWave.radius = 0;
      clickWave.active = true;

      // Very subtle reaction
      particles.forEach((p) => {
        if (Math.random() > 0.9) p.hue = (p.hue + 20) % 360;
      });

      if (ENABLE_RADAR && ALLOW_HEAVY_EFFECTS) {
        radar.x = x;
        radar.y = y;
        radar.active = true;
        radar.r = 0;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchend", handleMouseLeave);
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("touchstart", handleClick, { passive: true });

    class Particle {
      constructor(layer = 1) {
        this.layer = layer;
        this.reset();
      }

      reset() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        this.x = Math.random() * w;
        this.y = Math.random() * h;

        // ✅ Smaller, calmer
        this.size = (Math.random() * 1.3 + 0.9) * this.layer; // was up to 3
        this.speedX = (Math.random() - 0.5) * 0.28 * this.layer; // was 0.7
        this.speedY = (Math.random() - 0.5) * 0.28 * this.layer;

        this.hue = 182 + Math.random() * 18;
        this.opacity = (Math.random() * 0.25 + 0.22) * this.layer; // was 0.3..0.7

        // ✅ Slower pulse
        this.pulseSpeed = 0.006 + Math.random() * 0.01; // was 0.01..0.03
        this.pulseDir = 1;
      }

      update() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        // ✅ Keep gentle motion even if not reduced motion, but slower
        if (!prefersReducedMotion) {
          this.x += this.speedX;
          this.y += this.speedY;
        }

        // ✅ Very subtle hue drift
        this.hue += 0.03; // was 0.08
        if (this.hue > 205) this.hue = 182;

        // ✅ Softer opacity pulse
        this.opacity += this.pulseSpeed * this.pulseDir;
        const maxO = 0.55 * this.layer;
        const minO = 0.18 * this.layer;
        if (this.opacity > maxO || this.opacity < minO) this.pulseDir *= -1;

        // Mouse attraction (reduced force)
        if (mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 0.0001;

          if (distance < mouse.radius * this.layer) {
            const force = (mouse.radius * this.layer - distance) / (mouse.radius * this.layer);
            const attraction = 0.28 * force * this.layer; // was 0.8

            this.speedX += (dx / distance) * attraction;
            this.speedY += (dy / distance) * attraction;

            // damping stronger = calmer
            this.speedX *= 0.88; // was 0.92
            this.speedY *= 0.88;

            // ✅ Reduce swirl a lot
            this.speedX += (dy / distance) * 0.006 * this.layer; // was 0.02
            this.speedY -= (dx / distance) * 0.006 * this.layer;
          }
        }

        // Optional shockwave repulsion (disabled by default)
        if (ENABLE_SHOCKWAVE && clickWave.active) {
          const dx = this.x - clickWave.x;
          const dy = this.y - clickWave.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 0.0001;

          if (Math.abs(distance - clickWave.radius) < 24) {
            const push = 10 * this.layer; // was 18
            this.x += (dx / distance) * push;
            this.y += (dy / distance) * push;
            this.hue += 10;
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
        const glow = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size * 4
        );
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
        this.speed = 0.012 + Math.random() * 0.016; // slower (was 0.02..0.05)
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
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 80%, 0.55)`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 80%, 0.25)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const init = () => {
      particles = [];
      pulses = [];
      for (let i = 0; i < particleCount; i++) {
        const layer = Math.random() > 0.7 ? 1 : 0.5;
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
            // ✅ dimmer lines
            const alpha = (1 - distance / connectionDistance) * 0.18; // was 0.28
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
            ctx.lineWidth = 0.8 * ((particles[i].layer + particles[j].layer) / 2); // slightly thinner
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();

            // ✅ rarer + fewer pulses
            if (!prefersReducedMotion && Math.random() > PULSE_CHANCE && pulses.length < MAX_PULSES) {
              pulses.push(new Pulse(particles[i], particles[j]));
            }
          }
        }
      }
    };

    const drawRadar = () => {
      if (!ENABLE_RADAR || !ALLOW_HEAVY_EFFECTS) return;
      if (!radar.active || radar.x == null) return;

      radar.r += radar.speed;
      if (radar.r > 180) radar.r = 0;

      ctx.beginPath();
      ctx.arc(radar.x, radar.y, radar.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(34, 211, 238, ${0.12 * (1 - radar.r / 180)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(radar.x, radar.y, 18, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(34, 211, 238, 0.14)";
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.fillStyle = `rgba(3, 7, 18, ${TRAIL_ALPHA})`;
      ctx.fillRect(0, 0, w, h);

      // Optional shockwave (off)
      if (ENABLE_SHOCKWAVE && clickWave.active && !prefersReducedMotion) {
        clickWave.radius += 10;
        if (clickWave.radius > w * 1.2) clickWave.active = false;

        ctx.beginPath();
        ctx.arc(clickWave.x, clickWave.y, clickWave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(180, 100%, 70%, ${0.18 * (1 - clickWave.radius / (w * 1.2))})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // ✅ Softer mouse glow
      if (mouse.x !== null && !prefersReducedMotion && !isSmallScreen) {
        const r = 120;
        const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, r);
        mouseGlow.addColorStop(0, "rgba(34, 211, 238, 0.07)");
        mouseGlow.addColorStop(1, "transparent");
        ctx.fillStyle = mouseGlow;
        ctx.fillRect(mouse.x - r, mouse.y - r, r * 2, r * 2);
      }

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

  // ✅ Slightly lower opacity so it feels calmer
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-55"
    />
  );
}
