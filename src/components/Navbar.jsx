import React, { useEffect, useMemo, useRef, useState, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  Menu,
  X,
  Terminal,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

/**
 * UPGRADED NAVBAR (Cool + Premium + Still Readable)
 * ✅ Glow cursor orb (subtle) on desktop
 * ✅ Scroll progress bar
 * ✅ "Command chip" + LIVE status pill on desktop (clean, not noisy)
 * ✅ Desktop links get a slick active capsule + hover highlight sweep
 * ✅ Mobile menu: full-height sheet with scroll + sticky header + sticky footer buttons
 * ✅ Small screens: never cuts off last item
 *
 * Notes:
 * - Uses only Tailwind + Framer Motion (no extra deps)
 * - If you don't have Tailwind breakpoint "xs", remove "xs:" classes (optional)
 */

const SPRING = { type: "spring", stiffness: 260, damping: 22 };

const sheetVariants = {
  hidden: { opacity: 0, x: 30, scale: 0.98 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { ...SPRING } },
  exit: { opacity: 0, x: 30, scale: 0.98, transition: { duration: 0.18 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 + i * 0.04, duration: 0.22 },
  }),
};

const BrandMark = memo(function BrandMark({ compact }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="absolute -inset-1 rounded-xl bg-cyan-500/20 blur-md" />
        <div className="relative w-11 h-11 rounded-xl border border-cyan-400/40 bg-black/70 backdrop-blur flex items-center justify-center shadow-[0_0_28px_rgba(0,243,255,0.18)]">
          <Terminal className="text-cyan-300" size={20} />
        </div>
      </div>

      <div className="leading-tight">
        <div
          className={`font-black uppercase italic tracking-tight text-white ${
            compact ? "text-lg" : "text-xl"
          }`}
        >
          T.<span className="text-cyan-300">AGYEI</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-cyan-500/20 bg-cyan-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-200/80 tracking-widest font-black">
              SYS_READY
            </span>
          </span>
          <span className="hidden sm:inline text-[10px] font-mono text-white/35">
            SECURITY PORTFOLIO
          </span>
        </div>
      </div>
    </div>
  );
});

function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 22 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[999] origin-left bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300"
    />
  );
}

const StatusPill = memo(function StatusPill() {
  const [i, setI] = useState(0);
  const states = useMemo(
    () => [
      { k: "UPLINK", v: "STABLE", c: "text-green-300" },
      { k: "HARDEN", v: "ACTIVE", c: "text-cyan-200" },
      { k: "OPS", v: "READY", c: "text-yellow-200" },
    ],
    []
  );

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % states.length), 2200);
    return () => clearInterval(t);
  }, [states.length]);

  const s = states[i];

  return (
    <div className="hidden lg:inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-cyan-500/15 bg-black/40 backdrop-blur">
      <ShieldCheck size={16} className="text-cyan-300" />
      <div className="leading-tight">
        <div className="text-[10px] font-mono text-cyan-200/70 tracking-widest font-black uppercase">
          SEC_AUTH
        </div>
        <div className="text-[10px] font-mono text-white/60">
          <span className="text-white">Verified</span> •{" "}
          <span className={`font-black ${s.c}`}>{s.k}:{s.v}</span>
        </div>
      </div>
    </div>
  );
});

function useMouseGlow(enabled) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };

    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [enabled]);

  return { ref, pos };
}

