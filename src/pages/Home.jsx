import React, { useEffect, useMemo, useState, memo } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  Download,
  Eye,
  ChevronRight,
  Fingerprint,
  ShieldCheck,
  Terminal,
  ArrowUpRight,
  Radar,
  Sparkles,
  Mail,
} from "lucide-react";

import profilePic from "../assets/profile.jpg";
import TypingText from "../components/TypingText";
import SocialIcons from "../components/SocialIcons";
import NetworkBackground from "../components/NetworkBackground";
import TelemetryHUD from "../components/TelemetryHUD";
import TacticalButton from "../components/TacticalButton";

/** ---------------------------
 *  Helpers
 * -------------------------- */
function shortHash(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36).toUpperCase().slice(0, 4).padEnd(4, "X");
}

function joinUrl(base, path) {
  const b = (base || "/").trim();
  const normalizedBase = b.endsWith("/") ? b : `${b}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 150, damping: 20 } },
};

/** ---------------------------
 *  Top Scroll Progress Bar
 * -------------------------- */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[9999] bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300"
    />
  );
}

/** ---------------------------
 *  Rotating Status Chip
 * -------------------------- */
const StatusChip = memo(function StatusChip() {
  const [idx, setIdx] = useState(0);

  const statuses = useMemo(
    () => [
      { label: "UPLINK", value: "STABLE", tone: "text-green-400" },
      { label: "HARDENING", value: "ACTIVE", tone: "text-cyan-300" },
      { label: "SCAN", value: "PASSIVE", tone: "text-blue-300" },
      { label: "OPS", value: "READY", tone: "text-yellow-300" },
    ],
    []
  );

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % statuses.length), 2500);
    return () => clearInterval(t);
  }, [statuses.length]);

  const s = statuses[idx];

  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-cyan-500/20 bg-black/40 backdrop-blur-md">
      <Radar size={14} className="text-cyan-400" />
      <span className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest font-black">
        {s.label}:
      </span>
      <span className={`text-[10px] font-mono uppercase tracking-widest font-black ${s.tone}`}>
        {s.value}
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
    </div>
  );
});

/** ---------------------------
 *  Magnetic Tilt Wrapper
 * -------------------------- */
function MagneticTilt({ children, className = "" }) {
  const reduceMotion = useReducedMotion();
  const [style, setStyle] = useState({
    transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)",
  });

  function onMove(e) {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rY = (px - 0.5) * 10;
    const rX = (0.5 - py) * 10;
    setStyle({
      transform: `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-2px)`,
    });
  }

  function onLeave() {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)",
    });
  }

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
      className={`transition-transform duration-300 will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

/** ---------------------------
 *  Ambient Rings
 * -------------------------- */
function AmbientRings() {
  const rings = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        size: 160 + i * 70,
        top: `${10 + (i * 9) % 60}%`,
        left: `${5 + (i * 13) % 70}%`,
        delay: i * 0.6,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {rings.map((r) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0.08, scale: 0.9 }}
          animate={{ opacity: [0.06, 0.12, 0.06], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 8, repeat: Infinity, delay: r.delay, ease: "easeInOut" }}
          className="absolute rounded-full border border-cyan-500/10 bg-cyan-500/5"
          style={{ width: r.size, height: r.size, top: r.top, left: r.left, filter: "blur(0.5px)" }}
        />
      ))}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-cyan-600/10 blur-[200px] rounded-full" />
    </div>
  );
}

/** ---------------------------
 *  Mini HUD: Operational Log
 * -------------------------- */
const OperationalLog = memo(function OperationalLog() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="hidden lg:flex flex-col gap-2 font-mono text-[9px] text-cyan-500/50 p-4 border border-cyan-500/10 bg-black/40 backdrop-blur-md rounded-xl max-w-[220px]">
      <div className="flex items-center gap-2 text-cyan-400 border-b border-cyan-500/20 pb-2 mb-1">
        <Terminal size={12} /> PROFILE
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FULL NAME</span>
          <span className="text-green-500">KWAKU THEO</span>
        </div>
        <div className="flex justify-between">
          <span>AGE</span>
          <span>0x19</span>
        </div>
        <div className="flex justify-between">
          <span>COUNTRY</span>
          <span className="animate-pulse">GHANA</span>
        </div>
        <div className="flex justify-between">
          <span>THREAT_LVL</span>
          <span>LOW</span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-cyan-500/20 text-[8px] opacity-40">
        LAST_SYNC: {now.toLocaleTimeString()}
      </div>
    </div>
  );
});

