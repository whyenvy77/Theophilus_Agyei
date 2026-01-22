import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Zap,
  Shield,
  Layers,
  Activity,
  Terminal,
  Eye,
  Code,
  Globe,
  BadgeCheck,
  Cpu,
  Target,
  Sparkles,
} from "lucide-react";
import NetworkBackground from "../components/NetworkBackground";
import TacticalButton from "../components/TacticalButton";

/** ---------------- Motion ---------------- */
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (reduce) => ({
    opacity: 1,
    y: 0,
    transition: reduce
      ? { duration: 0.2 }
      : { duration: 0.65, staggerChildren: 0.1, when: "beforeChildren" },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.99 },
  visible: (reduce) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: reduce
      ? { duration: 0.15 }
      : { type: "spring", stiffness: 120, damping: 16 },
  }),
};

const shimmerAnim = {
  initial: { x: "-120%" },
  animate: { x: "120%" },
};

/** ---------------- UI Bits ---------------- */
const TelemetryHUD = ({ label, value, tone = "cyan" }) => (
  <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-black/55 border border-white/10 backdrop-blur-md shadow-[inset_0_0_14px_rgba(0,0,0,0.55)]">
    <div className="flex justify-between items-center text-[8px] font-mono font-black uppercase tracking-widest">
      <span className={tone === "cyan" ? "text-cyan-300" : "text-blue-300"}>{label}</span>
      <span className="text-white/90">{value}</span>
    </div>

    <div className="relative w-full h-[3px] bg-white/5 overflow-hidden rounded-full">
      <motion.div
        initial={shimmerAnim.initial}
        animate={shimmerAnim.animate}
        transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
        className={`absolute top-0 left-0 w-1/2 h-full ${
          tone === "cyan" ? "bg-cyan-400/80" : "bg-blue-400/80"
        } shadow-[0_0_10px_rgba(0,243,255,0.35)]`}
      />
    </div>
  </div>
);

const Pill = ({ icon: Icon, text }) => (
  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-200">
    <Icon size={14} className="text-cyan-300" />
    <span className="text-[10px] font-mono font-black tracking-[0.22em] uppercase">{text}</span>
  </div>
);

const StatCard = ({ label, value, hint }) => (
  <div className="p-6 rounded-2xl bg-cyan-900/15 border border-cyan-500/25 hover:border-cyan-400/60 transition-all hover:bg-cyan-900/20 group/stat">
    <div className="text-[9px] text-cyan-300/80 font-black uppercase mb-2 tracking-[0.25em]">
      {label}
    </div>
    <div className="text-3xl font-black text-white italic tracking-tighter group-hover/stat:text-cyan-300 transition-colors">
      {value}
    </div>
    {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, tag, hudA, hudB }) => (
  <motion.div
    variants={itemVariants}
    custom={false}
    className="relative bg-black/75 border border-cyan-500/20 rounded-3xl p-7 backdrop-blur-2xl overflow-hidden group shadow-[0_0_30px_rgba(0,243,255,0.06)] hover:shadow-[0_0_45px_rgba(0,243,255,0.12)] transition-all duration-700"
  >
    {/* Corner HUD */}
    <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-cyan-500/30 group-hover:border-cyan-400/70 transition-colors opacity-60" />
    <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-cyan-500/30 group-hover:border-cyan-400/70 transition-colors opacity-60" />

    {/* Glow wash */}
    <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-cyan-500/10 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

    <div className="relative z-10">
      <div className="flex items-start justify-between gap-4">
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 group-hover:bg-cyan-500/15 group-hover:border-cyan-400/60 transition-all">
          <Icon size={22} className="text-cyan-300" />
        </div>

        <div className="text-right">
          <div className="text-[8px] font-mono font-black tracking-[0.32em] uppercase text-cyan-300/70">
            {tag}
          </div>
          <div className="text-[11px] font-mono text-white/80 font-bold mt-1">ACTIVE</div>
        </div>
      </div>

      <h4 className="mt-5 text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-cyan-300 transition-colors">
        {title}
      </h4>

      <p className="mt-3 text-gray-300 text-[12px] leading-relaxed">
        {description}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <TelemetryHUD label={hudA.label} value={hudA.value} tone="cyan" />
        <TelemetryHUD label={hudB.label} value={hudB.value} tone="blue" />
      </div>
    </div>
  </motion.div>
);

