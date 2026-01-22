import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Send,
  Mail,
  MapPin,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Copy,
  Shield,
  Lock,
} from "lucide-react";
import NetworkBackground from "../components/NetworkBackground";
import TacticalButton from "../components/TacticalButton";

/** Motion */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
};

/** Helpers */
function shortId(seed = "") {
  const hourBucket = Math.floor(Date.now() / (1000 * 60 * 60));
  const input = `${seed}::${hourBucket}`;
  let h = 2166136261; // FNV-1a
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).toUpperCase().slice(0, 8);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/** FUN fake encryption (visual only) */
function fakeEncrypt(text) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@";
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === " " || c === "\n" || c === "\t") out += c;
    else out += chars[(c.charCodeAt(0) + i * 7) % chars.length];
  }
  return out;
}

/** Small reusable card */
const InfoCard = ({ icon: Icon, title, value, href, note }) => (
  <motion.a
    variants={itemVariants}
    href={href}
    target={href?.startsWith("mailto:") || href?.startsWith("tel:") ? "_self" : "_blank"}
    rel="noopener noreferrer"
    className="group flex items-start gap-4 p-5 bg-black/60 border border-cyan-500/15 rounded-2xl hover:border-cyan-400/50 transition duration-300 shadow-lg backdrop-blur-md"
  >
    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/10 group-hover:scale-110 transition-transform">
      <Icon className="w-5 h-5 text-cyan-300" aria-hidden="true" />
    </div>
    <div className="min-w-0">
      <h4 className="text-[11px] font-mono font-black text-cyan-300/70 uppercase tracking-widest">
        {title}
      </h4>
      <p className="text-white font-semibold break-words leading-snug">{value}</p>
      {note && <p className="text-gray-400 text-xs mt-1">{note}</p>}
    </div>
  </motion.a>
);

