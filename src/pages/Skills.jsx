import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
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
} from "react-icons/si";
import { FaDatabase, FaShieldAlt, FaUserSecret, FaBug, FaLock } from "react-icons/fa";
import {
  Activity,
  Shield,
  Target,
  Terminal,
  Search,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import NetworkBackground from "../components/NetworkBackground";

/** ---------------- Motion ---------------- */
const container = {
  hidden: { opacity: 0 },
  visible: (reduce) => ({
    opacity: 1,
    transition: reduce ? { duration: 0.2 } : { staggerChildren: 0.1, delayChildren: 0.12 },
  }),
};

const sectionIn = {
  hidden: { opacity: 0, y: 18 },
  visible: (reduce) => ({
    opacity: 1,
    y: 0,
    transition: reduce ? { duration: 0.2 } : { type: "spring", stiffness: 110, damping: 18 },
  }),
};

const cardIn = {
  hidden: { opacity: 0, y: 16, scale: 0.99 },
  visible: (reduce) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: reduce ? { duration: 0.2 } : { type: "spring", stiffness: 130, damping: 18 },
  }),
};

/** ---------------- Helpers ---------------- */
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function stableHash(seed = "x") {
  // stable-ish, changes every hour (avoids Math.random() in render)
  const hour = Math.floor(Date.now() / (1000 * 60 * 60));
  const input = `${seed}::${hour}`;
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).toUpperCase().slice(0, 8);
}

function formatTier(level) {
  if (level >= 92) return { label: "ELITE", hint: "High confidence" };
  if (level >= 85) return { label: "ADVANCED", hint: "Strong capability" };
  if (level >= 75) return { label: "PROFICIENT", hint: "Solid working level" };
  return { label: "FOUNDATION", hint: "Growing skill" };
}