/** ---------------------------
 *  Credential Card
 * -------------------------- */
const CompactCredentialCard = memo(function CompactCredentialCard({ title, type, icon: Icon, filename }) {
  const reduceMotion = useReducedMotion();

  const encoded = useMemo(() => encodeURIComponent(filename), [filename]);
  const fileSerial = useMemo(() => `SEC-${shortHash(filename)}-X`, [filename]);

  const base = useMemo(() => import.meta.env.BASE_URL || "/", []);
  const downloadUrl = useMemo(() => joinUrl(base, `documents/${encoded}`), [base, encoded]);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      className="group relative flex flex-col p-6 rounded-3xl border border-cyan-500/10 bg-black/60 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-500 focus-within:border-cyan-500/40"
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" />
      </div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/10 group-hover:bg-cyan-500/10 group-hover:scale-110 transition-all duration-500">
          <Icon className="w-6 h-6 text-cyan-400" aria-hidden="true" />
        </div>
        <div className="text-[8px] font-mono text-cyan-400/40 tracking-widest uppercase">
          {fileSerial}
        </div>
      </div>

      <h3 className="text-lg font-black text-white mb-1 uppercase tracking-tighter truncate relative z-10" title={title}>
        {title}
      </h3>
      <p className="text-[10px] font-mono text-cyan-400/60 uppercase mb-6 relative z-10">{type}</p>

      <div className="mt-auto flex gap-2 relative z-10">
        <TacticalButton to={`/preview/${encoded}`} size="sm" containerClassName="flex-1">
          <Eye size={12} aria-hidden="true" /> PREVIEW
        </TacticalButton>

        <a href={downloadUrl} download={filename} className="flex-shrink-0" aria-label={`Download ${title}`}>
          <TacticalButton size="sm" containerClassName="w-full" isLink={false}>
            <Download size={12} aria-hidden="true" />
          </TacticalButton>
        </a>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 group-focus-within:ring-2 group-focus-within:ring-cyan-500/40 transition" />
    </motion.div>
  );
});

