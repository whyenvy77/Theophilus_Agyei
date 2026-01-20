import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Code, Shield, Layers, Globe, Activity, Terminal } from "lucide-react"; // Added more icons
import NetworkBackground from "../components/NetworkBackground";

import TacticalButton from "../components/TacticalButton";

// --- FRAMER MOTION VARIANTS ---
const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7, // Slightly faster duration
            staggerChildren: 0.1, // Reduced stagger for tighter flow
            when: "beforeChildren",
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 }, // Subtle scale change, less dramatic y
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 14 }, // Softer spring physics
    },
};

// Component for a live telemetry HUD
const TelemetryHUD = ({ label, value, color = "cyan" }) => (
    <div className="flex flex-col gap-1.5 p-2 rounded bg-black/60 border border-white/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center text-[7px] font-mono font-black uppercase tracking-widest">
            <span className={color === "cyan" ? "text-cyan-400" : "text-blue-400"}>{label}</span>
            <span className="text-white">{value}</span>
        </div>
        <div className="w-full h-[2px] bg-white/5 overflow-hidden rounded-full">
            <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className={`w-1/2 h-full ${color === "cyan" ? "bg-cyan-400" : "bg-blue-400"} shadow-[0_0_8px_rgba(0,243,255,0.5)]`}
            />
        </div>
    </div>
);