export default function Navbar() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = useMemo(
    () => [
      { name: "Home", path: "/" },
      { name: "Skills", path: "/skills" },
      { name: "Projects", path: "/projects" },
      { name: "Documents", path: "/documents" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
    ],
    []
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const activePath = location.pathname;

  const { ref: navRef, pos } = useMouseGlow(!reduceMotion);

  return (
    <>
      <ScrollBar />

      <nav
        ref={navRef}
        className={[
          "fixed top-0 inset-x-0 z-[998]",
          "transition-all duration-300",
          scrolled
            ? "bg-black/82 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_10px_45px_rgba(0,0,0,0.6)]"
            : "bg-black/55 backdrop-blur-md border-b border-white/10",
        ].join(" ")}
      >
        {/* cursor glow (desktop only vibe) */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          <div
            className="absolute w-[520px] h-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] opacity-30"
            style={{
              left: pos.x,
              top: pos.y,
              background:
                "radial-gradient(circle, rgba(0,243,255,0.18), transparent 60%)",
            }}
          />
        </div>

        {/* subtle top glow */}
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[240px] bg-cyan-500/10 blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link
            to="/"
            className="focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded-xl"
          >
            <BrandMark compact={scrolled} />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <StatusPill />

            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl border border-white/10 bg-black/35 backdrop-blur relative overflow-hidden">
              {/* hover sweep */}
              <motion.div
                aria-hidden="true"
                animate={reduceMotion ? undefined : { x: ["-120%", "140%"] }}
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 6, repeat: Infinity, ease: "linear" }
                }
                className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"
              />

              {links.map((l) => {
                const active = activePath === l.path;
                return (
                  <Link
                    key={l.path}
                    to={l.path}
                    className="relative focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded-xl"
                  >
                    <motion.div
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      transition={SPRING}
                      className={[
                        "px-4 py-2.5 rounded-xl",
                        "text-[11px] font-mono font-black uppercase tracking-[0.22em]",
                        "transition-colors duration-200",
                        active ? "text-white" : "text-white/60 hover:text-white",
                      ].join(" ")}
                    >
                      {active && (
                        <motion.div
                          layoutId="navActive"
                          className="absolute inset-0 rounded-xl bg-cyan-500/12 border border-cyan-400/35 shadow-[0_0_28px_rgba(0,243,255,0.14)]"
                          transition={SPRING}
                        />
                      )}

                      <div
                        className={[
                          "absolute left-3 right-3 -bottom-[2px] h-[2px] rounded-full",
                          active ? "bg-cyan-400/70" : "bg-transparent",
                        ].join(" ")}
                      />

                      <span className="relative z-10">{l.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* neat CTA */}
            <Link
              to="/contact"
              className="hidden lg:inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-cyan-400/25 bg-cyan-500/10 hover:bg-cyan-500/15 hover:border-cyan-300/40 transition focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            >
              <Sparkles size={16} className="text-cyan-200" />
              <span className="text-[11px] font-mono font-black uppercase tracking-[0.22em] text-white/90">
                Hire Me
              </span>
              <ArrowUpRight size={16} className="text-cyan-300/80" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className={[
              "md:hidden inline-flex items-center justify-center",
              "w-11 h-11 rounded-xl border",
              open
                ? "bg-cyan-400 text-black border-cyan-300 shadow-[0_0_30px_rgba(0,243,255,0.35)]"
                : "bg-black/40 text-cyan-200 border-white/10 hover:border-cyan-400/30",
              "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40",
            ].join(" ")}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[997] bg-black/70 backdrop-blur-sm md:hidden"
            />

            <motion.aside
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 z-[998] h-full w-[92%] max-w-[390px] md:hidden"
            >
              <div className="h-full bg-[#05070c]/96 border-l border-cyan-500/20 shadow-[0_0_70px_rgba(0,0,0,0.75)] relative flex flex-col">
                <div className="absolute -top-24 right-0 w-[420px] h-[260px] bg-cyan-500/14 blur-[100px]" />

                {/* Sticky header */}
                <div className="relative p-6 border-b border-white/10 shrink-0 sticky top-0 bg-[#05070c]/96 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <BrandMark compact />
                    <button
                      onClick={() => setOpen(false)}
                      className="w-10 h-10 rounded-xl border border-white/10 bg-black/40 text-white/80 hover:text-white hover:border-cyan-400/30 transition"
                      aria-label="Close menu"
                    >
                      <X className="mx-auto" size={20} />
                    </button>
                  </div>

                  <div className="mt-4 p-4 rounded-2xl border border-cyan-500/15 bg-black/40">
                    <div className="text-[10px] font-mono text-cyan-200/70 tracking-widest uppercase font-black">
                      COMMAND CENTER
                    </div>
                    <div className="mt-1 text-sm text-white/75">
                      Choose a route. Everything is clean & secured.
                    </div>
                  </div>
                </div>

                {/* Scrollable menu */}
                <div
                  className="relative p-4 flex-1 overflow-y-auto"
                  style={{
                    paddingBottom: "calc(5.5rem + env(safe-area-inset-bottom))",
                  }}
                >
                  <nav className="flex flex-col gap-2">
                    {links.map((l, i) => {
                      const active = activePath === l.path;
                      return (
                        <motion.div
                          key={l.path}
                          custom={i}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <Link
                            to={l.path}
                            onClick={() => setOpen(false)}
                            className={[
                              "group flex items-center justify-between",
                              "px-4 py-3 sm:py-4 rounded-2xl border",
                              active
                                ? "border-cyan-400/45 bg-cyan-500/12 text-white shadow-[0_0_25px_rgba(0,243,255,0.10)]"
                                : "border-white/10 bg-black/25 text-white/80 hover:text-white hover:border-cyan-400/25 hover:bg-cyan-500/6",
                              "transition-all duration-200",
                            ].join(" ")}
                          >
                            <div className="flex flex-col">
                              <span className="text-[11px] font-mono font-black uppercase tracking-[0.22em]">
                                {l.name}
                              </span>
                              <span className="text-[11px] text-white/45">
                                {active ? "Current page" : "Open section"}
                              </span>
                            </div>

                            <ChevronRight
                              size={18}
                              className={[
                                "transition-transform duration-200",
                                active ? "text-cyan-300" : "text-white/40 group-hover:text-cyan-300",
                                "group-hover:translate-x-1",
                              ].join(" ")}
                            />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>

                  <div className="mt-6 p-4 rounded-2xl border border-white/10 bg-black/25">
                    <div className="text-[10px] font-mono text-cyan-200/70 tracking-widest uppercase font-black">
                      STATUS
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-white/75 text-sm">Secure Uplink</div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/10">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-[10px] font-mono text-cyan-200/90 tracking-widest font-black uppercase">
                          ACTIVE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky footer CTAs (always visible) */}
                <div
                  className="shrink-0 border-t border-white/10 p-4 bg-[#05070c]/96"
                  style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/projects"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-white/10 bg-black/40 text-white/80 hover:text-white hover:border-cyan-400/25 hover:bg-cyan-500/8 transition"
                    >
                      <span className="text-[11px] font-mono font-black uppercase tracking-[0.22em]">
                        Projects
                      </span>
                      <ChevronRight size={16} className="text-white/40" />
                    </Link>

                    <Link
                      to="/contact"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-cyan-400/25 bg-cyan-500/12 text-white hover:border-cyan-300/40 hover:bg-cyan-500/16 transition shadow-[0_0_25px_rgba(0,243,255,0.10)]"
                    >
                      <span className="text-[11px] font-mono font-black uppercase tracking-[0.22em]">
                        Contact
                      </span>
                      <ArrowUpRight size={16} className="text-cyan-300/90" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Spacer so content doesn't go under fixed navbar */}
      <div className="h-20" />
    </>
  );
}