function average(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

/** ---------------- Data ---------------- */
const categories = [
  {
    key: "SECURITY",
    title: "Security & Ethical Hacking",
    subtitle: "Defensive mindset, real-world testing, and OWASP-aligned workflows.",
    icon: FaLock,
    skills: [
      { name: "Penetration Testing", icon: FaUserSecret, level: 88 },
      { name: "Network Security", icon: FaShieldAlt, level: 92 },
      { name: "Vulnerability Assessment", icon: FaBug, level: 85 },
      { name: "Web App Security (OWASP)", icon: SiWireshark, level: 82 },
      { name: "Kali Linux", icon: SiKalilinux, level: 90 },
    ],
  },
  {
    key: "FRONTEND",
    title: "Frontend Development",
    subtitle: "Modern interfaces, smooth motion, and responsive UI systems.",
    icon: Target,
    skills: [
      { name: "React", icon: SiReact, level: 92 },
      { name: "Tailwind CSS", icon: SiTailwindcss, level: 96 },
      { name: "JavaScript (ES6+)", icon: SiJavascript, level: 89 },
      { name: "HTML5", icon: SiHtml5, level: 97 },
      { name: "CSS3", icon: SiCss3, level: 94 },
    ],
  },
  {
    key: "BACKEND",
    title: "Backend & APIs",
    subtitle: "Reliable services, clean API design, and scalable patterns.",
    icon: Terminal,
    skills: [
      { name: "ASP.NET Core (C#)", icon: SiDotnet, level: 83 },
      { name: "Node.js", icon: SiNodedotjs, level: 79 },
      { name: "Express.js", icon: SiExpress, level: 77 },
    ],
  },
  {
    key: "TOOLS",
    title: "Databases & Tooling",
    subtitle: "Data modeling, version control, and practical dev workflows.",
    icon: FaDatabase,
    skills: [
      { name: "SQL Server", icon: FaDatabase, level: 86 },
      { name: "MongoDB", icon: SiMongodb, level: 72 },
      { name: "Git", icon: SiGit, level: 91 },
      { name: "GitHub", icon: SiGithub, level: 90 },
    ],
  },
];

/** Flatten once (for search + stats) */
function useAllSkills() {
  return useMemo(() => {
    return categories.flatMap((c) =>
      c.skills.map((s) => ({
        ...s,
        categoryKey: c.key,
        categoryTitle: c.title,
      }))
    );
  }, []);
}

/** ---------------- Small UI ---------------- */
function MetricPill({ label, value, icon: Icon }) {
  return (
    <div className="px-4 py-3 rounded-2xl bg-black/55 border border-cyan-500/12 backdrop-blur-xl flex items-center gap-3">
      <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/12">
        <Icon size={14} className="text-cyan-300" />
      </div>
      <div className="leading-tight">
        <div className="text-[9px] font-mono font-black uppercase tracking-[0.28em] text-cyan-200/55">
          {label}
        </div>
        <div className="mt-0.5 text-white font-black tracking-tight">{value}</div>
      </div>
    </div>
  );
}

function FilterChip({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-full border text-[10px] font-mono font-black uppercase tracking-[0.22em] transition
        ${
          active
            ? "border-cyan-400/60 bg-cyan-500/10 text-white"
            : "border-cyan-500/18 bg-black/30 text-cyan-200/60 hover:text-white hover:border-cyan-400/50"
        }`}
    >
      {label}
    </button>
  );
}

function SkillCard({ skill }) {
  const reduce = useReducedMotion();
  const { label: tierLabel } = formatTier(skill.level);
  const Icon = skill.icon;

  const meta = useMemo(() => {
    const hash = stableHash(`${skill.categoryKey}|${skill.name}`);
    const rev = `v${hash.slice(0, 2)}.${hash.slice(2, 3)}`;
    const stability = `0.${hash.slice(3, 4)}${hash.slice(4, 5)}`;
    return { rev, stability, hash };
  }, [skill.categoryKey, skill.name]);

  return (
    <motion.div
      variants={cardIn}
      custom={reduce}
      whileHover={reduce ? {} : { y: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="group relative overflow-hidden rounded-3xl bg-black/60 border border-cyan-500/12 hover:border-cyan-400/55 backdrop-blur-2xl
                 shadow-[0_0_34px_rgba(0,243,255,0.05)] hover:shadow-[0_0_58px_rgba(0,243,255,0.12)]"
    >
      {/* top highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-cyan-400/18" />

      {!reduce && (
        <motion.div
          initial={{ x: "-120%" }}
          animate={{ x: "120%" }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 h-[1px] w-1/3 bg-gradient-to-r from-transparent via-cyan-400/55 to-transparent opacity-0 group-hover:opacity-100"
        />
      )}

      {/* ambient glow */}
      <div className="absolute -top-28 -right-28 w-80 h-80 rounded-full bg-cyan-500/10 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="p-7 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="p-3 rounded-2xl bg-cyan-500/8 border border-cyan-500/14 group-hover:bg-cyan-500/12 group-hover:border-cyan-400/45 transition-all">
              <Icon className="w-7 h-7 text-cyan-300" />
            </div>

            <div className="min-w-0">
              <div className="text-[9px] font-mono font-black uppercase tracking-[0.22em] text-cyan-200/55">
                {skill.categoryKey} • {tierLabel} • {meta.rev}
              </div>

              <div className="mt-1 text-white font-black tracking-tight text-lg uppercase italic truncate">
                {skill.name}
              </div>

              <div className="mt-2 text-[10px] font-mono uppercase tracking-[0.22em] text-cyan-200/40">
                ID {meta.hash.slice(0, 6)} • STB {meta.stability}
              </div>
            </div>
          </div>

          <div className="shrink-0 text-[10px] font-mono font-black uppercase tracking-[0.22em] text-cyan-200/70 bg-cyan-500/10 border border-cyan-500/18 px-3 py-1.5 rounded-full">
            {skill.level}%
          </div>
        </div>

        {/* progress */}
        <div className="mt-6">
          <div className="flex items-end justify-between">
            <span className="text-[9px] font-mono uppercase tracking-[0.28em] text-gray-400/70 font-black">
              Proficiency
            </span>
            <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-cyan-200/45">
              VERIFIED
            </span>
          </div>

          <div className="mt-3 h-[7px] rounded-full bg-white/5 overflow-hidden border border-cyan-500/10">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${clamp(skill.level, 0, 100)}%` }}
              viewport={{ once: true }}
              transition={reduce ? { duration: 0.2 } : { duration: 1.15, ease: "easeOut" }}
              className="h-full bg-cyan-400/70 shadow-[0_0_12px_rgba(0,243,255,0.6)]"
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.24em]">
            <span className="text-cyan-200/45 flex items-center gap-2">
              <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
              READY
            </span>
            <span className="text-cyan-200/35">{tierLabel}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** ---------------- Page ---------------- */