export default function Home() {
  const reduceMotion = useReducedMotion();

  const featuredCerts = useMemo(
    () => [
      { title: "Executive CV", type: "PDF / Resume", icon: FileText, filename: "CV.pdf" },
    ],
    []
  );

  const base = useMemo(() => import.meta.env.BASE_URL || "/", []);
  const cvDownloadUrl = useMemo(() => joinUrl(base, `documents/${encodeURIComponent("CV.pdf")}`), [base]);

  return (
    // ✅ Key: overflow-x-clip prevents “1px overflow” from any glow/transform
    <div className="bg-gray-950 overflow-x-clip">
      <ScrollProgressBar />

      <section
        id="home"
        // ✅ Better for fixed navbar: pt matches your navbar height + breathing room
        className="relative min-h-screen flex flex-col items-center justify-center pt-28 sm:pt-32 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <NetworkBackground />
        <AmbientRings />

        <div className="absolute top-24 right-10 hidden xl:flex flex-col gap-4 z-20">
          <OperationalLog />
          <div className="flex flex-col gap-2 opacity-30 pointer-events-none">
            <div className="flex items-center gap-3 text-[10px] font-mono text-cyan-400 font-black">
              <div className="w-2 h-2 bg-cyan-500 animate-pulse rounded-full" />
              CMD_INTERFACE: ACTIVE
            </div>
            <div className="text-[8px] font-mono text-gray-400 border-l border-cyan-500/30 pl-3">
              SECURE_UPLINK: 0x82.11.4A
              <br />
              LOC: 5.60/0.18
              <br />
              BUFFER: OPTIMAL
            </div>
          </div>
        </div>

        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-cyan-600/10 blur-[180px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

        {/* ✅ Important: min-w-0 so children can shrink and wrap instead of overflowing */}
        <div className="max-w-7xl mx-auto w-full z-10 relative min-w-0">
          <div className="flex flex-col md:flex-row items-center justify-between w-full min-w-0">
            {/* LEFT */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex-1 text-center md:text-left md:pr-12 min-w-0"
            >
              <motion.p variants={itemVariants} className="section-subtitle !text-cyan-400">
                SYSTEM_OVERRIDE: Theophilus Agyei
              </motion.p>

              <motion.div variants={itemVariants} className="mt-4 flex justify-center md:justify-start">
                <StatusChip />
              </motion.div>

              {/* ✅ Responsive title that never breaks layout */}
              <motion.h1
                variants={itemVariants}
                className={[
                  "mt-4 mb-5 font-black text-white uppercase italic tracking-tight",
                  "leading-[0.92] sm:leading-[0.88]",
                  "text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl",
                  "break-words",
                ].join(" ")}
              >
                I Deploy{" "}
                <span className="premium-gradient-text relative inline-block">
                  <motion.span
                    animate={reduceMotion ? undefined : { x: [-1, 1, -1, 0], opacity: [1, 0.7, 1] }}
                    transition={reduceMotion ? undefined : { repeat: Infinity, duration: 0.15, repeatDelay: 4 }}
                    className="absolute inset-0 text-cyan-400 blur-[2px] -z-10"
                  >
                    Secure
                  </motion.span>
                  Secure
                </span>{" "}
                <br className="hidden sm:block" /> Digital Assets
              </motion.h1>

              {/* ✅ Make this row wrap safely on small screens */}
              <motion.div
                variants={itemVariants}
                className="mb-10 font-mono text-[10px] text-cyan-500/40 uppercase font-black flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4"
              >
                <span className="flex items-center gap-2 tracking-[0.22em] sm:tracking-[0.35em]">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-sm animate-ping" />
                  STREAMING_CREDENTIALS:
                </span>

                <div className="flex flex-wrap gap-2 text-white/40 justify-center md:justify-start">
                  <span className="animate-[pulse_1s_infinite] tracking-[0.18em]">#AES-256</span>
                  <span className="animate-[pulse_1.5s_infinite] tracking-[0.18em]">#ZERO_TRUST</span>
                  <span className="animate-[pulse_1.2s_infinite] tracking-[0.18em]">#SSL_TLS</span>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="text-cyan-400/80 text-lg sm:text-xl lg:text-2xl mb-12 max-w-xl mx-auto md:mx-0 font-mono leading-relaxed uppercase tracking-tight"
              >
                <TypingText
                  texts={[
                    "Ethical Hacker 🔐",
                    "Full-Stack Security Dev 💻",
                    "System Architect 🖥️",
                    "Node • React • .NET • Kali Linux 🚀",
                  ]}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-center md:justify-start gap-4 sm:gap-6 flex-wrap">
                <TacticalButton to="/projects">
                  <span className="text-[10px] opacity-40">{"["}0x1{"]"}</span> VIEW PROJECTS
                </TacticalButton>

                <TacticalButton to="/contact">
                  <span className="text-[10px] opacity-40">{"["}0x2{"]"}</span> GET IN TOUCH 📤
                </TacticalButton>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <a
                  href={cvDownloadUrl}
                  download="CV.pdf"
                  className="group inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-cyan-500/15 bg-black/40 backdrop-blur-md hover:border-cyan-500/40 transition"
                >
                  <Sparkles size={16} className="text-cyan-300 group-hover:scale-110 transition" />
                  <span className="text-[10px] font-mono text-cyan-100/80 uppercase tracking-widest font-black">
                    Download_CV
                  </span>
                  <ArrowUpRight size={16} className="text-cyan-400/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </a>

                <Link
                  to="/documents"
                  className="group inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-cyan-500/15 bg-black/40 backdrop-blur-md hover:border-cyan-500/40 transition"
                >
                  <FileText size={16} className="text-cyan-300 group-hover:scale-110 transition" />
                  <span className="text-[10px] font-mono text-cyan-100/80 uppercase tracking-widest font-black">
                    Open_Vault
                  </span>
                  <ArrowUpRight size={16} className="text-cyan-400/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </Link>

                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-cyan-500/15 bg-black/40 backdrop-blur-md hover:border-cyan-500/40 transition"
                >
                  <Mail size={16} className="text-cyan-300 group-hover:scale-110 transition" />
                  <span className="text-[10px] font-mono text-cyan-100/80 uppercase tracking-widest font-black">
                    Ping_Me
                  </span>
                  <ArrowUpRight size={16} className="text-cyan-400/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-14 sm:mt-16 flex justify-center md:justify-start">
                <SocialIcons />
              </motion.div>
            </motion.div>

            {/* RIGHT (Image) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 mt-14 sm:mt-20 md:mt-0 flex justify-center md:justify-end relative group min-w-0"
            >
              <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full group-hover:bg-cyan-500/30 transition-all duration-700 scale-125 translate-y-4 pointer-events-none" />

              <MagneticTilt className="relative z-10">
                <motion.div
                  animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
                  transition={reduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="relative p-2 rounded-full border border-cyan-500/20 bg-black backdrop-blur-md shadow-2xl shadow-cyan-900/20 ring-1 ring-cyan-500/10">
                    <div className="absolute top-1/4 -right-12 z-30 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 group-hover:translate-x-0 hidden lg:block">
                      <TelemetryHUD label="THREAT_MITIGATION" value="99.8%" color="blue" className="w-40" />
                    </div>
                    <div className="absolute bottom-1/4 -left-20 z-30 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-4 group-hover:translate-x-0 hidden lg:block">
                      <TelemetryHUD label="SYSTEM_HARDENING" value="v9.4" color="cyan" className="w-40" />
                    </div>

                    {/* ✅ Image sizing that never forces overflow */}
                    <img
                      src={profilePic}
                      alt="Theophilus Agyei"
                      loading="lazy"
                      decoding="async"
                      className={[
                        "rounded-full border border-cyan-500/30 object-cover grayscale brightness-75",
                        "group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 relative z-10",
                        "w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px]",
                        "max-w-full",
                      ].join(" ")}
                    />

                    <div className="absolute -inset-4 border border-dashed border-cyan-500/10 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none" />
                  </div>
                </motion.div>
              </MagneticTilt>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Verified Credentials */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 z-30 overflow-x-clip">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 sm:mb-16 flex flex-col md:flex-row items-end justify-between gap-6"
          >
            <div className="max-w-xl">
              <p className="section-subtitle !mb-2 flex items-center gap-2">
                <ShieldCheck size={14} className="text-cyan-400" aria-hidden="true" /> AUTHORIZED_ASSETS
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                Verified <span className="premium-gradient-text">Credentials</span>
              </h2>
            </div>

            <Link
              to="/documents"
              className="text-cyan-400 font-mono text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 hover:text-white transition-colors group focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded-lg px-2 py-2"
            >
              Enter_Secure_Vault{" "}
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCerts.map((cert, i) => (
              <CompactCredentialCard key={`${cert.filename}-${i}`} {...cert} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-14 sm:mt-20 p-6 sm:p-8 rounded-[2rem] border border-cyan-500/10 bg-black/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-8"
          >
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[8px] font-mono text-cyan-500/40 uppercase tracking-widest font-black">
                  LAST_DEPLOYMENT
                </span>
                <span className="text-white font-mono text-sm font-black uppercase tracking-tight">
                  PROJECT_ALPHA // JAN_2026
                </span>
              </div>
              <div className="w-[1px] h-10 bg-cyan-500/20 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-[8px] font-mono text-cyan-500/40 uppercase tracking-widest font-black">
                  AVAILABILITY
                </span>
                <span className="text-green-500 font-mono text-sm font-black uppercase tracking-tight">
                  READY_FOR_ENGAGEMENT
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center text-[10px] font-mono text-cyan-400"
                  >
                    <Fingerprint size={14} />
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-black uppercase tracking-widest leading-none">
                SECURITY_VETTED
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
