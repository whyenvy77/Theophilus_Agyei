
import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function MouseFollower() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // Smooth out the motion with spring physics
  const springConfig = { damping: 30, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Primary Glow Follower */}
      <motion.div
        className="absolute w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Tactical Crosshair */}
      <motion.div
        className="absolute w-8 h-8 flex items-center justify-center"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="absolute w-full h-[1px] bg-cyan-500/40" />
        <div className="absolute w-[1px] h-full bg-cyan-500/40" />
        <div className="w-2 h-2 border border-cyan-400/60 rounded-sm animate-pulse" />

        {/* Dynamic Coordinates */}
        <div className="absolute top-4 left-4 font-mono text-[8px] text-cyan-500/40 tracking-tighter whitespace-nowrap">
          X:{coords.x} Y:{coords.y}
        </div>
      </motion.div>

      {/* Secondary Orbiting Ring */}
      <motion.div
        className="absolute w-12 h-12 border border-cyan-500/10 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
      </motion.div>
    </div>
  );
}
