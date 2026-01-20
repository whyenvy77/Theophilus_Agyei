import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Terminal, Activity, ShieldAlert, Cpu } from "lucide-react";

const socialLinks = [
  { href: "https://github.com/YourUsername", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com/in/YourProfile", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:youremail@example.com", icon: Mail, label: "Email" },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-hidden bg-black border-t-2 border-cyan-500/40 pt-24 pb-12"
    >
      {/* Industrial Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #00f3ff 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
      {/* Footer HUD Overlays */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-cyan-500/30 overflow-hidden">
        <div className="w-full h-full bg-[linear-gradient(90deg,transparent,rgba(0,243,255,0.8),transparent)] animate-[scan-horizontal_3s_linear_infinite]" />
      </div>

      {/* Vertical Data Stream Animation */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,#00f3ff_50%,transparent_100%)] bg-[length:1px_200px] animate-[scan_10s_linear_infinite] left-[10%]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,#00f3ff_50%,transparent_100%)] bg-[length:1px_150px] animate-[scan_7s_linear_infinite] left-[30%]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,#00f3ff_50%,transparent_100%)] bg-[length:1px_250px] animate-[scan_12s_linear_infinite] left-[60%]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,#00f3ff_50%,transparent_100%)] bg-[length:1px_180px] animate-[scan_8s_linear_infinite] left-[85%]" />
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

      {/* Glow Orbs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-cyan-700/10 blur-[120px] animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-blue-700/10 blur-[120px] animate-pulse" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT COLUMN: Logo, Mission Log & System Data */}
          <div className="space-y-8">
            <div className="flex flex-col gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 group cursor-default"
              >
                <div className="w-10 h-10 rounded border border-cyan-500/30 flex items-center justify-center bg-black/60 group-hover:border-cyan-400 relative">
                  <Terminal size={20} className="text-cyan-400" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full animate-ping opacity-50" />
                </div>
                <h2 className="text-white font-black text-3xl uppercase italic tracking-tighter">
                  <span className="text-cyan-400">T.</span> AGYEI <span className="text-[10px] text-cyan-500/40 not-italic ml-2 font-mono">v8.2_STABLE</span>
                </h2>
              </motion.div>

              {/* MISSION LOG TERMINAL */}
              <div className="relative group/terminal">
                <div className="absolute -inset-0.5 bg-cyan-500/20 blur opacity-20 group-hover/terminal:opacity-40 transition duration-500" />
                <div className="relative bg-black/80 border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-500/20 bg-cyan-950/20">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-500/50" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                      <div className="w-2 h-2 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-[8px] font-mono text-cyan-400 font-black tracking-widest uppercase">LIVE_MISSION_LOG — 0x82.AA</span>
                  </div>
                  <div className="p-4 h-32 overflow-hidden font-mono text-[9px] text-cyan-400/80 space-y-1.5">
                    <motion.div animate={{ y: [-100, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex gap-2 text-shadow-glow">
                          <span className="text-cyan-900">[{new Date().toLocaleTimeString()}]</span>
                          <span>UPLINK_NODE_{Math.floor(Math.random() * 999)}: PACKET_SENT_712B</span>
                        </div>
                      ))}
                      <div className="text-white/60 animate-pulse">{"> "} AGENT_ID: THEO_AGYEI INITIALIZED...</div>
                      <div className="text-green-400">{"> "} STATUS: [HANDSHAKE_COMPLETE]</div>
                      {[...Array(10)].map((_, i) => (
                        <div key={i + 10} className="flex gap-2 text-shadow-glow">
                          <span className="text-cyan-900">[{new Date().toLocaleTimeString()}]</span>
                          <span>SEC_VAULT_DECRYPT: ATTEMPT_{Math.floor(Math.random() * 10)} [SUCCESS]</span>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* SYSTEM HEALTH GRID */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-cyan-500/10 space-y-3">
                  <div className="flex justify-between items-center text-[7px] font-mono text-cyan-500/40 uppercase font-black text-shadow-glow">
                    <span>LOAD_AVG</span>
                    <span className="text-cyan-400">0.02 / 0.18</span>
                  </div>
                  <div className="w-full h-[2px] bg-cyan-950/40">
                    <motion.div animate={{ width: ["10%", "25%", "15%", "20%"] }} transition={{ duration: 3, repeat: Infinity }} className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(0,243,255,0.6)]" />
                  </div>
                  <div className="text-[7px] font-mono text-gray-500 uppercase tracking-tighter">THREAD_STATUS: ACTIVE</div>
                </div>
                <div className="p-4 rounded-xl bg-black/60 border border-cyan-500/10 space-y-3">
                  <div className="flex justify-between items-center text-[7px] font-mono text-cyan-500/40 uppercase font-black text-shadow-glow">
                    <span>SIGNAL_HOP_COUNT</span>
                    <span className="text-cyan-400">12 ms</span>
                  </div>
                  <div className="h-6 flex items-end gap-[1px]">
                    {[...Array(8)].map((_, i) => (
                      <motion.div key={i} animate={{ height: [`${Math.floor(Math.random() * 80 + 20)}%`] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-full bg-cyan-400/40 rounded-t-[1px]" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Navigation & Communication */}
          <div className="flex flex-col gap-12 lg:pl-12">
            <div className="space-y-8">
              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase border-l-2 border-cyan-500 pl-4 underline decoration-cyan-500/20 underline-offset-8">Terminal_Navigation</h3>
              <nav className="grid grid-cols-2 gap-x-12 gap-y-6">
                {["Home", "About", "Projects", "Contact", "Documents", "Skills"].map((item) => (
                  <motion.a
                    key={item}
                    href={item === "Home" ? "#" : `#${item.toLowerCase()}`}
                    className="relative group flex items-center gap-3 text-cyan-400/60 text-[11px] font-mono font-black uppercase tracking-[0.2em] hover:text-cyan-400 transition-all"
                    whileHover={{ x: 6 }}
                  >
                    <span className="w-1 h-3 bg-cyan-500/20 rounded-full group-hover:bg-cyan-50 transition-colors shadow-[0_0_8px_rgba(0,243,255,0.4)]" />
                    {item}
                  </motion.a>
                ))}
              </nav>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-mono text-cyan-500/40 uppercase tracking-[0.4em] font-black">Secure_Uplinks</h3>
              <div className="flex gap-4">
                {socialLinks.map((link, i) => (
                  <motion.a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group w-12 h-12 flex items-center justify-center rounded-xl bg-black/40 border border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-500"
                    whileHover={{ y: -5, rotate: 5, scale: 1.1 }}
                  >
                    <link.icon size={20} className="text-cyan-400 group-hover:text-white transition-colors z-10" />

                    {/* Industrial HUD markers */}
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-cyan-500/40 group-hover:border-white transition-colors" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-cyan-500/40 group-hover:border-white transition-colors" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-cyan-500/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-cyan-500/5 rounded border border-cyan-500/10">
            <ShieldAlert size={10} className="text-cyan-400" />
            <span className="text-[8px] font-mono text-cyan-400/60 tracking-tighter uppercase font-bold">ZERO_TRUST_ENABLED</span>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-cyan-500/30 text-[9px] font-mono uppercase tracking-[0.3em]"
        >
          © {new Date().getFullYear()} THEO_AGYEI — [COORD: 5.60/0.18] — OPS_READY.
        </motion.p>
      </div>
    </motion.footer>
  );
}
