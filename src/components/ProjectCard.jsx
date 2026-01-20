import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Code, ExternalLink, ShieldCheck, Fingerprint } from 'lucide-react';
import TacticalButton from './TacticalButton';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
};

const DecryptImage = ({ src, alt }) => {
  const [decryptedPercent, setDecryptedPercent] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    let interval;
    if (isHovered && decryptedPercent < 100) {
      interval = setInterval(() => {
        setDecryptedPercent(prev => Math.min(prev + Math.floor(Math.random() * 10) + 5, 100));
      }, 50);
    } else if (!isHovered) {
      setDecryptedPercent(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, decryptedPercent]);

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-1000 ${decryptedPercent === 100 ? 'grayscale-0 brightness-100 scale-110' : 'grayscale brightness-50 scale-100'}`}
        style={{ filter: decryptedPercent < 100 ? `blur(${10 - decryptedPercent / 10}px)` : 'none' }}
      />

      {/* Decryption HUD Overlay */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${isHovered && decryptedPercent < 100 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/40 p-4 rounded-xl flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono text-cyan-400 font-black tracking-[0.3em] uppercase">DECRYPTING_ASSET</span>
          <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cyan-400"
              style={{ width: `${decryptedPercent}%` }}
            />
          </div>
          <span className="text-xl font-mono text-white font-black">{decryptedPercent}%</span>
        </div>
      </div>

      {/* Grid Mesh Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'linear-gradient(rgba(0,243,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
    </div>
  );
};

const ProjectCard = ({ title, description, image, link, github, tech, category, threatLevel }) => {
  const projectId = useMemo(() => `PRJ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`, []);
  const relayId = useMemo(() => `RLY-0x${Math.floor(Math.random() * 255).toString(16).toUpperCase()}.${Math.floor(Math.random() * 99)}`, []);
  const [logs, setLogs] = React.useState([]);

  // Generate simulated repository sync logs
  React.useEffect(() => {
    const logPool = [
      "HASH_VALID_0x82",
      "NODE_SYNC_COMPLETE",
      "UPLINK_ENCRYPTED",
      "SEC_PROTOCOL_v.4",
      "PAYLOAD_DELIVERED",
      "DECRYPT_SUCCESS",
      "GATEWAY_READY",
      "ROOT_ACCESS_LOGGED"
    ];

    const interval = setInterval(() => {
      const newLog = `[${new Date().toLocaleTimeString()}] ${logPool[Math.floor(Math.random() * logPool.length)]}`;
      setLogs(prev => [newLog, ...prev].slice(0, 5));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getThreatColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-500 border-red-500/30 bg-red-950/30';
      case 'LOW': return 'text-green-500 border-green-500/30 bg-green-950/30';
      default: return 'text-cyan-500 border-cyan-500/30 bg-cyan-950/30';
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      className="bg-black/90 border-2 border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,243,255,0.05)] hover:border-cyan-400 group backdrop-blur-3xl transition-all duration-700 relative"
      whileHover={{ y: -12, shadow: "0_0_50px_rgba(0,243,255,0.15)" }}
      viewport={{ once: true }}
    >
      {/* Industrial Framing Overlays */}
      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-cyan-500/40 group-hover:border-cyan-400 z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-cyan-500/40 group-hover:border-cyan-400 z-20 pointer-events-none" />

      {/* HUD Header Bar */}
      <div className="px-5 py-3 bg-black/80 border-b-2 border-cyan-500/20 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
          <span className="text-[11px] font-mono text-cyan-400 font-black tracking-[0.2em] uppercase">{projectId}</span>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded border ${getThreatColor(threatLevel)}`}>
          <ShieldCheck size={12} className="animate-pulse" />
          <span className="text-[9px] font-mono tracking-widest uppercase font-black">{threatLevel || 'AUTHORIZED'}</span>
        </div>
      </div>

      {/* Project Image with Decryption Reveal */}
      <div className="relative h-64 overflow-hidden border-b border-cyan-500/10">
        <DecryptImage src={image} alt={title} />

        {/* SYNC_LOG Terminal Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg p-3 font-mono text-[8px] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          <div className="flex justify-between items-center mb-2 border-b border-cyan-500/10 pb-1">
            <span className="text-cyan-400 font-bold tracking-widest uppercase">SYNC_LOGS</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-cyan-500/40 rounded-full" />
            </div>
          </div>
          <div className="h-20 overflow-hidden flex flex-col gap-1">
            {logs.map((log, i) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={i}
                className="text-cyan-400/70 whitespace-nowrap"
              >
                {log}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Categories Badge */}
        <div className="absolute top-4 left-4 z-20 bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 px-3 py-1 rounded font-mono text-[8px] text-cyan-400 font-black uppercase tracking-widest">
          NODE: {category || 'CORE'}
        </div>
      </div>

      <div className="p-8 relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #00f3ff 1px, transparent 0)`, backgroundSize: "20px 20px" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
              <Fingerprint size={24} className="text-cyan-400 group-hover:animate-pulse" />
            </div>
            <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter group-hover:text-cyan-400 transition-colors text-shadow-glow">
              {title}
            </h4>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono text-cyan-500/40 uppercase tracking-[0.3em] font-black">MISSION_OBJECTIVE</span>
            <div className="h-[1px] flex-1 bg-cyan-500/20" />
          </div>

          <p className="text-gray-300 mb-8 font-mono text-xs leading-relaxed uppercase tracking-tight line-clamp-3">
            {description}
          </p>

          <div className="flex justify-between items-center mb-6 px-4 py-2 bg-white/5 rounded-lg border border-white/5 font-mono text-[8px]">
            <span className="text-cyan-500/60 uppercase">RELAY_ID: <span className="text-white">{relayId}</span></span>
            <span className="text-cyan-500/60 uppercase">DENSITY: <span className="text-white">LOW_NODE</span></span>
          </div>

          {/* Technologies Used */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tech.map((t, index) => (
              <span key={index} className="px-4 py-1.5 text-[9px] font-mono font-black text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 rounded lowercase shadow-[inset_0_0_10px_rgba(0,243,255,0.1)]">
                {`# ${t}`}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <TacticalButton
              to={link}
              size="sm"
              containerClassName="flex-1"
            >
              <ExternalLink size={14} className="mr-2" /> INITIALIZE_DEMO
            </TacticalButton>
            {github && (
              <TacticalButton
                to={github}
                size="sm"
                containerClassName="flex-1"
              >
                <Code size={14} className="mr-2" /> SRC_CODE
              </TacticalButton>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default ProjectCard;
