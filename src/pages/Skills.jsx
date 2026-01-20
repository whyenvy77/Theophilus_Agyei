import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  SiReact,
  SiTailwindcss,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiDotnet,
  SiNodedotjs,
  SiMongodb,
  SiGit,
  SiGithub,
  SiExpress,
  SiKalilinux,
  SiWireshark,
  SiPayloadcms,
} from "react-icons/si";
import { FaDatabase, FaShieldAlt, FaUserSecret, FaBug } from "react-icons/fa"; // ✅ Additional icons
import NetworkBackground from "../components/NetworkBackground";

// FRAMER VARIANTS
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.22, delayChildren: 0.15 } },
};

const card = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 130, damping: 15 } },
};

// SKILLS DATA
const categories = [
  {
    title: "Ethical Hacking & Security",
    skills: [
      { name: "Penetration Testing", icon: FaUserSecret, level: 88 },
      { name: "Network Security", icon: FaShieldAlt, level: 92 },
      { name: "Vulnerability Assessment", icon: FaBug, level: 85 },
      { name: "Web App Security (OWASP)", icon: SiWireshark, level: 82 },
      { name: "Kali Linux", icon: SiKalilinux, level: 90 },
    ],
  },
  {
    title: "Frontend Development",
    skills: [
      { name: "React", icon: SiReact, level: 92 },
      { name: "Tailwind CSS", icon: SiTailwindcss, level: 96 },
      { name: "JavaScript (ES6+)", icon: SiJavascript, level: 89 },
      { name: "HTML5", icon: SiHtml5, level: 97 },
      { name: "CSS3", icon: SiCss3, level: 94 },
    ],
  },
  {
    title: "Backend & APIs",
    skills: [
      { name: "ASP.NET Core (C#)", icon: SiDotnet, level: 83 },
      { name: "Node.js", icon: SiNodedotjs, level: 79 },
      { name: "Express.js", icon: SiExpress, level: 77 },
    ],
  },
  {
    title: "Databases & Tools",
    skills: [
      { name: "SQL Server", icon: FaDatabase, level: 86 }, // ✅ Fixed
      { name: "MongoDB", icon: SiMongodb, level: 72 },
      { name: "Git", icon: SiGit, level: 91 },
      { name: "GitHub", icon: SiGithub, level: 90 },
    ],
  },
];

export default function Skills() {
  return (
    <section className="relative w-full bg-[#050505] py-28 overflow-hidden select-none">
      {/* Network Background */}
      <NetworkBackground />


      {/* Floating Glow Orbs */}
      <motion.div
        className="absolute top-[-200px] right-[-200px] w-[450px] h-[450px] bg-indigo-600/30 blur-[180px] rounded-full"
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-200px] left-[-200px] w-[450px] h-[450px] bg-cyan-600/20 blur-[180px] rounded-full"
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10"
      >
        <p className="text-cyan-400 text-lg font-mono tracking-widest uppercase mb-4">ACCESS_GRANTED: Skillset_Inventory</p>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mt-2 text-white uppercase italic">
          <span className="relative inline-block">
            <motion.span
              animate={{ x: [-2, 2, -1, 1, 0], opacity: [1, 0.8, 1] }}
              transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 3 }}
              className="absolute inset-0 text-cyan-500 blur-[1px] -z-10"
            >
              Hacker
            </motion.span>
            Hacker
          </span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Arsenal
          </span>
        </h2>
      </motion.div>

      {/* Skills Categories */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-7xl mx-auto px-6 mt-24 space-y-28 relative z-10"
      >
        {categories.map((cat, i) => (
          <motion.div key={i} className="space-y-10">
            <motion.h3 variants={card} className="text-4xl font-black text-white border-b border-white/10 pb-4">
              {cat.title}
            </motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 relative">
              {/* Tactical Connectors Background */}
              <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
                <svg className="w-full h-full" viewBox="0 0 1000 1000">
                  <path d="M0,500 L1000,500 M500,0 L500,1000" stroke="#00f3ff" strokeWidth="1" fill="none" strokeDasharray="5,5" />
                </svg>
              </div>

              {cat.skills.map((s, j) => (
                <motion.div
                  key={j}
                  variants={card}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="p-6 rounded-xl bg-black/90 border border-cyan-500/20 shadow-2xl backdrop-blur-2xl group hover:border-cyan-400/60 transition-all relative z-10 overflow-hidden"
                >
                  {/* Skill Card Scanline */}
                  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
                    <div className="w-full h-[1px] bg-cyan-400 animate-[scan_4s_linear_infinite]" />
                  </div>

                  <div className="flex items-center justify-between relative z-10 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 group-hover:bg-cyan-500/10 group-hover:border-cyan-400/40 transition-all">
                        <s.icon className="text-cyan-400 w-8 h-8 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-black text-lg p-0 tracking-tighter uppercase italic">{s.name}</span>
                        <span className="text-[8px] font-mono text-cyan-500/40 tracking-widest uppercase">STABILITY: 0.9{Math.floor(Math.random() * 9)}</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-400/20">
                      V{(1 + Math.random() * 5).toFixed(1)}
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-end">
                      <span className="text-[7px] font-mono text-gray-500 tracking-[0.3em] uppercase font-black">EFFICIENCY_LOAD</span>
                      <span className="text-[11px] font-mono text-cyan-400 font-black">{s.level}%</span>
                    </div>
                    <div className="w-full bg-cyan-950/30 rounded-full h-[3px] overflow-hidden border border-cyan-500/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.6)]"
                      />
                    </div>

                    <div className="flex justify-between items-center text-[7px] font-mono text-cyan-500/30 group-hover:text-cyan-500/60 transition-colors">
                      <span className="flex items-center gap-1"><div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" /> CORE_OPTIMIZED</span>
                      <span>MOD_READY</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
        className="text-center mt-24 relative z-10"
      >
        <Link to="/contact">
          <button className="px-10 py-4 text-lg font-bold rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all">
            Let's Build Something Great
          </button>
        </Link>
      </motion.div>
    </section>
  );
}
