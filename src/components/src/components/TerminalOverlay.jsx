import React, { useState, useEffect } from "react";

const TerminalOverlay = () => {
  const [lines, setLines] = useState([]);
  const consoleOutput = [
    "Establishing encrypted tunnel...",
    "Uplink: OK [128-bit AES]",
    "Target: 10.0.2.4 (RDP:3389)",
    "Bypassing NLA... SUCCESS",
    "Grooming Heap... [||||||||--]",
    "Exploit: CVE-2019-0708 triggered",
    "Shell session 1 opened."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < consoleOutput.length) {
        setLines((prev) => [...prev, consoleOutput[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden xl:block bg-black/90 border border-green-500/20 p-4 font-mono text-[10px] text-green-500 rounded-lg shadow-2xl shadow-green-500/5 w-64 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2 border-b border-green-500/20 pb-1">
        <span className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          KERNEL_LOGGER
        </span>
        <span className="opacity-40">v2.04</span>
      </div>
      {lines.map((line, idx) => (
        <div key={idx} className="mb-1 leading-tight">
          <span className="text-green-800 mr-1">{">"}</span> {line}
        </div>
      ))}
      <div className="w-1.5 h-3 bg-green-500 animate-pulse inline-block" />
    </div>
  );
};

export default TerminalOverlay;