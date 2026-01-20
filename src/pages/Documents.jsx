import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Award, Download, Eye, ArrowRight, ShieldCheck, Activity, Fingerprint, Terminal, Shield } from "lucide-react";
import NetworkBackground from "../components/NetworkBackground";
import TelemetryHUD from "../components/TelemetryHUD";
import TacticalButton from "../components/TacticalButton";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const DocumentCard = ({ title, type, date, icon: Icon, filename }) => {
    const fileSerial = useMemo(() => `SEC-${Math.random().toString(36).substring(2, 6).toUpperCase()}-X`, []);

    return (
        <motion.div
            variants={itemVariants}
            className="group relative overflow-hidden rounded-[2.5rem] border border-cyan-500/10 bg-black/40 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-700"
        >
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-cyan-400/20 group-hover:animate-scan" />

            <div className="p-10">
                <div className="flex items-start justify-between mb-8">
                    <div className="p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10 group-hover:bg-cyan-500/10 transition-all duration-500 group-hover:scale-110 shadow-[0_0_15px_rgba(0,243,255,0.05)]">
                        <Icon className="w-10 h-10 text-cyan-400" />
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="text-[9px] font-mono text-cyan-400/40 tracking-[0.2em] font-black uppercase">{fileSerial}</span>
                        </div>
                        <span className="text-[10px] font-mono font-black text-white/90 uppercase tracking-[0.2em] bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20">
                            {type}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <Fingerprint size={16} className="text-cyan-500/40" />
                    <h3 className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors leading-tight uppercase italic tracking-tighter">
                        {title}
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <TelemetryHUD label="INTEGRITY" value="100%" color="cyan" />
                    <TelemetryHUD label="CLEARANCE" value="L-7" color="blue" />
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                    <TacticalButton
                        to={`/preview/${filename}`}
                        size="sm"
                        containerClassName="flex-1"
                    >
                        <Eye size={16} className="text-cyan-400" />
                        DECRYPT_REQ
                    </TacticalButton>
                    <TacticalButton
                        to={`/documents/${filename}`}
                        size="sm"
                        containerClassName="flex-1"
                    >
                        <Download size={16} /> PULL_LOCAL
                    </TacticalButton>
                </div>
            </div>
        </motion.div>
    );
};

export default function Documents() {
    const documents = [
        {
            title: "Executive Curriculum Vitae",
            type: "PDF / CV",
            date: "Updated Jan 2026",
            icon: FileText,
            filename: "Theophilus_Agyei_CV.pdf",
        },
        {
            title: "Full-Stack Web Development",
            type: "Certification",
            date: "Dec 2025",
            icon: Award,
            filename: "Web_Dev_Cert.pdf",
        },
        {
            title: "Java Programming Excellence",
            type: "Certification",
            date: "Oct 2025",
            icon: Award,
            filename: "Java_Cert.pdf",
        },
        {
            title: "Cyber Security Fundamentals",
            type: "Certification",
            date: "Aug 2025",
            icon: Award,
            filename: "Security_Cert.pdf",
        },
    ];

    return (
        <section className="min-h-screen pt-40 pb-32 px-4 sm:px-6 lg:px-8 bg-black/40 relative overflow-hidden">
            <NetworkBackground />

            {/* Vault Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] z-20 opacity-[0.2]" />

            <div className="absolute top-10 left-10 hidden lg:block opacity-20 pointer-events-none z-10">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
                    <Activity size={12} /> VAULT_LEVEL: ALPHA_7
                </div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8"
                >
                    <div className="text-left max-w-2xl">
                        <motion.p variants={itemVariants} className="section-subtitle !mb-4 flex items-center gap-2">
                            <Shield size={14} className="text-cyan-400" /> CREDENTIAL_VAULT: Authorized
                        </motion.p>
                        <motion.h2 variants={itemVariants} className="section-title !leading-[0.85]">
                            Verified <br /> <span className="premium-gradient-text tracking-tighter shadow-glow-cyan">Clearance</span>
                        </motion.h2>
                    </div>
                    <motion.p variants={itemVariants} className="text-cyan-400/60 text-lg md:text-xl font-mono uppercase tracking-tight max-w-md text-left md:text-right border-l md:border-l-0 md:border-r border-cyan-500/30 pl-6 md:pl-0 md:pr-6 py-2">
                        Official certification logs and operational resume documentation.
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 gap-8 lg:gap-12"
                >
                    {documents.map((doc, index) => (
                        <DocumentCard key={index} {...doc} />
                    ))}
                </motion.div>

                {/* Integration Note */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-32 p-12 rounded-[3.5rem] bg-black/60 border border-cyan-500/10 text-center relative overflow-hidden group backdrop-blur-xl"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/10 transition-colors" />
                    <div className="relative z-10">
                        <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-8">
                            <Terminal size={32} className="text-cyan-400" />
                        </div>
                        <h3 className="text-4xl font-black text-white mb-4 uppercase italic tracking-tighter">Protocol: Custom_Intel_Request</h3>
                        <p className="text-cyan-400/60 font-mono text-sm mb-10 max-w-xl mx-auto uppercase tracking-widest">
                            Require specialized technical reports or project-specific documentation? Initialize a direct uplink.
                        </p>
                        <TacticalButton to="/contact">
                            Establish_Uplink <ArrowRight size={20} />
                        </TacticalButton>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