const TimelineItem = ({ year, title, text }) => (
  <div className="relative pl-6">
    <div className="absolute left-0 top-2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(0,243,255,0.55)]" />
    <div className="absolute left-[5px] top-5 bottom-0 w-px bg-gradient-to-b from-cyan-500/40 to-transparent" />
    <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-cyan-300/70">
      {year}
    </div>
    <div className="text-white font-black tracking-tight">{title}</div>
    <div className="text-gray-300 text-sm leading-relaxed mt-1">{text}</div>
  </div>
);

/** ---------------- Page ---------------- */
export default function About() {
  const reduceMotion = useReducedMotion();

  const START_YEAR = 2022;
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = Math.max(0, currentYear - START_YEAR);

  const highlights = useMemo(
    () => [
      { icon: BadgeCheck, text: "Security-first mindset" },
      { icon: Cpu, text: "Performance + clean code" },
      { icon: Target, text: "Real-world problem solving" },
      { icon: Sparkles, text: "Modern UI/UX" },
    ],
    []
  );

  return (
    <section id="about" className="relative overflow-hidden bg-black/40">
      <NetworkBackground />

      {/* Tactical Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.10)_50%)] bg-[length:100%_4px] z-20 opacity-[0.16]" />

      {/* Ambient glows */}
      <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-56 -left-56 w-[650px] h-[650px] rounded-full bg-blue-500/10 blur-[170px] pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        variants={sectionVariants}
        custom={reduceMotion}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-30"
      >
        {/* Header */}
        <motion.div variants={itemVariants} custom={reduceMotion} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[9px] font-mono text-cyan-300 font-black tracking-[0.34em] uppercase">
              About Me // Profile Verified
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
            The <span className="premium-gradient-text">Architect</span>
            <br />
            Behind the Work
          </h2>

          <p className="mt-5 text-gray-300/90 max-w-3xl mx-auto leading-relaxed">
            I’m <span className="text-white font-semibold">Theophilus Agyei</span> — a security-focused full-stack developer.
            I build fast, modern web apps with solid security practices, clean architecture, and a premium user experience.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            {highlights.map((h) => (
              <Pill key={h.text} icon={h.icon} text={h.text} />
            ))}
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:auto-rows-min">
          {/* Left Big Mission / Intro */}
          <motion.div
            variants={itemVariants}
            custom={reduceMotion}
            className="lg:col-span-8 lg:row-span-2 relative overflow-hidden rounded-[2.25rem] bg-black/75 border border-cyan-500/25 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,243,255,0.08)]"
          >
            {/* Background icon */}
            <div className="absolute -top-10 -right-10 opacity-[0.10] pointer-events-none">
              <Terminal size={260} className="text-cyan-300" />
            </div>

            {/* Top strip */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-cyan-500/15">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <Shield size={16} className="text-cyan-300" />
                </div>
                <div>
                  <div className="text-white font-black tracking-tight">Mission</div>
                  <div className="text-[10px] font-mono tracking-[0.28em] uppercase text-cyan-300/70">
                    Build secure products people love
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <TelemetryHUD label="UPTIME" value="99.9%" tone="cyan" />
                <TelemetryHUD label="LATENCY" value="< 120ms" tone="blue" />
              </div>
            </div>

            <div className="p-7 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                {/* Copy */}
                <div className="space-y-5">
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                    Security + UI, together.
                  </h3>
                  <p className="text-gray-200 leading-relaxed">
                    I don’t treat security as an afterthought. I design systems with safe defaults,
                    clear data flow, and practical protections — while keeping the UI smooth and modern.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {["React", "Next.js", ".NET", "Node", "SQL", "Tailwind", "Kali / OWASP"].map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono font-bold px-3 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/5 text-white/90"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <TacticalButton to="/projects">
                      <Code size={18} className="text-cyan-400" /> View Projects
                    </TacticalButton>
                    <TacticalButton to="/contact">
                      <Globe size={18} className="text-cyan-400" /> Contact Me
                    </TacticalButton>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <StatCard label="Experience" value={`${yearsOfExperience}+ yrs`} hint="Building + learning consistently" />
                  <StatCard label="Focus" value="Security" hint="OWASP mindset in dev" />
                  <StatCard label="Strength" value="Full-Stack" hint="Frontend + backend + APIs" />
                  <StatCard label="Location" value="Accra" hint="Open to remote work" />
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-10 rounded-3xl border border-cyan-500/15 bg-black/55 p-6 md:p-7">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <div className="text-white font-black tracking-tight">Journey</div>
                    <div className="text-[10px] font-mono tracking-[0.28em] uppercase text-cyan-300/70">
                      Progress timeline
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-cyan-200/70 text-xs font-mono">
                    <Activity size={14} className="text-cyan-300" />
                    Building • Securing • Shipping
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <TimelineItem
                    year="2022"
                    title="Started building seriously"
                    text="Focused on fundamentals: web dev, clean code, projects, consistency."
                  />
                  <TimelineItem
                    year="2023"
                    title="Security mindset added"
                    text="Learned OWASP principles + practiced safe design and testing."
                  />
                  <TimelineItem
                    year="2024–Now"
                    title="Professional portfolio"
                    text="Building premium UIs, real apps, and security-focused solutions."
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Tech Stack */}
          <motion.div
            variants={itemVariants}
            custom={reduceMotion}
            className="lg:col-span-4 lg:row-span-3 relative overflow-hidden rounded-[2.25rem] bg-black/75 border border-cyan-500/25 backdrop-blur-2xl shadow-[0_0_45px_rgba(0,243,255,0.05)]"
          >
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 bg-gradient-to-b from-cyan-500/6 to-transparent" />

            <div className="p-8 md:p-9 relative z-10">
              <div className="flex items-center justify-between mb-7">
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">
                  Tech Stack
                </h3>
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                  <Activity size={18} className="text-cyan-300" />
                </div>
              </div>

              {[
                { label: "Front-End", techs: ["React", "Next.js", "Framer", "Tailwind"], status: 98 },
                { label: "Back-End", techs: [".NET", "Node.js", "SQL", "Redis"], status: 94 },
                { label: "Security", techs: ["OWASP", "Kali", "Auth", "Testing"], status: 88 },
                { label: "DevOps", techs: ["Docker", "Vercel", "GitHub Actions"], status: 90 },
              ].map((item, i) => (
                <div key={item.label} className="mb-8 last:mb-0">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-mono text-cyan-300 font-black tracking-widest uppercase">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-mono text-white/90 font-bold">
                      {item.status}%
                    </span>
                  </div>

                  <div className="mt-3 w-full h-[4px] bg-white/5 rounded-full overflow-hidden border border-cyan-500/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.status}%` }}
                      viewport={{ once: true }}
                      transition={reduceMotion ? { duration: 0.1 } : { duration: 1.2, delay: i * 0.1 }}
                      className="h-full bg-cyan-400/70 shadow-[0_0_12px_rgba(0,243,255,0.35)]"
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.techs.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono text-white font-bold px-3 py-1.5 border border-cyan-500/20 bg-cyan-500/5 rounded-full uppercase hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Feature Cards */}
          <div className="lg:col-span-8 lg:row-span-1 grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
            <FeatureCard
              icon={Shield}
              title="Security"
              description="Practical protection: safe auth, validation, secure APIs, and clean system boundaries."
              tag="SECURE"
              hudA={{ label: "Risk", value: "LOW" }}
              hudB={{ label: "Checks", value: "PASS" }}
            />
            <FeatureCard
              icon={Layers}
              title="Full-Stack"
              description="From pixel-perfect UI to backend logic — built to scale and easy to maintain."
              tag="STACK"
              hudA={{ label: "Build", value: "GREEN" }}
              hudB={{ label: "Deploy", value: "READY" }}
            />
            <FeatureCard
              icon={Zap}
              title="Performance"
              description="Fast UX: optimized rendering, clean state, and efficient data flow."
              tag="SPEED"
              hudA={{ label: "FPS", value: "60+" }}
              hudB={{ label: "Load", value: "FAST" }}
            />
          </div>
        </div>

        {/* Final CTA */}
        <motion.div
          variants={itemVariants}
          custom={reduceMotion}
          className="mt-16 flex flex-col items-center gap-8"
        >
          <div className="w-px h-20 bg-gradient-to-b from-transparent to-cyan-500/25" />

          <div className="text-center max-w-2xl">
            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Want to work together?
            </h3>
            <p className="mt-3 text-gray-300/90 leading-relaxed">
              If you need a modern website, a secure web app, or a developer who cares about both security and design —
              I’m ready.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <TacticalButton to={`/preview/${encodeURIComponent("CV.pdf")}`}>
              <Eye size={18} className="text-cyan-400" /> View CV
            </TacticalButton>
            <TacticalButton to="/contact">
              <Terminal size={18} className="text-cyan-400" /> Let’s Talk
            </TacticalButton>
          </div>

          <div className="text-xs text-gray-500 font-mono tracking-widest uppercase">
            Built with care • Designed to impress • Secured by default
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