// Component for a stylized feature card
const FeatureCard = ({ icon: Icon, title, description, sectorId, level, className = "" }) => (
    <motion.div
        variants={itemVariants}
        className={`bg-black/90 border border-cyan-500/30 rounded-2xl p-6 text-left backdrop-blur-3xl group transition-all duration-700 relative overflow-hidden flex flex-col justify-between shadow-[0_0_20px_rgba(0,243,255,0.05)] hover:shadow-[0_0_30px_rgba(0,243,255,0.15)] ${className}`}
    >
        {/* Industrial HUD framing */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/40 group-hover:border-cyan-400 group-hover:w-full group-hover:h-full transition-all duration-700 opacity-50 group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/40 group-hover:border-cyan-400 group-hover:w-full group-hover:h-full transition-all duration-700 opacity-50 group-hover:opacity-100" />

        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl group-hover:bg-cyan-500/20 group-hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(0,243,255,0.1)]">
                    <Icon size={24} className="text-cyan-400 group-hover:animate-pulse" />
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-mono text-cyan-400 font-black tracking-[0.3em] uppercase">{sectorId}</span>
                    <span className="text-[10px] font-mono text-white font-bold transition-colors">{level}</span>
                </div>
            </div>
            <h4 className="text-xl font-black text-white mb-3 uppercase italic tracking-tighter group-hover:text-cyan-400 transition-colors text-shadow-glow">{title}</h4>
            <p className="text-gray-300 text-[11px] leading-relaxed font-mono uppercase tracking-tight mb-6 font-medium">{description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto relative z-10">
            <TelemetryHUD label="TEMP" value="42°C" />
            <TelemetryHUD label="SYNC" value="0.98" color="blue" />
        </div>
    </motion.div>
);

export default function About() {
    // Calculate experience dynamically for professionalism
    const START_YEAR = 2022;
    const currentYear = new Date().getFullYear();
    const yearsOfExperience = currentYear - START_YEAR;

    return (
        <section
            id="about"
            className="section-container bg-black/40 relative overflow-hidden"
        >
            <NetworkBackground />

            {/* Tactical Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] z-20 opacity-[0.2]" />

            <div className="absolute top-10 left-10 hidden lg:block opacity-20 pointer-events-none z-10">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
                    <Activity size={12} /> IDENTITY_SCAN: PASS
                </div>
            </div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={sectionVariants}
                className="max-w-7xl mx-auto px-6 relative z-30"
            >
                <div className="text-center mb-16">
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                        <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
                        <span className="text-[8px] font-mono text-cyan-400 font-black tracking-[0.4em] uppercase">SECURE_PROFILE // ACCESS_v8.2</span>
                    </motion.div>
                    <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
                        The <span className="premium-gradient-text text-shadow-glow">Architect</span> <br /> Behind the Code
                    </motion.h2>
                </div>

                {/* Main Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:auto-rows-min">

                    {/* Mission Protocol - Large Block */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-8 lg:row-span-2 bg-black/90 border-2 border-cyan-500/40 rounded-3xl p-8 md:p-12 relative overflow-hidden group/bento backdrop-blur-3xl shadow-[0_0_40px_rgba(0,243,255,0.1)]"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover/bento:opacity-20 transition-opacity pointer-events-none">
                            <Terminal size={180} className="text-cyan-400" />
                        </div>

                        <div className="relative z-10 h-full flex flex-col">
                            <h3 className="text-4xl md:text-5xl font-black text-white mb-10 border-l-8 border-cyan-500 pl-8 uppercase italic tracking-tighter flex items-center gap-6">
                                MISSION_PROTOCOL
                            </h3>
                            <div className="space-y-8 max-w-3xl">
                                <p className="text-white text-2xl md:text-3xl font-mono uppercase tracking-tight leading-tight">
                                    I am <span className="text-cyan-400 font-black drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">Theophilus Agyei</span>, a professional <span className="text-white underline decoration-cyan-500 decoration-4 underline-offset-8">Security-Focused Full-Stack Developer</span>.
                                </p>
                                <p className="text-gray-200 text-sm md:text-base font-mono uppercase tracking-widest leading-relaxed font-bold">
                                    Current Directive: Engineering resilient, high-performance architectures through Zero-Trust principles and proactive threat modeling. Every line of code is a defensive node.
                                </p>
                            </div>

                            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="p-6 rounded-2xl bg-cyan-900/20 border-2 border-cyan-500/30 hover:border-cyan-400 transition-all hover:bg-cyan-900/30 group/stat">
                                    <div className="text-[9px] text-cyan-400 font-black uppercase mb-2 tracking-[0.2em]">XP_ACCUMULATED</div>
                                    <div className="text-3xl font-black text-white italic tracking-tighter group-hover:text-cyan-400 transition-colors">{yearsOfExperience}Y+</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-cyan-900/20 border-2 border-cyan-500/30 hover:border-cyan-400 transition-all hover:bg-cyan-900/30 group/stat">
                                    <div className="text-[9px] text-cyan-400 font-black uppercase mb-2 tracking-[0.2em]">NODES_HARDENED</div>
                                    <div className="text-3xl font-black text-white italic tracking-tighter group-hover:text-cyan-400 transition-colors">42+</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-cyan-900/20 border-2 border-cyan-500/30 hover:border-cyan-400 transition-all hover:bg-cyan-900/30 group/stat">
                                    <div className="text-[9px] text-cyan-400 font-black uppercase mb-2 tracking-[0.2em]">TECH_TIER</div>
                                    <div className="text-3xl font-black text-white italic tracking-tighter group-hover:text-cyan-400 transition-colors">ALPHA_0</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-cyan-900/20 border-2 border-cyan-500/30 hover:border-cyan-400 transition-all hover:bg-cyan-900/30 group/stat">
                                    <div className="text-[9px] text-cyan-400 font-black uppercase mb-2 tracking-[0.2em]">REGION</div>
                                    <div className="text-3xl font-black text-white italic tracking-tighter group-hover:text-cyan-400 transition-colors">GH_ACC</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tech Stack - Side Block */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-4 lg:row-span-3 bg-black/90 border-2 border-cyan-500/40 rounded-3xl p-10 backdrop-blur-3xl relative overflow-hidden group/stack shadow-[0_0_40px_rgba(0,243,255,0.05)]"
                    >
                        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover/stack:opacity-100 transition-opacity" />
                        <h3 className="text-3xl font-black text-white mb-10 border-b-2 border-cyan-500/20 pb-6 uppercase italic tracking-tighter flex items-center justify-between">
                            TECH_STACK <Activity size={24} className="text-cyan-400" />
                        </h3>
                        <div className="space-y-10">
                            {[
                                { label: "FRONT_END", techs: ["React", "Next.js", "Framer", "Tailwind"], status: "98%", color: "cyan" },
                                { label: "BACK_END", techs: [".NET CORE", "Node.js", "SQL", "Redis"], status: "94%", color: "blue" },
                                { label: "SECURITY", techs: ["OWASP", "Kali", "SOC2", "Penetration"], status: "88%", color: "red" },
                                { label: "DEV_OPS", techs: ["Docker", "Vercel", "GH Actions"], status: "90%", color: "green" }
                            ].map((item, i) => (
                                <div key={i} className="space-y-4 group/item">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[11px] font-mono text-cyan-400 font-black tracking-widest">{item.label}</span>
                                        <span className="text-[10px] font-mono text-white font-bold">{item.status}</span>
                                    </div>
                                    <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: item.status }}
                                            transition={{ duration: 1.5, delay: i * 0.2 }}
                                            className={`h-full bg-cyan-500 shadow-[0_0_10px_rgba(0,243,255,0.5)]`}
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {item.techs.map(t => (
                                            <span key={t} className="text-[10px] font-mono text-white font-bold px-3 py-1 border border-cyan-500/30 bg-cyan-500/5 rounded uppercase group-hover/item:border-cyan-400 group-hover:bg-cyan-500/10 transition-all">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Feature Cards Integration */}
                    <div className="lg:col-span-8 lg:row-span-1 grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
                        <FeatureCard
                            icon={Shield}
                            title="SEC_OPS"
                            description="Proactive threat mitigation at the architectural level."
                            sectorId="G-SEC"
                            level="CRIT_ALPHA"
                        />
                        <FeatureCard
                            icon={Layers}
                            title="FULL_ARC"
                            description="Full-layer integration from UI to core engines."
                            sectorId="G-ARC"
                            level="TIER_1"
                        />
                        <FeatureCard
                            icon={Zap}
                            title="PERF_OPT"
                            description="Zero-latency state and data-stream optimization."
                            sectorId="G-OPS"
                            level="OPT_MAX"
                        />
                    </div>
                </div>

                {/* Final Call to Action */}
                <motion.div variants={itemVariants} className="mt-20 flex flex-col items-center gap-8">
                    <div className="w-px h-20 bg-gradient-to-b from-transparent to-cyan-500/20" />
                    <TacticalButton to="/contact">
                        Establish Connection
                    </TacticalButton>
                </motion.div>
            </motion.div>
        </section>
    );
}