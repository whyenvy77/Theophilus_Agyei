import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FileText,
  Download,
  Eye,
  Activity,
  Fingerprint,
  Shield,
  Copy,
  Check,
  Briefcase,
  Link2,
  Sparkles,
  ScanLine,
} from "lucide-react";

import NetworkBackground from "../components/NetworkBackground";
import TelemetryHUD from "../components/TelemetryHUD";
import TacticalButton from "../components/TacticalButton";

/** ---------------- Motion ---------------- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: (reduce) => ({
    opacity: 1,
    transition: reduce ? { duration: 0.2 } : { staggerChildren: 0.1, delayChildren: 0.12 },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (reduce) => ({
    opacity: 1,
    y: 0,
    transition: reduce ? { duration: 0.15 } : { type: "spring", stiffness: 120, damping: 18 },
  }),
};

/** ---------------- Helpers ---------------- */
function baseUrlNormalized() {
  const base = import.meta.env.BASE_URL || "/";
  return base.endsWith("/") ? base : `${base}/`;
}

function hourBucketId(seed = "") {
  const hourBucket = Math.floor(Date.now() / (1000 * 60 * 60));
  const input = `${seed}::${hourBucket}`;
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).toUpperCase().slice(0, 10);
}

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let val = bytes;
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024;
    i++;
  }
  return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** ---------------- UI: Copy Chip ---------------- */
