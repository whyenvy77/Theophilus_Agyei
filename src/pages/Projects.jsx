import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import project1 from "../assets/project1.jpg";
import project2 from "../assets/project2.webp";
import project3 from "../assets/project3.webp";
import NetworkBackground from "../components/NetworkBackground";
import {
  Terminal,
  Shield,
  Activity,
  Target,
  Github,
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  Grid3X3,
  List,
  ArrowUpRight,
  X,
} from "lucide-react";

import TacticalButton from "../components/TacticalButton";

/** ---------------- Motion ---------------- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: (reduce) => ({
    opacity: 1,
    transition: reduce
      ? { duration: 0.2 }
      : { staggerChildren: 0.12, delayChildren: 0.12 },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (reduce) => ({
    opacity: 1,
    y: 0,
    transition: reduce
      ? { duration: 0.2 }
      : { type: "spring", stiffness: 120, damping: 18 },
  }),
};

/** ---------------- Data ---------------- */
const projects = [
  {
    title: "Monitoring System",
    description:
      "A robust application built for real-time monitoring, data visualization, and system performance tracking, aimed at providing actionable insights for businesses.",
    image: project1,
    link: "#",
    github: "#",
    tech: ["React", "Node.js", "WebSocket", "MongoDB"],
    category: "OPERATIONAL",
    threatLevel: "MINIMAL",
  },
  {
    title: "Bug Bounty Program",
    description:
      "A platform designed to facilitate collaboration between ethical hackers and organizations to identify and report security vulnerabilities in software systems.",
    image: project2,
    link: "#",
    github: "#",
    tech: ["ASP.NET Core", "SQL Server", "JavaScript", "Tailwind CSS"],
    category: "SECURITY",
    threatLevel: "CRITICAL",
  },
  {
    title: "Jewelry Shop E-commerce",
    description:
      "A fully functional e-commerce website for a jewelry shop, featuring product catalogs, secure payment gateways, user authentication, and admin management functionalities.",
    image: project3,
    link: "https://jewelry-shop-nu.vercel.app/",
    github: "#",
    tech: ["React", "Node.js", "MongoDB", "Stripe API"],
    category: "COMMERCIAL",
    threatLevel: "LOW",
  },
];

const categories = ["ALL", "SECURITY", "OPERATIONAL", "COMMERCIAL"];

/** ---------------- Helpers ---------------- */
const normalize = (s = "") => s.trim().toLowerCase();

function rankProject(p, q) {
  if (!q) return 0;
  const title = normalize(p.title);
  const desc = normalize(p.description);
  const tech = p.tech.map(normalize);
  const cat = normalize(p.category);
  let score = 0;

  if (title.includes(q)) score += 6;
  if (title.startsWith(q)) score += 3;
  if (desc.includes(q)) score += 3;
  if (tech.some((t) => t.includes(q))) score += 4;
  if (cat.includes(q)) score += 2;

  return score;
}

function threatBadgeStyles(level) {
  const v = String(level || "").toUpperCase();
  if (v === "CRITICAL")
    return "border-red-500/30 bg-red-500/10 text-red-200";
  if (v === "HIGH") return "border-orange-500/30 bg-orange-500/10 text-orange-200";
  if (v === "LOW") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
  return "border-cyan-500/25 bg-cyan-500/10 text-cyan-200";
}

function categoryChipStyles(cat) {
  const v = String(cat || "").toUpperCase();
  if (v === "SECURITY") return "border-cyan-400/40 bg-cyan-500/10 text-white";
  if (v === "OPERATIONAL") return "border-blue-400/40 bg-blue-500/10 text-white";
  if (v === "COMMERCIAL") return "border-emerald-400/40 bg-emerald-500/10 text-white";
  return "border-cyan-500/18 bg-black/30 text-cyan-200/70";
}

