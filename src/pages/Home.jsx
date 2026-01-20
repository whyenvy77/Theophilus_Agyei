import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, Award, Download, Eye, ChevronRight, Fingerprint, ShieldCheck, Activity, Terminal } from "lucide-react";
import profilePic from "../assets/profile.jpg";
import TypingText from "../components/TypingText";
import SocialIcons from "../components/SocialIcons";
import NetworkBackground from "../components/NetworkBackground";
import MouseFollower from "../components/MouseFollower";
import TelemetryHUD from "../components/TelemetryHUD";
import TacticalButton from "../components/TacticalButton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.2, staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 150, damping: 20 } },
};

const OperationalLog = () => {
  return (
    <div className="hidden lg:flex flex-col gap-2 font-mono text-[9px] text-cyan-500/50 p-4 border border-cyan-500/10 bg-black/40 backdrop-blur-md rounded-xl max-w-[200px]">
      <div className="flex items-center gap-2 text-cyan-400 border-b border-cyan-500/20 pb-2 mb-1">
        <Terminal size={12} /> SYSTEM_LOG
      </div>
      <div className="space-y-1">
        <div className="flex justify-between"><span>PORT_SCAN</span><span className="text-green-500">ACTIVE</span></div>
        <div className="flex justify-between"><span>ENC_TYPE</span><span>AES-256</span></div>
        <div className="flex justify-between"><span>UPLINK</span><span className="animate-pulse">STABLE</span></div>
        <div className="flex justify-between"><span>THREAT_LVL</span><span>LOW</span></div>
      </div>
      <div className="mt-2 pt-2 border-t border-cyan-500/20 text-[8px] opacity-40">
        LAST_SYNC: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

const CompactCredentialCard = ({ title, type, icon: Icon, filename }) => {
  const fileSerial = useMemo(() => `SEC-${Math.random().toString(36).substring(2, 6).toUpperCase()}-X`, []);

  return (
    <motion.div
      variants={itemVariants}
      className="group relative flex flex-col p-6 rounded-3xl border border-cyan-500/10 bg-black/60 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-500"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/10 group-hover:bg-cyan-500/10 group-hover:scale-110 transition-all duration-500">
          <Icon className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="text-[8px] font-mono text-cyan-400/40 tracking-widest uppercase">{fileSerial}</div>
      </div>

      <h3 className="text-lg font-black text-white mb-1 uppercase tracking-tighter truncate">{title}</h3>
      <p className="text-[10px] font-mono text-cyan-400/60 uppercase mb-6">{type}</p>

      <div className="mt-auto flex gap-2">
        <TacticalButton
          to={`/preview/${filename}`}
          size="sm"
          containerClassName="flex-1"
        >
          <Eye size={12} /> PREVIEW
        </TacticalButton>
        <TacticalButton
          to={`/documents/${filename}`}
          size="sm"
          containerClassName="flex-shrink-0"
        >
          <Download size={12} />
        </TacticalButton>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const featuredCerts = [
    {
      title: "Executive CV",
      type: "PDF / Resume",
      icon: FileText,
      filename: "Theophilus_Agyei_CV.pdf",
    },
    {
      title: "Full-Stack Web Dev",
      type: "Certification",
      icon: Award,
      filename: "Web_Dev_Cert.pdf",
    },
    {
      title: "Cyber Security",
      type: "Certification",
      icon: Award,
      filename: "Security_Cert.pdf",
    }
  ];

  return (
    <div className="bg-gray-950 overflow-x-hidden">
      <section
        id="home"
        className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <MouseFollower />
        <NetworkBackground />

        {/* Decorative HUD Elements */}
        <div className="absolute top-24 right-10 hidden xl:flex flex-col gap-4 z-20">
          <OperationalLog />
          <div className="flex flex-col gap-2 opacity-30 pointer-events-none">
            <div className="flex items-center gap-3 text-[10px] font-mono text-cyan-400 font-black">
              <div className="w-2 h-2 bg-cyan-500 animate-pulse rounded-full" />
              CMD_INTERFACE: ACTIVE
            </div>
            <div className="text-[8px] font-mono text-gray-400 border-l border-cyan-500/30 pl-3">
              SECURE_UPLINK: 0x82.11.4A<br />
              LOC: 5.60/0.18<br />
              BUFFER: OPTIMAL
            </div>
          </div>
        </div>

        {/* Decorative Blur and Parallax Elements */}
        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-cyan-600/10 blur-[180px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between w-full z-10 relative">
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex-1 text-center md:text-left md:pr-12">
            <motion.p variants={itemVariants} className="section-subtitle !text-cyan-400">
              SYSTEM_OVERRIDE: Theophilus Agyei
            </motion.p>

            <motion.h1 variants={itemVariants} className="text-6xl lg:text-9xl font-black text-white mb-4 tracking-tighter leading-[0.85] uppercase italic">
              I Deploy <span className="premium-gradient-text relative inline-block">
                <motion.span
                  animate={{ x: [-1, 1, -1, 0], opacity: [1, 0.7, 1] }}
                  transition={{ repeat: Infinity, duration: 0.15, repeatDelay: 4 }}
                  className="absolute inset-0 text-cyan-400 blur-[2px] -z-10"
                >
                  Secure
                </motion.span>
                Secure
              </span> <br /> Digital Assets
            </motion.h1>

            <motion.div variants={itemVariants} className="mb-10 font-mono text-[10px] text-cyan-500/40 tracking-[0.4em] uppercase font-black flex items-center justify-center md:justify-start gap-4">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-sm animate-ping" /> STREAMING_CREDENTIALS:</span>
              <div className="flex gap-2 text-white/40">
                <span className="animate-[pulse_1s_infinite]">#AES-256</span>
                <span className="animate-[pulse_1.5s_infinite]">#ZERO_TRUST</span>
                <span className="animate-[pulse_1.2s_infinite]">#SSL_TLS</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="text-cyan-400/80 text-xl lg:text-2xl mb-12 max-w-xl mx-auto md:mx-0 font-mono leading-relaxed uppercase tracking-tight">
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
                <span className="text-[10px] opacity-40">{"["}0x2{"]"}</span> GetInToch 📤
              </TacticalButton>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-16 flex justify-center md:justify-start">
              <SocialIcons />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 mt-20 md:mt-0 flex justify-center md:justify-end relative group"
          >
            {/* Enhanced Glass Effect behind profile pic */}
            <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full group-hover:bg-cyan-500/30 transition-all duration-700 scale-125 translate-y-4" />

            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <div className="relative p-2 rounded-full border border-cyan-500/20 bg-black backdrop-blur-md shadow-2xl shadow-cyan-900/20 ring-1 ring-cyan-500/10 group">
                {/* Profile HUD Overlay */}
                <div className="absolute inset-0 z-20 pointer-events-none border-[1px] border-cyan-500/20 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute top-0 right-10 p-2 text-[8px] font-mono text-cyan-400 bg-black/80 rounded font-black border border-cyan-500/20 translate-y-[-50%]">TARGET_LOCKED</div>
                  <div className="absolute bottom-10 left-0 p-2 text-[8px] font-mono text-cyan-400 bg-black/80 rounded font-black border border-cyan-500/20 translate-x-[-20%]">ID_MATCH: 100%</div>
                </div>

                {/* Telemetry HUDs near profile */}
                <div className="absolute top-1/4 -right-12 z-30 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 group-hover:translate-x-0 hidden lg:block">
                  <TelemetryHUD label="THREAT_MITIGATION" value="99.8%" color="blue" className="w-40" />
                </div>
                <div className="absolute bottom-1/4 -left-20 z-30 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-4 group-hover:translate-x-0 hidden lg:block">
                  <TelemetryHUD label="SYSTEM_HARDENING" value="v9.4" color="cyan" className="w-40" />
                </div>

                <img
                  src={profilePic}
                  alt="Theophilus Agyei"
                  className="w-72 h-72 md:w-80 md:h-80 lg:w-[450px] lg:h-[450px] rounded-full border border-cyan-500/30 object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 relative z-10"
                />

                {/* Decorative HUD Ring */}
                <div className="absolute -inset-4 border border-dashed border-cyan-500/10 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Verified Credentials Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 z-30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 flex flex-col md:flex-row items-end justify-between gap-6"
          >
            <div className="max-w-xl">
              <p className="section-subtitle !mb-2 flex items-center gap-2">
                <ShieldCheck size={14} className="text-cyan-400" /> AUTHORIZED_ASSETS
              </p>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                Verified <span className="premium-gradient-text">Credentials</span>
              </h2>
            </div>
            <Link to="/documents" className="text-cyan-400 font-mono text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 hover:text-white transition-colors group">
              Enter_Secure_Vault <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCerts.map((cert, i) => (
              <CompactCredentialCard key={i} {...cert} />
            ))}
          </div>

          {/* Live Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 p-8 rounded-[2rem] border border-cyan-500/10 bg-black/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-8"
          >
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[8px] font-mono text-cyan-500/40 uppercase tracking-widest font-black">LAST_DEPLOYMENT</span>
                <span className="text-white font-mono text-sm font-black uppercase tracking-tight">PROJECT_ALPHA // JAN_2026</span>
              </div>
              <div className="w-[1px] h-10 bg-cyan-500/20 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-[8px] font-mono text-cyan-500/40 uppercase tracking-widest font-black">AVAILABILITY</span>
                <span className="text-green-500 font-mono text-sm font-black uppercase tracking-tight">READY_FOR_ENGAGEMENT</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center text-[10px] font-mono text-cyan-400">
                    <Fingerprint size={14} />
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-black uppercase tracking-widest leading-none">SECURITY_VETTED</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
