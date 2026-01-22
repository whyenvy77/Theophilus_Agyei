import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Terminal,
  Activity,
  ShieldAlert,
  Cpu,
  ExternalLink,
  ArrowUpRight,
  Copy,
  Check,
  Sparkles,
  Globe2,
} from "lucide-react";

/** ✅ Update these */
const PROFILE = {
  name: "T. AGYEI",
  version: "v8.2_STABLE",
  role: "Security-Focused Full-Stack Developer",
  location: "Accra, Ghana",
  github: "https://github.com/whyenvy77",
  linkedin: "https://linkedin.com/in/YourProfile",
  email: "theoagyei77@gmail.com",
};

const socialLinks = [
  { href: PROFILE.github, icon: Github, label: "GitHub" },
  { href: PROFILE.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: `mailto:${PROFILE.email}`, icon: Mail, label: "Email" },
];

const navLinks = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Documents", href: "#documents" },
  { label: "Contact", href: "#contact" },
];

/** ---------------- helpers ---------------- */
function nowClock() {
  try {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return new Date().toLocaleTimeString();
  }
}

function useTicker(ms = 1000) {
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function pseudoMetric(seed = 1, divisor = 8000) {
  const t = Math.floor(Date.now() / divisor) + seed * 31;
  const s = Math.sin(t) * 0.5 + 0.5;
  return clamp(s, 0, 1);
}

function shortHash(seed = "X") {
  const t = Math.floor(Date.now() / (1000 * 60)); // changes every minute
  const input = `${seed}::${t}`;
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).toUpperCase().slice(0, 10);
}

