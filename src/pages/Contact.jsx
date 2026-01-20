import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, PhoneCall, Mail, MapPin, Smartphone, Activity, Terminal, ShieldCheck } from "lucide-react"; // Imported more icons
import NetworkBackground from "../components/NetworkBackground";
import TacticalButton from "../components/TacticalButton";

// --- FRAMER MOTION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Tighter stagger
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 16, // Softer damping
    },
  },
};

// Component for contact info block
const ContactInfoItem = ({ icon: Icon, title, value, href }) => (
  <motion.a
    variants={itemVariants}
    href={href}
    target={href.startsWith('mailto') || href.startsWith('tel') ? '_self' : '_blank'}
    rel="noopener noreferrer"
    className="flex items-center p-4 bg-black/60 border border-cyan-500/20 rounded-lg hover:border-cyan-400/50 transition duration-300 shadow-lg backdrop-blur-md group"
  >
    <Icon className="w-6 h-6 text-cyan-400 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
    <div>
      <h4 className="text-xs font-mono font-bold text-cyan-400/60 uppercase tracking-widest">{title}</h4>
      <p className="text-white font-mono font-bold break-words uppercase tracking-tighter">{value}</p>
    </div>
  </motion.a>
);

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Standardized phone number for the WA API (no spaces/symbols)
  const WHATSAPP_PHONE_NUMBER = "233592305903";
  const DISPLAY_PHONE_NUMBER = "+233 59 230 5903";
  const EMAIL_ADDRESS = "theoagyei77@gmail.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct WhatsApp URL with pre-filled message
    const message = `Hello Theophilus, my name is ${formData.name}. ${formData.message} (Email: ${formData.email})`;
    const whatsappURL = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new tab
    window.open(whatsappURL, "_blank");

    // Optional: Clear form after successful submission
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section
      id="contact"
      className="section-container bg-black/40 relative overflow-hidden min-h-screen py-32"
    >
      <NetworkBackground />

      {/* Terminal Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] z-20 opacity-[0.2]" />

      <div className="absolute top-10 left-10 hidden lg:block opacity-20 pointer-events-none z-10">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
          <Activity size={12} /> UPLINK_STATUS: STANDBY
        </div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="text-center mb-24 relative z-30"
      >
        <motion.p variants={itemVariants} className="section-subtitle">
          ESTABLISH_CONNECTION: Uplink_Request
        </motion.p>
        <motion.h2 variants={itemVariants} className="section-title">
          Secure <span className="premium-gradient-text tracking-tighter">Channel</span>
        </motion.h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid lg:grid-cols-3 gap-12 bg-black/40 border border-cyan-500/20 p-8 md:p-12 rounded-2xl shadow-2xl shadow-cyan-900/10 backdrop-blur-xl"
      >
        {/* Left Column: Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <motion.h3 variants={itemVariants} className="text-3xl font-black text-white mb-4 uppercase italic tracking-tighter">
            Uplink_Nodes
          </motion.h3>
          <motion.p variants={itemVariants} className="text-gray-400 leading-relaxed">
            I'm actively seeking new opportunities, full-time positions, and challenging contract work. I aim to respond within 24 hours.
          </motion.p>

          <div className="space-y-4 pt-4">
            <ContactInfoItem
              icon={Mail}
              title="Email Address"
              value={EMAIL_ADDRESS}
              href={`mailto:${EMAIL_ADDRESS}`}
            />
            <ContactInfoItem
              icon={Smartphone} // Changed to Smartphone icon for clarity
              title="WhatsApp / Phone"
              value={DISPLAY_PHONE_NUMBER}
              href={`tel:${WHATSAPP_PHONE_NUMBER}`}
            />
            <ContactInfoItem
              icon={MapPin}
              title="Location"
              value="Accra, Ghana"
              href="https://maps.app.goo.gl/YourLocationLink" // Placeholder for an actual map link
            />
          </div>

          {/* Email CTA - Clear alternative to the form's WhatsApp action */}
          <TacticalButton to={`mailto:${EMAIL_ADDRESS}`} containerClassName="mt-6">
            <Mail size={16} /> Prefer Traditional Email?
          </TacticalButton>
        </div>

        {/* Right Column: WhatsApp Contact Form */}
        <motion.div
          variants={containerVariants}
          className="lg:col-span-2 bg-black/60 p-8 rounded-xl border border-cyan-500/20 shadow-inner shadow-cyan-950/20"
        >
          <motion.h3 variants={itemVariants} className="text-3xl font-black text-white mb-6 uppercase italic tracking-tighter">
            Data_Transmission_Terminal
          </motion.h3>

          {/* Dedicated Terminal HUD for Form Feedback */}
          <div className="mb-6 p-4 rounded-lg bg-black/80 border border-cyan-500/30 font-mono text-[9px] text-cyan-400/80 shadow-inner">
            <div className="flex items-center gap-2 mb-2 border-b border-cyan-500/20 pb-1">
              <Terminal size={10} /> <span>TRANSMISSION_STATUS: {formData.name ? "INITIALIZING..." : "AWAITING_INPUT"}</span>
            </div>
            <div className="space-y-1 opacity-60">
              <div>{"> "} SESSION_ID: {Math.random().toString(16).slice(2, 10).toUpperCase()}</div>
              <div>{"> "} UPLINK: {formData.email ? "ESTABLISHED" : "PENDING"}</div>
              <div>{"> "} PAYLOAD: {formData.message ? `${formData.message.length} BYTES DETECTED` : "0 BYTES"}</div>
              {formData.name && <div className="text-cyan-400 animate-pulse">{"> "} ALERT: DATA_PACKET_STAGING_COMPLETE</div>}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="name" className="flex items-center gap-2 text-[10px] font-mono font-black text-cyan-400/60 uppercase tracking-widest text-left ml-2">
                <Terminal size={12} /> USER_IDENTIFICATION
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="PROMPT: IDENTIFY_SELF"
                className="w-full px-4 py-4 bg-black/60 border border-cyan-500/10 rounded-xl text-white placeholder-cyan-900 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-400 transition-all font-mono text-sm uppercase"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="email" className="flex items-center gap-2 text-[10px] font-mono font-black text-cyan-400/60 uppercase tracking-widest text-left ml-2">
                <Terminal size={12} /> UPLINK_NODE_ADDRESS
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="PROMPT: INPUT_RECOVERY_NODE"
                className="w-full px-4 py-4 bg-black/60 border border-cyan-500/10 rounded-xl text-white placeholder-cyan-900 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-400 transition-all font-mono text-sm uppercase"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="message" className="flex items-center gap-2 text-[10px] font-mono font-black text-cyan-400/60 uppercase tracking-widest text-left ml-2">
                <Terminal size={12} /> PAYLOAD_COMMANDS
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                placeholder="PROMPT: EXECUTE_INTENT..."
                className="w-full px-4 py-4 bg-black/60 border border-cyan-500/10 rounded-xl text-white placeholder-cyan-900 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-400 transition-all font-mono text-sm uppercase resize-none"
              />
            </motion.div>

            <TacticalButton type="submit" isLink={false} containerClassName="w-full mt-8">
              <ShieldCheck size={20} className="text-cyan-400 animate-pulse" />
              INITIALIZE_UPLINK
            </TacticalButton>
          </form>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.5 }}
        transition={{ delay: 0.5 }}
        className="text-center text-gray-500 text-sm mt-12"
      >
        Your contact information will only be used to respond to your inquiry.
      </motion.p>

    </section>
  );
}