export default function Contact() {
  const reduceMotion = useReducedMotion();

  // message is ALWAYS the REAL message
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "idle", text: "Fill the form and hit Send." });

  // fun UI state
  const [encryptMode, setEncryptMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const WHATSAPP_PHONE = "233592305903";
  const DISPLAY_PHONE = "+233 59 230 5903";
  const EMAIL = "theoagyei77@gmail.com";
  const LOCATION = "Accra, Ghana";

  const mapsLink = useMemo(() => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(LOCATION)}`;
  }, []);

  const whatsappLink = useMemo(() => {
    const msg = "Hi Theophilus, I saw your portfolio and I’d like to talk.";
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
  }, []);

  const messageId = useMemo(() => {
    const seed = `${formData.email || "guest"}|${formData.name || "anon"}`;
    return `MSG-${shortId(seed)}`;
  }, [formData.email, formData.name]);

  const signal = useMemo(() => {
    let score = 0;
    if (formData.name.trim()) score += 33;
    if (formData.email.trim()) score += 33;
    if (formData.message.trim().length > 10) score += 34;
    return clamp(score, 0, 100);
  }, [formData]);

  const encryptedOverlayText = useMemo(() => {
    if (!encryptMode) return "";
    if (!formData.message) return "";
    return fakeEncrypt(formData.message);
  }, [encryptMode, formData.message]);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(messageId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((p) => ({ ...p, [name]: value }));

    setStatus((s) => {
      if (s.type === "sent") return s;
      if (s.type === "error") return { type: "typing", text: "Looks good. Keep going…" };
      const ready = name === "message" ? value.length > 5 : true;
      return { type: "typing", text: ready ? "Looks good. Ready to send ✅" : "Typing..." };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: "error", text: "Please fill in all fields." });
      return;
    }

    // ALWAYS send the REAL message
    const msg = `Hi Theophilus 👋
My name is ${formData.name}.
Email: ${formData.email}

Message ID: ${messageId}

Message:
${formData.message}`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");

    setStatus({
      type: "sent",
      text: "Opening WhatsApp… If it doesn’t open, use the WhatsApp button on the left.",
    });

    setFormData({ name: "", email: "", message: "" });
    setEncryptMode(false);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden min-h-screen py-28 px-4 sm:px-6 lg:px-8 bg-black/40"
    >
      <NetworkBackground />

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.10)_50%)] bg-[length:100%_4px] z-20 opacity-[0.18]" />

      {/* Glows */}
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full bg-blue-500/5 blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-30">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="text-center mb-14"
        >
          <motion.p
            variants={itemVariants}
            className="text-cyan-300/80 font-mono text-xs tracking-[0.25em] uppercase"
          >
            Let’s talk
          </motion.p>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            Contact <span className="premium-gradient-text">Me</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-gray-300/80 max-w-2xl mx-auto mt-4 leading-relaxed"
          >
            Have a job opportunity, project idea, or want to collaborate? Send a message and I’ll reply as soon as I can.
          </motion.p>
        </motion.div>

        {/* Layout */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="grid lg:grid-cols-3 gap-10 bg-black/40 border border-cyan-500/15 p-6 md:p-10 rounded-3xl shadow-2xl shadow-cyan-900/10 backdrop-blur-xl"
        >
          {/* Left */}
          <div className="lg:col-span-1 space-y-5">
            <motion.h3 variants={itemVariants} className="text-2xl font-black text-white">
              Quick Info
            </motion.h3>

            <motion.p variants={itemVariants} className="text-gray-400 leading-relaxed">
              Fastest reply: WhatsApp. For formal messages: Email.
            </motion.p>

            <div className="space-y-4 pt-2">
              <InfoCard icon={Mail} title="Email" value={EMAIL} href={`mailto:${EMAIL}`} note="Best for job offers & formal messages" />
              <InfoCard icon={Smartphone} title="WhatsApp / Phone" value={DISPLAY_PHONE} href={whatsappLink} note="Fastest way to reach me" />
              <InfoCard icon={MapPin} title="Location" value={LOCATION} href={mapsLink} note="Open in Google Maps" />
            </div>

            <motion.div variants={itemVariants} className="pt-2">
              <TacticalButton to={whatsappLink} containerClassName="w-full">
                <Smartphone size={16} /> Chat on WhatsApp
              </TacticalButton>
              <div className="h-3" />
              <TacticalButton to={`mailto:${EMAIL}`} containerClassName="w-full">
                <Mail size={16} /> Send Email
              </TacticalButton>

              <div className="mt-6 p-4 rounded-2xl border border-cyan-500/15 bg-black/60">
                <div className="flex items-center gap-2 text-cyan-200 font-semibold">
                  <Shield size={16} className="text-cyan-300" />
                  Privacy Note
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  I only use your details to reply to your message. No spam.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right */}
          <motion.div
            variants={containerVariants}
            className="lg:col-span-2 bg-black/60 p-6 md:p-8 rounded-2xl border border-cyan-500/15 shadow-inner shadow-cyan-950/20"
          >
            <motion.h3 variants={itemVariants} className="text-2xl md:text-3xl font-black text-white mb-3">
              Send a Message
            </motion.h3>

            {/* Console */}
            <motion.div
              variants={itemVariants}
              className="mb-6 rounded-3xl border border-cyan-500/20 bg-black/70 backdrop-blur-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-500/15">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <p className="text-white font-semibold tracking-tight">Security Console</p>
                  <span className="text-cyan-300/70 text-xs font-mono">
                    {status.type === "sent" ? "LINK: OPEN" : status.type === "error" ? "LINK: ERROR" : "LINK: READY"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={copyId}
                  className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl border border-cyan-500/20 text-cyan-300 hover:border-cyan-400/60 hover:text-white transition"
                >
                  <Copy size={14} aria-hidden="true" />
                  {copied ? "COPIED ✅" : "COPY ID"}
                </button>
              </div>

              <div className="px-5 py-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-300/60 font-mono">Message ID</p>
                    <p className="text-white font-mono font-black tracking-wider">{messageId}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-300/60 font-mono">Signal</p>
                    <p className="text-white font-mono font-black">{signal}%</p>
                  </div>
                </div>

                <div className="h-2 rounded-full bg-white/5 border border-cyan-500/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${signal}%` }}
                    transition={{ duration: reduceMotion ? 0 : 0.6 }}
                    className="h-full bg-cyan-400/60"
                  />
                </div>

                {/* Encrypt toggle (VISUAL ONLY) */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-semibold text-sm">Encrypt view (fun)</p>
                    <p className="text-gray-400 text-xs">Only changes what you see in the box. I still receive your real message.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEncryptMode((v) => !v)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-mono transition ${
                      encryptMode
                        ? "border-cyan-400/60 text-cyan-200 bg-cyan-500/10"
                        : "border-cyan-500/20 text-cyan-300/70 hover:border-cyan-400/60 hover:text-white"
                    }`}
                  >
                    <Lock size={14} aria-hidden="true" />
                    {encryptMode ? "ENCRYPT ON" : "ENCRYPT OFF"}
                  </button>
                </div>

                <div className="flex items-start gap-3">
                  {status.type === "sent" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" aria-hidden="true" />
                  ) : status.type === "error" ? (
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" aria-hidden="true" />
                  ) : (
                    <Send className="w-5 h-5 text-cyan-300 mt-0.5" aria-hidden="true" />
                  )}

                  <div className="min-w-0">
                    <p className="text-white font-semibold">Message status</p>
                    <p className="text-gray-300/80">{status.text}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-white/90">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-4 bg-black/60 border border-cyan-500/10 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 transition-all"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-white/90">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-4 bg-black/60 border border-cyan-500/10 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 transition-all"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-white/90">
                  Message
                </label>

                {/* IMPORTANT: Textarea keeps REAL text; overlay shows “encrypted” */}
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell me what you need help with…"
                    className={[
                      "w-full px-4 py-4 bg-black/60 border border-cyan-500/10 rounded-2xl",
                      "placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400",
                      "transition-all resize-none",
                      encryptMode ? "text-transparent caret-cyan-300" : "text-white",
                    ].join(" ")}
                  />

                  {encryptMode && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 px-4 py-4 text-white/80 font-mono whitespace-pre-wrap break-words"
                    >
                      {formData.message
                        ? encryptedOverlayText
                        : <span className="text-gray-500">Tell me what you need help with…</span>}
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-400">
                  Tip: Include what you want done + deadline (if any).
                </p>
              </motion.div>

              <TacticalButton type="submit" isLink={false} containerClassName="w-full mt-2">
                <Send size={18} className={reduceMotion ? "" : "animate-pulse"} />
                Send via WhatsApp
              </TacticalButton>

              <p className="text-center text-gray-400 text-xs mt-2">
                Your info is only used to reply to your message.
              </p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