export default function Skills() {
  const reduce = useReducedMotion();
  const allSkills = useAllSkills();

  const [filter, setFilter] = useState("ALL"); // ALL | SECURITY | FRONTEND | BACKEND | TOOLS
  const [query, setQuery] = useState("");

  const filters = useMemo(
    () => ["ALL", ...categories.map((c) => c.key)],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allSkills.filter((s) => {
      const matchesFilter = filter === "ALL" || s.categoryKey === filter;
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.categoryTitle.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [allSkills, filter, query]);

  const totals = useMemo(() => {
    const avg = average(filtered.map((s) => s.level));
    const elite = filtered.filter((s) => s.level >= 92).length;
    return { count: filtered.length, avg, elite };
  }, [filtered]);

  // group for display (keeps the category layout)
  const grouped = useMemo(() => {
    const byCat = new Map();
    for (const s of filtered) {
      if (!byCat.has(s.categoryKey)) byCat.set(s.categoryKey, []);
      byCat.get(s.categoryKey).push(s);
    }
    return byCat;
  }, [filtered]);

  return (
    <section id="skills" className="relative w-full bg-black/40 py-28 overflow-hidden">
      <NetworkBackground />

      {/* subtle scanline */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px] z-20 opacity-[0.12]" />

      {/* ambient glows */}
      <motion.div
        className="absolute -top-56 -right-56 w-[620px] h-[620px] bg-cyan-600/12 blur-[190px] rounded-full"
        animate={reduce ? {} : { y: [0, -30, 0], opacity: [0.22, 0.34, 0.22] }}
        transition={reduce ? {} : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-56 -left-56 w-[620px] h-[620px] bg-blue-600/12 blur-[190px] rounded-full"
        animate={reduce ? {} : { y: [0, 30, 0], opacity: [0.2, 0.32, 0.2] }}
        transition={reduce ? {} : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* HUD label */}
      <div className="absolute top-10 left-10 hidden lg:block opacity-25 pointer-events-none z-10">
        <div className="flex items-center gap-2 text-cyan-300 font-mono text-[10px] tracking-[0.3em] uppercase">
          <Activity size={12} /> SKILLS: VERIFIED
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          custom={reduce}
          className="text-center"
        >
          <motion.div
            variants={sectionIn}
            custom={reduce}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/18 mb-5"
          >
            <Sparkles size={14} className="text-cyan-300" />
            <span className="text-[9px] font-mono text-cyan-300 font-black tracking-[0.34em] uppercase">
              Skills Inventory
            </span>
          </motion.div>

          <motion.h2
            variants={sectionIn}
            custom={reduce}
            className="text-5xl md:text-7xl font-black tracking-tight text-white uppercase italic leading-[0.92]"
          >
            Skills <span className="premium-gradient-text">Matrix</span>
          </motion.h2>

          <motion.p
            variants={sectionIn}
            custom={reduce}
            className="mt-4 text-gray-300/75 max-w-2xl mx-auto leading-relaxed"
          >
            Security-first engineering with modern web stacks — designed for real production work.
          </motion.p>

          {/* Metrics */}
          <motion.div
            variants={sectionIn}
            custom={reduce}
            className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto"
          >
            <MetricPill icon={Shield} label="Total Skills" value={String(totals.count)} />
            <MetricPill icon={Target} label="Average Level" value={`${totals.avg}%`} />
            <MetricPill icon={Terminal} label="Elite Skills" value={String(totals.elite)} />
          </motion.div>
        </motion.div>

        {/* Controls (filter + search) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={container}
          custom={reduce}
          className="mt-12"
        >
          <motion.div
            variants={sectionIn}
            custom={reduce}
            className="bg-black/60 border border-cyan-500/12 rounded-3xl p-5 md:p-6 backdrop-blur-xl shadow-[0_0_28px_rgba(0,243,255,0.06)]"
          >
            <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-cyan-200/60 font-mono text-[10px] tracking-[0.3em] uppercase">
                  <SlidersHorizontal size={14} className="text-cyan-300" />
                  Filter
                </div>

                <div className="flex flex-wrap gap-2">
                  {filters.map((k) => (
                    <FilterChip
                      key={k}
                      label={k}
                      active={filter === k}
                      onClick={() => setFilter(k)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/12 rounded-2xl px-4 py-3 w-full lg:w-[420px]">
                <Search size={16} className="text-cyan-300/70" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search skills (e.g. React, OWASP, Git...)"
                  className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-300/70">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-cyan-300/70" />
                <span className="font-mono uppercase tracking-widest text-[10px]">
                  Results: <span className="text-white">{filtered.length}</span>
                </span>
              </div>
              <span className="font-mono uppercase tracking-widest text-[10px] hidden sm:block">
                Tip: filter then search
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Sections by category (still professional) */}
        <motion.div
          variants={container}
          custom={reduce}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          className="mt-14 space-y-16"
        >
          {categories.map((cat) => {
            const list = grouped.get(cat.key) || [];
            if (list.length === 0) return null;

            const CatIcon = cat.icon;

            return (
              <motion.div key={cat.key} variants={sectionIn} custom={reduce} className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/18">
                      <CatIcon className="text-cyan-300 w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                        {cat.title}
                      </h3>
                      <p className="mt-2 text-gray-300/70 leading-relaxed max-w-2xl">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-2 text-cyan-200/40 font-mono uppercase tracking-[0.24em] text-[10px]">
                    <Shield size={14} className="text-cyan-300/60" />
                    VERIFIED • PRODUCTION-READY
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                  {list.map((s) => (
                    <SkillCard key={`${cat.key}-${s.name}`} skill={s} />
                  ))}
                </div>
              </motion.div>
            );
          })}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-20 border border-dashed border-cyan-500/20 rounded-3xl bg-black/30 backdrop-blur-md">
              <p className="font-mono text-cyan-200/60 uppercase tracking-[0.4em] text-sm">
                No results — try another keyword
              </p>
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-20"
        >
          <Link to="/contact">
            <button className="px-10 py-4 text-base md:text-lg font-black rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-[0_0_34px_rgba(0,243,255,0.35)] transition-all inline-flex items-center gap-3">
              Let’s Work Together <ArrowRight size={18} />
            </button>
          </Link>

          <div className="mt-4 text-gray-300/60 text-sm">
            Want a role-specific breakdown? I can tailor it for your job application.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