const CopyChip = ({ textToCopy, label = "Copy", icon = Copy, className = "" }) => {
  const Icon = icon;
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border border-cyan-500/18 bg-black/35 text-cyan-200/75 hover:text-white hover:border-cyan-400/55 transition ${className}`}
      aria-label="Copy"
    >
      {copied ? (
        <Check size={14} className="text-green-400" />
      ) : (
        <Icon size={14} className="text-cyan-300" />
      )}
      <span className="text-[10px] font-mono font-black tracking-[0.22em] uppercase">
        {copied ? "Copied" : label}
      </span>
    </button>
  );
};

/** ---------------- Card ---------------- */
const DocumentCard = ({ title, type, date, icon: Icon, filename, note, badge = "Verified" }) => {
  const reduceMotion = useReducedMotion();

  const base = useMemo(() => baseUrlNormalized(), []);
  const encoded = useMemo(() => encodeURIComponent(filename), [filename]);

  const fileSerial = useMemo(() => {
    const id = hourBucketId(`${filename}|${title}`);
    return `DOC-${id.slice(0, 4)}-${id.slice(4, 8)}`;
  }, [filename, title]);

  const downloadUrl = useMemo(() => `${base}documents/${encoded}`, [base, encoded]);
  const previewUrl = useMemo(() => `/preview/${encoded}`, [encoded]);

  const [fileSize, setFileSize] = useState(null);
  const [sizeLoaded, setSizeLoaded] = useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(downloadUrl, { method: "HEAD" });
        const len = res.headers.get("content-length");
        if (mounted && len) setFileSize(Number(len));
      } catch {
        // ignore
      } finally {
        if (mounted) setSizeLoaded(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [downloadUrl]);

  return (
    <motion.div
      variants={itemVariants}
      custom={reduceMotion}
      className="group relative overflow-hidden rounded-[2.2rem] border border-cyan-500/12 bg-black/45 backdrop-blur-xl
                 hover:border-cyan-400/45 transition-all duration-700
                 shadow-[0_0_42px_rgba(0,243,255,0.06)] hover:shadow-[0_0_70px_rgba(0,243,255,0.13)]"
    >
      {/* Top highlight + hover scan */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-cyan-400/18" />
      <motion.div
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={reduceMotion ? { duration: 0 } : { duration: 4.2, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 h-[1px] w-1/3 bg-gradient-to-r from-transparent via-cyan-400/55 to-transparent opacity-0 group-hover:opacity-100"
      />

      {/* Soft inner gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/6 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Corner lines */}
      <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-cyan-500/18 group-hover:border-cyan-400/45 transition-colors opacity-60" />
      <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-cyan-500/18 group-hover:border-cyan-400/45 transition-colors opacity-60" />

      {/* Ambient glow */}
      <div className="absolute -top-28 -right-28 w-80 h-80 rounded-full bg-cyan-500/10 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="p-8 md:p-10 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-6 mb-7">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative p-4 bg-cyan-500/8 rounded-2xl border border-cyan-500/15 group-hover:bg-cyan-500/12 group-hover:border-cyan-400/45 transition-all duration-500">
              <Icon className="w-8 h-8 text-cyan-300" />
              {/* tiny “status dot” */}
              <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-cyan-300/80 shadow-[0_0_12px_rgba(0,243,255,0.6)]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[9px] font-mono tracking-[0.22em] uppercase text-cyan-200/65">
                <Fingerprint size={14} className="text-cyan-300/45" />
                <span className="truncate">{fileSerial}</span>
                <span className="hidden sm:inline-block text-cyan-200/35">•</span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-cyan-500/15 bg-black/35 px-2 py-1 text-[9px] font-mono tracking-[0.22em] uppercase text-cyan-200/70">
                  <Shield size={12} className="text-cyan-300/70" />
                  {badge}
                </span>
              </div>

              <h3 className="mt-2 text-2xl md:text-3xl font-black text-white leading-tight tracking-tight truncate">
                {title}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-black text-white/90 uppercase tracking-[0.18em] bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/18">
                  {type}
                </span>
                {date ? (
                  <span className="text-[10px] font-mono text-cyan-200/55 uppercase tracking-[0.18em]">
                    {date}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Copy actions */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <CopyChip textToCopy={downloadUrl} label="Copy Link" icon={Link2} />
            <CopyChip textToCopy={filename} label="Copy Name" />
          </div>
        </div>

        {/* HUD */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <TelemetryHUD label="INTEGRITY" value="100%" color="cyan" />
          <TelemetryHUD label="ACCESS" value="PUBLIC" color="blue" />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="text-xs text-gray-300/80">
            <span className="text-cyan-200/60 font-mono uppercase tracking-widest text-[10px]">
              File
            </span>
            <div className="mt-1 text-white/90 font-semibold">{filename}</div>
          </div>

          <div className="text-xs text-gray-300/80 text-right">
            <span className="text-cyan-200/60 font-mono uppercase tracking-widest text-[10px]">
              Size
            </span>
            <div className="mt-1 text-white/90 font-semibold">
              {sizeLoaded ? formatFileSize(fileSize) : "Loading…"}
            </div>
          </div>
        </div>

        {note ? (
          <div className="mb-7 rounded-2xl border border-cyan-500/10 bg-black/40 p-4">
            <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-cyan-200/55">
              Summary
            </div>
            <div className="mt-1 text-sm text-gray-200/90 leading-relaxed">{note}</div>
          </div>
        ) : null}

        {/* Actions */}
        <div className="pt-1 flex flex-col sm:flex-row gap-4">
          <TacticalButton to={previewUrl} size="sm" containerClassName="flex-1">
            <Eye size={16} className="text-cyan-400" />
            Preview
          </TacticalButton>

          <a href={downloadUrl} download={filename} className="flex-1">
            <TacticalButton size="sm" containerClassName="w-full" isLink={false}>
              <Download size={16} />
              Download
            </TacticalButton>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

/** ---------------- Page ---------------- */
export default function Documents() {
  const reduceMotion = useReducedMotion();

  const documents = [
    {
      title: "Curriculum Vitae",
      type: "PDF",
      date: "Jan 2026",
      icon: FileText,
      filename: "CV.pdf",
      note: "Security-focused full-stack developer resume.",
      badge: "Verified",
    },
  ];

  return (
    <section className="min-h-screen pt-36 pb-28 px-4 sm:px-6 lg:px-8 bg-black/40 relative overflow-hidden">
      <NetworkBackground />

      {/* clean scanline */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px] z-20 opacity-[0.12]" />

      {/* ambient glows */}
      <div className="absolute -top-44 -right-44 w-[560px] h-[560px] rounded-full bg-cyan-500/10 blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-48 -left-48 w-[620px] h-[620px] rounded-full bg-blue-500/10 blur-[170px] pointer-events-none" />

      {/* top-left HUD */}
      <div className="absolute top-10 left-10 hidden lg:block opacity-25 pointer-events-none z-10">
        <div className="flex items-center gap-2 text-cyan-300 font-mono text-[10px] tracking-[0.3em] uppercase">
          <Activity size={12} /> DOCUMENTS: ONLINE
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          custom={reduceMotion}
          className="flex flex-col md:flex-row items-end justify-between mb-14 gap-8"
        >
          <div className="text-left max-w-2xl">
            <motion.div
              variants={itemVariants}
              custom={reduceMotion}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/18 mb-5"
            >
              <Shield size={14} className="text-cyan-300" />
              <span className="text-[9px] font-mono text-cyan-300 font-black tracking-[0.34em] uppercase">
                Documents
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              custom={reduceMotion}
              className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.92]"
            >
              Resume & <span className="premium-gradient-text">Files</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              custom={reduceMotion}
              className="text-gray-300/80 max-w-xl mt-4 leading-relaxed"
            >
              Preview online or download a copy. Use the button on the right if you need role-specific documents.
            </motion.p>

            {/* Micro “trust strip” (cool + neat) */}
            <motion.div
              variants={itemVariants}
              custom={reduceMotion}
              className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-2xl border border-cyan-500/12 bg-black/35 px-4 py-3"
            >
              <span className="inline-flex items-center gap-2 text-cyan-200/70 font-mono text-[10px] tracking-[0.22em] uppercase">
                <ScanLine size={14} className="text-cyan-300/70" />
                Quick actions:
              </span>
              <span className="text-gray-300/70 text-sm">Preview • Download • Copy link</span>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div variants={itemVariants} custom={reduceMotion} className="w-full md:w-auto">
            <TacticalButton to="/contact" containerClassName="w-full md:w-auto">
              <Briefcase size={18} className="text-cyan-300" />
              Request Documents
            </TacticalButton>

            {/* tiny note under CTA */}
            <div className="mt-3 text-right text-xs text-gray-300/60 hidden md:block">
              <span className="inline-flex items-center gap-2">
                <Sparkles size={14} className="text-cyan-300/70" />
                Fast reply via WhatsApp
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          custom={reduceMotion}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-8 lg:gap-12"
        >
          {documents.map((doc, index) => (
            <DocumentCard key={index} {...doc} />
          ))}
        </motion.div>

        {/* Professional footer strip */}
        <motion.div
          variants={itemVariants}
          custom={reduceMotion}
          initial="hidden"
          animate="visible"
          className="mt-14 rounded-[2.2rem] border border-cyan-500/12 bg-black/45 backdrop-blur-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/18">
              <Shield size={18} className="text-cyan-300" />
            </div>
            <div>
              <p className="text-white font-semibold">Hiring process support</p>
              <p className="text-gray-300/70 text-sm leading-relaxed max-w-2xl">
                I can provide tailored project summaries, references, or role-specific documentation when requested.
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <TacticalButton to="/contact" containerClassName="w-full md:w-auto">
              Request Access
            </TacticalButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
