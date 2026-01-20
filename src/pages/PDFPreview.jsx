import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, ArrowLeft, Download, ShieldCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function PDFPreview() {
    const { filename } = useParams();
    const navigate = useNavigate();
    const pdfUrl = `/documents/${filename}`;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col h-screen w-screen overflow-hidden"
        >
            {/* Tactical Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] z-30 opacity-[0.2]" />

            {/* Top Bar Navigation */}
            <div className="flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-cyan-500/20 z-40">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/documents")}
                        className="p-2 hover:bg-cyan-500/10 rounded-full transition-colors text-cyan-400"
                        title="Go Back"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-white font-black text-lg truncate max-w-[200px] sm:max-w-md uppercase italic tracking-tighter">
                            {filename.replace(/_/g, " ").replace(".pdf", "")}
                        </h1>
                        <p className="text-cyan-500/60 text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                            <Activity size={10} /> SECURE_PREVIEW_MODE
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href={pdfUrl}
                        download
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 rounded-lg text-xs font-mono font-black uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/10"
                    >
                        <Download size={14} />
                        <span className="hidden sm:inline">PULL_DATA</span>
                    </a>
                    <button
                        onClick={() => navigate("/documents")}
                        className="p-2 bg-black/40 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all text-cyan-400 border border-cyan-500/10 hover:border-red-500/30"
                        title="Close Preview"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* PDF Viewport */}
            <div className="flex-1 relative bg-black overflow-hidden z-20">
                <iframe
                    src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                    className="w-full h-full border-none opacity-90"
                    title="Full Screen PDF Preview"
                />

                {/* Fallback Instruction Overlay (Behind Iframe) */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center bg-black">
                    <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-6">
                        <Download className="w-8 h-8 text-cyan-400 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">Initializing_Data_Stream...</h2>
                    <p className="text-cyan-500/40 max-w-sm mb-8 font-mono text-xs uppercase tracking-tight">
                        Authenticating credentials. If the data uplink fails, ensure the asset exists in the secure vault.
                    </p>
                    <button
                        onClick={() => navigate("/documents")}
                        className="premium-button-outline"
                    >
                        BACK_TO_VAULT
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
