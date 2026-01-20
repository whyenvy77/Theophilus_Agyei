import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Menu, X, ShieldCheck, Activity, Terminal } from 'lucide-react';

const mobileMenuVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", duration: 0.4, bounce: 0.2, staggerChildren: 0.06 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: { duration: 0.2 },
  },
};

const mobileLinkItem = {
  hidden: { opacity: 0, x: -25 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const location = useLocation();
  const toggleMenu = () => setIsOpen(!isOpen);

  const mouseX = useMotionValue(0);

  const links = [
    { name: "Home", path: "/" },
    { name: "Skills", path: "/skills" },
    { name: "Projects", path: "/projects" },
    { name: "Documents", path: "/documents" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [netSpeed, setNetSpeed] = useState("45.2");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollPercentage(scrolled);
    };

    const timer = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    const speedTimer = setInterval(() => {
      setNetSpeed((Math.random() * (95.0 - 10.0) + 10.0).toFixed(1));
    }, 3000);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
      clearInterval(speedTimer);
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const navHeight = isScrolled ? "py-2" : "py-4";
  const navShadow = isScrolled ? "shadow-xl shadow-cyan-500/20" : "shadow-2xl shadow-cyan-900/10";

  const spring = { type: "spring", stiffness: 200, damping: 18 };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 90, damping: 12 }}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      className={`fixed top-0 w-full z-50 border-b bg-black/95 backdrop-blur-2xl transition-all duration-500 ${navHeight} ${navShadow} ${isScrolled ? "border-cyan-500/50 shadow-[0_0_20px_rgba(0,243,255,0.1)]" : "border-cyan-500/20"
        }`}
    >
      {/* Top Edge Scanline */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-cyan-500/40 overflow-hidden">
        <div className="w-full h-full bg-[linear-gradient(90deg,transparent,rgba(0,243,255,1),transparent)] animate-[scan-horizontal_2s_linear_infinite]" />
      </div>

      {/* Decorative HUD Labels */}
      <div className="absolute bottom-1.5 left-6 hidden xl:flex items-center gap-6 opacity-40 pointer-events-none">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-[8px] tracking-[0.2em] font-black group">
          <Activity size={10} className="text-cyan-500 animate-pulse" />
          <span className="text-shadow-glow">SYSTEM_UPTIME:</span>
          <span className="text-white tabular-nums">{formatTime(sessionTime)}</span>
        </div>
        <div className="h-3 w-[1px] bg-cyan-500/30" />
        <div className="flex items-center gap-2">
          <span className="text-cyan-500/40 font-mono text-[8px] tracking-widest uppercase font-black">SIGNAL_SYNC:</span>
          <div className="flex items-end gap-[2px] h-3">
            {[1, 2, 3, 4, 5].map(i => (
              <motion.div
                key={i}
                animate={{
                  height: [4, 8, 12, 6, 10][(i + Math.floor(sessionTime)) % 5],
                  opacity: [0.4, 1, 0.7]
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-[1.5px] bg-cyan-400 shadow-[0_0_8px_rgba(0,243,255,0.4)]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side Authorization HUD */}
      <div className="absolute bottom-1.5 right-6 hidden xl:flex items-center gap-6 opacity-40 pointer-events-none font-mono text-[8px] font-black tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <span className="text-cyan-500/40">NET_SPD:</span>
          <span className="text-white tabular-nums animate-pulse">{netSpeed} MB/S</span>
        </div>
        <div className="h-3 w-[1px] bg-cyan-500/30" />
        <div className="flex items-center gap-2">
          <span className="text-cyan-500/40">DEPTH:</span>
          <span className="text-white tabular-nums">{Math.round(scrollPercentage)}%</span>
          <div className="w-16 h-1 bg-cyan-900 overflow-hidden rounded-full">
            <motion.div
              style={{ width: `${scrollPercentage}%` }}
              className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(0,243,255,0.6)]"
            />
          </div>
        </div>
        <div className="h-3 w-[1px] bg-cyan-500/30" />
        <div className="flex items-center gap-2 text-red-500 animate-pulse">
          <div className="w-1.5 h-1.5 bg-red-600 rounded-sm" />
          SEC_AUTH: LEVEL_RED
        </div>
      </div>
      {/* Glow Orb */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-40 blur-3xl"
        style={{
          background: useTransform(mouseX, (val) => `radial-gradient(400px circle at ${val}px 0px, rgba(0,243,255,0.15), transparent 70%)`)
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">

        <Link to="/">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 group"
          >
            <div className="relative">
              {/* Industrial Slug Frame */}
              <div className="absolute -inset-2 border border-cyan-500/20 rounded-xl pointer-events-none group-hover:border-cyan-400/50 transition-colors" />
              <div className="absolute -top-2 -left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 opacity-40 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -bottom-2 -right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 opacity-40 group-hover:opacity-100 transition-opacity" />

              <div className="w-12 h-12 border border-cyan-500/40 rounded-lg flex items-center justify-center bg-black shadow-[inset_0_0_15px_rgba(0,243,255,0.1)] group-hover:shadow-[inset_0_0_20px_rgba(0,243,255,0.2)] transition-all">
                <Terminal size={24} className="text-cyan-400 group-hover:animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className={`font-black cursor-pointer text-white uppercase italic tracking-tighter transition-all duration-500 group-hover:text-cyan-400 text-shadow-glow ${isScrolled ? "text-xl" : "text-3xl"
                }`}>
                T.<span className="text-cyan-400">AGYEI</span>
              </h1>
              <div className="flex items-center gap-2 -mt-1">
                <span className="text-[9px] font-mono text-cyan-500/40 tracking-[0.4em] uppercase font-black">OPS_READY</span>
                <div className="w-2 h-[1px] bg-cyan-500/30" />
                <span className="text-[7px] font-mono text-cyan-500/20 tracking-widest uppercase">STABLE_V4.0</span>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <div className="px-6 py-2 rounded-2xl bg-black/60 border-2 border-cyan-500/10 backdrop-blur-3xl flex items-center gap-8 relative overflow-hidden group/nav">
            {/* Nav Container HUD marks */}
            <div className="absolute top-0 left-4 w-4 h-[1px] bg-cyan-500/30" />
            <div className="absolute bottom-0 right-4 w-4 h-[1px] bg-cyan-500/30" />

            <div className="flex items-center gap-3 px-3 py-1 bg-cyan-500/5 rounded-lg border border-cyan-500/20 group/status cursor-default">
              <ShieldCheck size={14} className="text-cyan-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[8px] font-mono text-cyan-400 tracking-widest uppercase font-black">SEC_AUTH</span>
                <span className="text-[7px] font-mono text-white/40 group-hover/status:text-white transition-colors">LEVEL_RED</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {links.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link key={link.name} to={link.path}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={spring}
                      className="relative px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-300 group/link"
                    >
                      {active && (
                        <motion.div
                          layoutId="active-link-bg"
                          className="absolute inset-0 rounded-xl bg-cyan-500/10 border border-cyan-500/40 shadow-[0_0_25px_rgba(0,243,255,0.15)] overflow-hidden"
                          transition={spring}
                        >
                          {/* Active Scanline Overlay */}
                          <div className="absolute inset-0 pointer-events-none opacity-20">
                            <div className="w-full h-[1px] bg-cyan-400 animate-[scan_2s_linear_infinite]" />
                          </div>
                        </motion.div>
                      )}

                      <div className="relative z-10 flex flex-col items-center">
                        <span className={`font-mono text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${active ? "text-white text-shadow-glow" : "text-gray-500 group-hover/link:text-cyan-400"}`}>
                          {link.name}
                        </span>
                        {active && <motion.div layoutId="active-dot" className="w-1 h-1 bg-cyan-400 rounded-full mt-1 shadow-[0_0_8px_rgba(0,243,255,1)]" />}
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Button */}
        <motion.button
          onClick={toggleMenu}
          whileTap={{ scale: 0.9 }}
          className="md:hidden p-2 rounded-lg bg-cyan-600 text-white shadow-lg shadow-cyan-500/30"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </motion.button>
      </div>

      {/* Mobile Menu - Full Screen Terminal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/98 backdrop-blur-3xl md:hidden overflow-hidden"
          >
            {/* Terminal Grid Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #00f3ff 1px, transparent 0)`, backgroundSize: "30px 30px" }} />

            <div className="relative z-10 h-full flex flex-col p-8">
              <div className="flex justify-between items-center mb-12">
                <div className="flex flex-col">
                  <span className="text-cyan-400 font-mono text-xs font-black tracking-widest uppercase italic">THEO_AGYEI // TERMINAL_v5.0</span>
                  <span className="text-white/20 font-mono text-[8px] uppercase tracking-tighter">STATUS: REMOTE_ACCESS_ACTIVE</span>
                </div>
                <motion.button
                  onClick={toggleMenu}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-8">
                {links.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={toggleMenu}
                      className="group flex items-center gap-6"
                    >
                      <span className="text-[10px] font-mono text-cyan-900 group-hover:text-cyan-400 transition-colors">0x0{i + 1}</span>
                      <span className={`text-4xl sm:text-6xl font-black uppercase italic tracking-tighter transition-all duration-300 ${location.pathname === link.path ? "text-cyan-400 text-shadow-glow translate-x-4" : "text-white/40 group-hover:text-white group-hover:translate-x-4"}`}>
                        {link.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 border-t border-cyan-500/10 pt-8 flex items-center justify-between opacity-30">
                <div className="flex items-center gap-4 text-[8px] font-mono text-cyan-400 uppercase tracking-widest">
                  <div className="p-2 border border-cyan-500/20 bg-black">ENCRYPTED_LINE</div>
                  <span>SESSION: {formatTime(sessionTime)}</span>
                </div>
                <div className="text-[8px] font-mono text-white/50">GH_ACC_SECURITY_OPS</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav >
  );
}