/** ---------------- UI: Mini Project Row (list mode) ---------------- */
function ProjectRow({ p }) {
  const isLive = p.link && p.link !== "#";
  const isGit = p.github && p.github !== "#";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/12 bg-black/45 backdrop-blur-xl hover:border-cyan-400/45 transition-all">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-cyan-400/18" />
      <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-[0.22em] uppercase border ${categoryChipStyles(p.category)}`}>
              {p.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-[0.22em] uppercase border ${threatBadgeStyles(p.threatLevel)}`}>
              {p.threatLevel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-white font-black text-xl md:text-2xl tracking-tight truncate">
              {p.title}
            </h3>
            <ArrowUpRight size={16} className="text-cyan-300/40 group-hover:text-cyan-300 transition" />
          </div>

          <p className="text-gray-300/75 mt-2 text-sm leading-relaxed line-clamp-2">
            {p.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {p.tech.slice(0, 6).map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-cyan-500/15 bg-black/30 text-cyan-200/70"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {isLive ? (
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none"
            >
              <TacticalButton isLink={false} containerClassName="w-full">
                Live <ExternalLink size={18} />
              </TacticalButton>
            </a>
          ) : (
            <div className="flex-1 md:flex-none opacity-50">
              <TacticalButton isLink={false} containerClassName="w-full">
                Live <ExternalLink size={18} />
              </TacticalButton>
            </div>
          )}

          {isGit ? (
            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none"
            >
              <TacticalButton isLink={false} containerClassName="w-full">
                GitHub <Github size={18} />
              </TacticalButton>
            </a>
          ) : (
            <div className="flex-1 md:flex-none opacity-50">
              <TacticalButton isLink={false} containerClassName="w-full">
                GitHub <Github size={18} />
              </TacticalButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const reduceMotion = useReducedMotion();

  const [filter, setFilter] = React.useState("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [view, setView] = React.useState("grid"); // "grid" | "list"

  const q = normalize(searchQuery);

  const filteredProjects = React.useMemo(() => {
    const base = projects.filter((p) => (filter === "ALL" ? true : p.category === filter));
    const searched = base.filter((p) => {
      if (!q) return true;
      const text = `${p.title} ${p.description} ${p.category} ${p.tech.join(" ")}`.toLowerCase();
      return text.includes(q);
    });

    // rank by relevance (small but noticeable quality upgrade)
    const ranked = [...searched].sort((a, b) => rankProject(b, q) - rankProject(a, q));
    return ranked;
  }, [filter, q]);

  const activeFiltersCount = (filter !== "ALL" ? 1 : 0) + (q ? 1 : 0);

  const stats = [
    { label: "PROJECTS", value: String(projects.length), status: "LIVE" },
    { label: "SECURITY", value: "HARDENED", status: "ON" },
    { label: "STACK", value: "FULL", status: "READY" },
    { label: "GITHUB", value: "@whyenvy77", status: "PUBLIC" },
  ];

  const clearSearch = () => setSearchQuery("");

  return (
    <section
      id="projects"
      className="section-container bg-black/40 relative overflow-hidden min-h-screen py-32"
    >
      <NetworkBackground />

      {/* Clean scanline */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.10)_50%)] bg-[length:100%_4px] z-20 opacity-[0.14]" />

      {/* Ambient glows */}
      <motion.div
        className="absolute -top-44 -left-44 w-[620px] h-[620px] bg-cyan-600/10 blur-[190px] rounded-full"
        animate={reduceMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.22, 0.42, 0.22] }}
        transition={reduceMotion ? {} : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-52 -right-52 w-[720px] h-[720px] bg-blue-600/10 blur-[210px] rounded-full"
        animate={reduceMotion ? {} : { scale: [1.1, 1, 1.1], opacity: [0.2, 0.38, 0.2] }}
        transition={reduceMotion ? {} : { duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* HUD labels */}
      <div className="absolute top-10 left-10 hidden lg:block opacity-20 pointer-events-none">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
          <Activity size={12} /> PORTFOLIO_GRID: ACTIVE
        </div>
        <div className="mt-1 text-gray-500 font-mono text-[8px]">
          MODE: SHOWCASE / INDEX: {filteredProjects.length.toString().padStart(2, "0")}
        </div>
      </div>

      <div className="absolute bottom-10 right-10 hidden lg:block opacity-20 pointer-events-none">
        <div className="flex items-center gap-2 text-blue-400 font-mono text-[10px] tracking-[0.3em] uppercase">
          <Shield size={12} /> SECURITY_POSTURE: ON
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          custom={reduceMotion}
          className="text-center mb-14 relative"
        >
          <motion.div
            variants={itemVariants}
            custom={reduceMotion}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/18 mb-6"
          >
            <Target size={14} className="text-cyan-300" />
            <span className="text-[9px] font-mono text-cyan-300 font-black tracking-[0.34em] uppercase">
              Projects
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            custom={reduceMotion}
            className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none"
          >
            Deployed <span className="premium-gradient-text">Work</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            custom={reduceMotion}
            className="text-gray-300/75 max-w-2xl mx-auto mt-5 leading-relaxed"
          >
            A curated portfolio of security-focused and full-stack builds. Filter by category, search by tech,
            and switch views when you want a faster scan.
          </motion.p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          custom={reduceMotion}
          className="mb-10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                custom={reduceMotion}
                className="bg-black/55 border border-cyan-500/15 p-4 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-xl"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-40" />
                <span className="text-[8px] font-mono text-cyan-500/45 uppercase tracking-[0.3em] font-black mb-1">
                  {s.label}
                </span>
                <span className="text-xl font-black text-white tracking-tight mb-1">
                  {s.value}
                </span>
                <span className="text-[7px] font-mono text-cyan-300/70 font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" /> {s.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          custom={reduceMotion}
          className="mb-12"
        >
          <motion.div
            variants={itemVariants}
            custom={reduceMotion}
            className="group relative overflow-hidden bg-black/70 border border-cyan-500/18 rounded-[2.2rem] p-6 md:p-7 backdrop-blur-xl shadow-[0_0_32px_rgba(0,243,255,0.06)]"
          >
            {/* Top thin highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-cyan-400/18" />

            <div className="flex flex-col gap-5">
              {/* Row 1: pills + view toggle */}
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-cyan-300/70 font-mono text-[10px] tracking-[0.3em] uppercase">
                    <Filter size={14} className="text-cyan-300" /> Filter
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const active = filter === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setFilter(cat)}
                          className={`px-3 py-2 rounded-full border text-[10px] font-mono font-black uppercase tracking-[0.22em] transition
                            ${
                              active
                                ? "border-cyan-400/60 bg-cyan-500/10 text-white"
                                : "border-cyan-500/18 bg-black/30 text-cyan-200/60 hover:text-white hover:border-cyan-400/50"
                            }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* View toggle */}
                <div className="flex items-center gap-2 self-start lg:self-auto">
                  <span className="text-cyan-200/60 font-mono text-[10px] uppercase tracking-[0.3em]">
                    View
                  </span>

                  <div className="inline-flex rounded-full border border-cyan-500/18 bg-black/35 p-1">
                    <button
                      type="button"
                      onClick={() => setView("grid")}
                      className={`px-3 py-2 rounded-full text-[10px] font-mono font-black uppercase tracking-[0.22em] transition flex items-center gap-2
                        ${view === "grid" ? "bg-cyan-500/10 text-white" : "text-cyan-200/60 hover:text-white"}`}
                      aria-label="Grid view"
                    >
                      <Grid3X3 size={14} />
                      Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("list")}
                      className={`px-3 py-2 rounded-full text-[10px] font-mono font-black uppercase tracking-[0.22em] transition flex items-center gap-2
                        ${view === "list" ? "bg-cyan-500/10 text-white" : "text-cyan-200/60 hover:text-white"}`}
                      aria-label="List view"
                    >
                      <List size={14} />
                      List
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: search */}
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/12 rounded-2xl px-4 py-3 w-full md:w-[520px]">
                  <Search size={16} className="text-cyan-300/70" />
                  <input
                    type="text"
                    placeholder="Search by title, tech, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-500"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="p-2 rounded-xl border border-cyan-500/15 bg-black/30 text-cyan-200/60 hover:text-white hover:border-cyan-400/50 transition"
                      aria-label="Clear search"
                      title="Clear"
                    >
                      <X size={14} />
                    </button>
                  ) : null}
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-2 text-xs text-gray-300/70">
                    <Terminal size={14} className="text-cyan-300/70" />
                    <span className="font-mono uppercase tracking-widest text-[10px]">
                      Results: <span className="text-white">{filteredProjects.length}</span>
                      {activeFiltersCount ? (
                        <span className="text-cyan-200/50">
                          {" "}
                          • Filters: <span className="text-white">{activeFiltersCount}</span>
                        </span>
                      ) : null}
                    </span>
                  </div>

                  <div className="hidden md:flex items-center gap-2 text-cyan-200/50 font-mono text-[10px] uppercase tracking-[0.3em]">
                    <Sparkles size={14} className="text-cyan-300/60" />
                    Smart ranking on
                  </div>
                </div>
              </div>
            </div>

            {/* faint watermark */}
            <div className="absolute -bottom-10 -right-8 text-[110px] font-black opacity-[0.03] select-none pointer-events-none uppercase italic tracking-tighter">
              OPS
            </div>
          </motion.div>
        </motion.div>

        {/* Content */}
        {view === "grid" ? (
          <motion.div
            variants={containerVariants}
            custom={reduceMotion}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            className="grid md:grid-cols-2 gap-12 lg:gap-16"
          >
            {filteredProjects.map((p, i) => (
              <motion.div key={i} variants={itemVariants} custom={reduceMotion}>
                <ProjectCard {...p} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="space-y-5">
            {filteredProjects.map((p, i) => (
              <ProjectRow key={i} p={p} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 border border-dashed border-cyan-500/20 rounded-3xl mt-10 bg-black/30 backdrop-blur-md">
            <p className="font-mono text-cyan-200/60 uppercase tracking-[0.4em] text-sm">
              No results — try another keyword
            </p>
          </div>
        )}

        {/* Bottom CTA row (GitHub included) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          custom={reduceMotion}
          className="mt-20 flex flex-col md:flex-row items-center justify-between gap-6 rounded-[2.4rem] border border-cyan-500/12 bg-black/45 backdrop-blur-xl p-6 md:p-8"
        >
          <motion.div variants={itemVariants} custom={reduceMotion} className="text-center md:text-left">
            <p className="text-white font-semibold text-lg">Want the full list?</p>
            <p className="text-gray-300/70 text-sm max-w-xl">
              Browse my GitHub for more work, experiments, and security tooling.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            custom={reduceMotion}
            className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
          >
            <TacticalButton to="https://github.com/whyenvy77" containerClassName="w-full sm:w-auto">
              <Github size={18} className="text-cyan-300" />
              @whyenvy77
              <ExternalLink size={18} />
            </TacticalButton>

            <TacticalButton to="/contact" containerClassName="w-full sm:w-auto">
              Work With Me
            </TacticalButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
