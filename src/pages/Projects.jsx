import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import project1 from "../assets/project1.jpg";
import project2 from "../assets/project2.webp";
import project3 from "../assets/project3.webp";
import NetworkBackground from "../components/NetworkBackground";
import { Terminal, Shield, Activity, Target } from "lucide-react";


import TacticalButton from "../components/TacticalButton";

// --- FRAMER MOTION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

// --- ENRICHED PROJECT DATA ---
const projects = [
  {
    title: "Monitoring System",
    description: "A robust application built for real-time monitoring, data visualization, and system performance tracking, aimed at providing actionable insights for businesses.",
    image: project1,
    link: "#",
    github: "#",
    tech: ["React", "Node.js", "WebSocket", "MongoDB"],
    category: "OPERATIONAL",
    threatLevel: "MINIMAL"
  },
  {
    title: "Bug Bounty Program",
    description: "A platform designed to facilitate collaboration between ethical hackers and organizations to identify and report security vulnerabilities in software systems.",
    image: project2,
    link: "#",
    github: "#",
    tech: ["ASP.NET Core", "SQL Server", "JavaScript", "Tailwind CSS"],
    category: "SECURITY",
    threatLevel: "CRITICAL"
  },
  {
    title: "Jewelry Shop E-commerce",
    description: "A fully functional e-commerce website for a jewelry shop, featuring product catalogs, secure payment gateways, user authentication, and admin management functionalities.",
    image: project3,
    link: "https://jewelry-shop-nu.vercel.app/",
    github: "#",
    tech: ["React", "Node.js", "MongoDB", "Stripe API"],
    category: "COMMERCIAL",
    threatLevel: "LOW"
  }
];

export default function Projects() {
  const [filter, setFilter] = React.useState("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === "ALL" || p.category === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const stats = [
    { label: "CONNECTED_NODES", value: "42", status: "STABLE" },
    { label: "SEC_LEVEL", value: "RED_ALPHA", status: "ACTIVE" },
    { label: "UPLINK_SPEED", value: "1.2 GB/S", status: "OPTIMIZED" },
    { label: "ENCRYPTION", value: "AES-256", status: "LOCKED" }
  ];
  return (
    <section
      id="projects"
      className="section-container bg-black/40 relative overflow-hidden min-h-screen py-32"
    >
      <NetworkBackground />

      {/* Decorative HUD Scanline */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-20 opacity-[0.03]" />

      {/* Glow Orbs */}
      <motion.div
        className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Decorative HUD Elements */}
      <div className="absolute top-10 left-10 hidden lg:block opacity-20 pointer-events-none">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
          <Activity size={12} /> SYSTEM_GRID: ACTIVE
        </div>
        <div className="mt-1 text-gray-500 font-mono text-[8px]">LOC: 0x48.232 / 0x12.984</div>
      </div>
      <div className="absolute bottom-10 right-10 hidden lg:block opacity-20 pointer-events-none">
        <div className="flex items-center gap-2 text-blue-400 font-mono text-[10px] tracking-[0.3em] uppercase">
          <Shield size={12} /> AUTH: SECURE_BYPASS_OFF
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 relative"
        >
          {/* Decorative Background HUD */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black opacity-[0.02] select-none pointer-events-none uppercase italic tracking-tighter">
            REPOS_v8.2
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            className="w-24 h-1 bg-cyan-500 mx-auto mb-6"
          />
          <p className="font-mono text-xs text-cyan-500/60 uppercase tracking-[0.4em] mb-4">
            PROJECT_ARCHIVES // SECURE_ACCESS_REQUIRED
          </p>
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none text-shadow-glow">
            Deployed <span className="premium-gradient-text">Assets</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mb-12"
        >
          {/* Global Command Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(0,243,255,0.05)" }}
                className="bg-black/60 border border-cyan-500/20 p-4 rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden group/stat"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent scale-x-0 group-hover/stat:scale-x-100 transition-transform duration-500" />
                <span className="text-[8px] font-mono text-cyan-500/40 uppercase tracking-[0.3em] font-black mb-1">{s.label}</span>
                <span className="text-xl font-black text-white italic tracking-tighter mb-1">{s.value}</span>
                <span className="text-[7px] font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" /> {s.status}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Terminal Filter Prompt */}
          <div className="bg-black/80 border-2 border-cyan-500/30 rounded-2xl p-6 mb-16 relative group/terminal overflow-hidden shadow-[0_0_30px_rgba(0,243,255,0.05)]">
            <div className="flex items-center gap-4 border-b border-cyan-500/20 pb-4 mb-6">
              <Terminal size={18} className="text-cyan-400" />
              <div className="flex flex-wrap gap-4 text-[10px] font-mono font-black uppercase tracking-[0.2em]">
                {["ALL", "SECURITY", "OPERATIONAL", "COMMERCIAL"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`transition-colors flex items-center gap-2 ${filter === cat ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    {filter === cat && <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />}
                    [{cat}]
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 font-mono text-sm">
              <span className="text-cyan-500 font-bold">visitor@agyei_ops:~$</span>
              <span className="text-gray-400">grep -r</span>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="initialize_search_query..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-cyan-400 w-full placeholder:text-cyan-900/60 font-black uppercase tracking-widest"
                />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-500/10 group-focus-within/terminal:bg-cyan-500/50 transition-colors" />
              </div>
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2.5 h-5 bg-cyan-400"
              />
            </div>

            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Activity size={100} className="text-cyan-500" />
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {filteredProjects.map((p, i) => (
              <ProjectCard key={i} {...p} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-cyan-500/20 rounded-3xl">
              <p className="font-mono text-cyan-500/40 uppercase tracking-[0.5em] text-sm animate-pulse">
                NO_MATCHING_ASSETS_FOUND // RETRY_QUERY
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mt-24 text-center"
        >
          <TacticalButton to="/contact">
            Require Secure Development?
          </TacticalButton>
        </motion.div>
      </div>
    </section>
  );
}
