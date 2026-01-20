import React from "react";
import { motion } from "framer-motion";

const TelemetryHUD = ({ label, value, color = "cyan", className = "" }) => (
    <div className={`flex flex-col gap-1.5 p-2 rounded bg-black/60 border border-white/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] ${className}`}>
        <div className="flex justify-between items-center text-[7px] font-mono font-black uppercase tracking-widest gap-4">
            <span className={color === "cyan" ? "text-cyan-400" : "text-blue-400"}>{label}</span>
            <span className="text-white whitespace-nowrap">{value}</span>
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

export default TelemetryHUD;