/** ---------------- UI bits ---------------- */
function CopyButton({ value, label = "Copy", className = "" }) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border border-cyan-500/18 bg-black/40 text-cyan-200/70 hover:text-white hover:border-cyan-400/55 transition ${className}`}
      aria-label={label}
      title={label}
    >
      {copied ? (
        <Check size={14} className="text-green-400" />
      ) : (
        <Copy size={14} className="text-cyan-300" />
      )}
      <span className="text-[10px] font-mono font-black tracking-[0.22em] uppercase">
        {copied ? "Copied" : label}
      </span>
    </button>
  );
}

function HUDBar({ label, valueText, value01 }) {
  return (
    <div className="rounded-2xl bg-black/55 border border-cyan-500/12 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="text-[9px] font-mono font-black uppercase tracking-[0.26em] text-cyan-200/55">
          {label}
        </div>
        <div className="text-xs font-semibold text-white/90">{valueText}</div>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/5 overflow-hidden border border-cyan-500/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.round(value01 * 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-cyan-400/60"
        />
      </div>
    </div>
  );
}

function SocialIcon({ href, icon: Icon, label }) {
  const isMail = href.startsWith("mailto:");
  return (
    <motion.a
      href={href}
      target={isMail ? "_self" : "_blank"}
      rel="noopener noreferrer"
      aria-label={label}
      className="relative group w-12 h-12 flex items-center justify-center rounded-2xl bg-black/45 border border-cyan-500/18 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all overflow-hidden"
      whileHover={{ y: -4, scale: 1.06 }}
      whileTap={{ scale: 0.98 }}
      title={label}
    >
      {/* shimmer */}
      <motion.div
        initial={{ x: "-140%" }}
        animate={{ x: "140%" }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent opacity-0 group-hover:opacity-100"
      />
      <Icon size={20} className="text-cyan-300 group-hover:text-white transition-colors z-10" />
      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-cyan-500/35 group-hover:border-white/70 transition-colors" />
      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-cyan-500/35 group-hover:border-white/70 transition-colors" />
    </motion.a>
  );
}

/** Terminal (cool + fun but still clean) */
function MissionTerminal() {
  const reduce = useReducedMotion();
  useTicker(1000);

  const load = pseudoMetric(2);
  const uplink = pseudoMetric(5);
  const temp = pseudoMetric(9);
  const key = shortHash("FOOTER");

  const uplinkMs = Math.round(520 + uplink * 260);
  const cpuTemp = Math.round(38 + temp * 18);
  const loadAvg = (0.03 + load * 0.28).toFixed(2);

  const lines = [
    `> agent: THEO_AGYEI :: session ready`,
    `> uplink: ${uplinkMs}ms :: stable`,
    `> loadavg: ${loadAvg} :: threads active`,
    `> cpu temp: ${cpuTemp}°C :: nominal`,
    `> policy: ZERO_TRUST_ENABLED`,
    `> key: ${key} :: rotating`,
  ];

  return (
    <div className="relative group/terminal">
      <div className="absolute -inset-0.5 bg-cyan-500/15 blur opacity-20 group-hover/terminal:opacity-35 transition duration-500" />
      <div className="relative bg-black/75 border border-cyan-500/18 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/12 bg-black/60">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/40" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
              <div className="w-2 h-2 rounded-full bg-green-500/40" />
            </div>
            <span className="text-[9px] font-mono text-cyan-200/60 tracking-[0.22em] uppercase font-black">
              MISSION_LOG
            </span>
          </div>

          <span className="text-[9px] font-mono text-cyan-300/50 tracking-widest">{nowClock()}</span>
        </div>

        <div className="p-4 font-mono text-[11px] text-cyan-200/70 space-y-1.5">
          {lines.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-cyan-400/40">[{String(i + 1).padStart(2, "0")}]</span>
              <span className="text-shadow-glow">{t}</span>
            </div>
          ))}

          {!reduce && (
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block w-2.5 h-4 bg-cyan-400/70 mt-1"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const reduceMotion = useReducedMotion();

  // live-ish values
  const integrity = pseudoMetric(3, 6000); // 0..1
  const uptime = pseudoMetric(7, 9000);
  const stability = pseudoMetric(11, 7000);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden bg-black border-t border-cyan-500/18 pt-20 pb-10"
    >
      {/* subtle grid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(34,211,238,0.75) 1px, transparent 0)",
          backgroundSize: "46px 46px",
        }}
      />

      {/* scanline */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-cyan-500/25 overflow-hidden z-0">
        {!reduceMotion && (
          <div className="w-full h-full bg-[linear-gradient(90deg,transparent,rgba(0,243,255,0.7),transparent)] animate-[scan-horizontal_4s_linear_infinite]" />
        )}
      </div>

      {/* ambient glows */}
      <div className="absolute -top-28 -left-28 w-80 h-80 rounded-full bg-cyan-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-28 -right-28 w-80 h-80 rounded-full bg-blue-600/10 blur-[140px] pointer-events-none" />

      {/* extra fun: faint diagonal noise */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.10] bg-[linear-gradient(115deg,transparent_0%,rgba(34,211,238,0.06)_20%,transparent_40%,rgba(59,130,246,0.05)_60%,transparent_80%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left */}
          <div className="space-y-7">
            {/* Brand */}
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 group cursor-default">
              <div className="w-11 h-11 rounded-2xl border border-cyan-500/18 flex items-center justify-center bg-black/60 group-hover:border-cyan-400/55 relative">
                <Terminal size={20} className="text-cyan-300" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-40" />
              </div>

              <div className="leading-none">
                <h2 className="text-white font-black text-2xl md:text-3xl uppercase italic tracking-tighter">
                  <span className="text-cyan-300">T.</span> AGYEI
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-cyan-200/45 tracking-[0.18em] uppercase">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles size={12} className="text-cyan-300/70" />
                    {PROFILE.version}
                  </span>
                  <span className="opacity-40">•</span>
                  <span>{PROFILE.role}</span>
                  <span className="opacity-40">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Globe2 size={12} className="text-cyan-300/70" />
                    {PROFILE.location}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Mission terminal */}
            <MissionTerminal />

            {/* System bars (cool + professional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HUDBar label="Integrity" valueText={`${Math.round(integrity * 100)}%`} value01={integrity} />
              <HUDBar label="Stability" valueText={`${Math.round(stability * 100)}%`} value01={stability} />
              <HUDBar label="Uptime" valueText={`${Math.round(88 + uptime * 12)}d`} value01={uptime} />
              <div className="rounded-2xl bg-black/55 border border-cyan-500/12 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-[9px] font-mono font-black uppercase tracking-[0.26em] text-cyan-200/55">
                    Contact
                  </div>
                  <div className="text-xs font-semibold text-white/90">Direct</div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <CopyButton value={PROFILE.email} label="Copy Email" />
                  <CopyButton value={PROFILE.github} label="Copy GitHub" />
                </div>
              </div>
            </div>

            {/* Quick GitHub line */}
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-cyan-200/70 hover:text-white transition"
            >
              <Github size={16} className="text-cyan-300" />
              <span className="font-mono tracking-widest text-[11px] uppercase">github.com/whyenvy77</span>
              <ExternalLink size={16} className="opacity-60" />
            </a>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-10 lg:pl-12">
            {/* Navigation */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase border-l-2 border-cyan-500/35 pl-4">
                Navigation
              </h3>

              <nav className="grid grid-cols-2 gap-x-12 gap-y-5">
                {navLinks.map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    className="relative group flex items-center gap-3 text-cyan-200/60 text-[11px] font-mono font-black uppercase tracking-[0.2em] hover:text-cyan-200 transition-all"
                    whileHover={{ x: 6 }}
                  >
                    <span className="w-1 h-3 bg-cyan-500/20 rounded-full group-hover:bg-cyan-200/70 transition-colors shadow-[0_0_8px_rgba(0,243,255,0.35)]" />
                    {item.label}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-70 transition" />
                  </motion.a>
                ))}
              </nav>
            </div>

            {/* Social */}
            <div className="space-y-5">
              <h3 className="text-[10px] font-mono text-cyan-200/45 uppercase tracking-[0.4em] font-black">
                Secure Uplinks
              </h3>

              <div className="flex gap-4">
                {socialLinks.map((link) => (
                  <SocialIcon key={link.label} {...link} />
                ))}
              </div>

              <div className="text-gray-300/60 text-sm leading-relaxed">
                Prefer email?{" "}
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="text-cyan-200/70 hover:text-white underline decoration-cyan-500/30 underline-offset-4"
                >
                  {PROFILE.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-cyan-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-cyan-500/5 rounded-xl border border-cyan-500/12">
            <ShieldAlert size={12} className="text-cyan-300" />
            <span className="text-[9px] font-mono text-cyan-200/55 tracking-[0.28em] uppercase font-black">
              ZERO_TRUST_ENABLED
            </span>
          </div>

          <p className="text-cyan-200/30 text-[10px] font-mono uppercase tracking-[0.26em] text-center">
            © {new Date().getFullYear()} {PROFILE.name} — OPS_READY
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
