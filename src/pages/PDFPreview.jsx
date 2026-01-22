import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, ArrowLeft, Download, Activity, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function PDFPreview() {
  const { filename } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = React.useState("checking"); // checking | ok | missing
  const [hintVisible, setHintVisible] = React.useState(true);

  // Final robust URL logic (avoid double-encoding; route param may already be encoded)
  const baseUrl = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  let rawFilename = filename || "";
  try {
    // Route params may already be decoded; guard against malformed '%' sequences.
    rawFilename = decodeURIComponent(rawFilename);
  } catch {
    // keep raw as-is
  }
  const pdfUrl = `${baseUrl}documents/${encodeURIComponent(rawFilename)}`;

  // Check if file exists and is actually a PDF (not an HTML fallback)
  React.useEffect(() => {
    let dead = false;
    setStatus("checking");

    (async () => {
      try {
        // Use HEAD to verify existence without downloading the entire body
        const res = await fetch(pdfUrl, { method: "HEAD", cache: "no-store" });
        if (dead) return;

        const contentType = (res.headers.get("content-type") || "").toLowerCase();
        const looksLikePdf =
          contentType.includes("application/pdf") ||
          contentType.includes("application/octet-stream") ||
          rawFilename.toLowerCase().endsWith(".pdf");

        if (res.ok && looksLikePdf) {
          setStatus("ok");
        } else {
          // If HEAD fails, try a lightweight GET as a fallback (some servers are picky)
          const getRes = await fetch(pdfUrl, { method: "GET", cache: "no-store" });
          if (dead) return;
          if (getRes.ok) setStatus("ok");
          else setStatus("missing");
        }
      } catch (err) {
        if (!dead) setStatus("missing");
      }
    })();

    return () => {
      dead = true;
    };
  }, [pdfUrl]);

  // Soft hint logic (non-blocking)
  React.useEffect(() => {
    setHintVisible(true);
    const t = setTimeout(() => setHintVisible(false), 2000); // Allow more time for PDF streaming
    return () => clearTimeout(t);
  }, [pdfUrl]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col h-screen w-screen overflow-hidden"
    >
      {/* Scanline overlay (keep it UNDER the top bar) */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] z-[20] opacity-[0.2]" />

      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-cyan-500/20 z-[70]">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/documents")}
            className="p-2 hover:bg-cyan-500/10 rounded-full transition-colors text-cyan-400"
            title="Go Back"
          >
            <ArrowLeft size={24} />
          </button>

          <div>
            <h1 className="text-white font-black text-lg truncate max-w-[200px] sm:max-w-md uppercase italic tracking-tighter">
              {rawFilename.replace(/\.pdf$/i, "")}
            </h1>

            <p className="text-cyan-500/60 text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center gap-2">
              <Activity size={10} /> SECURE_PREVIEW_MODE
            </p>

            <p className="text-white/30 text-[10px] font-mono mt-1 truncate max-w-[260px] sm:max-w-xl">
              SRC: {pdfUrl}
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
            type="button"
            onClick={() => navigate("/documents")}
            className="p-2 bg-black/40 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all text-cyan-400 border border-cyan-500/10 hover:border-red-500/30"
            title="Close Preview"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Body - Boosted z-index to clear scanline overlays */}
      <div className="flex-1 relative bg-black overflow-hidden z-[50]">
        {status === "missing" && (
          <div className="absolute inset-0 z-[80] flex flex-col items-center justify-center p-8 text-center bg-black">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">
              FILE_NOT_FOUND
            </h2>
            <p className="text-white/40 max-w-md mb-6 font-mono text-xs uppercase tracking-tight">
              Put the PDF here:
              <br />
              <span className="text-cyan-400">public/documents/{rawFilename}</span>
              <br />
              Then restart <span className="text-cyan-400">npm run dev</span>.
            </p>
            <button onClick={() => navigate("/documents")} className="premium-button-outline">
              BACK_TO_VAULT
            </button>
          </div>
        )}

        {status !== "missing" && (
          <div className="absolute inset-0 w-full h-full z-50">
            {/* ✅ Multi-layered Embed Stack for Maximum Compatibility */}
            <object
              data={pdfUrl}
              type="application/pdf"
              className="w-full h-full"
            >
              <embed
                src={pdfUrl}
                type="application/pdf"
                className="w-full h-full"
              />
              <iframe
                src={pdfUrl}
                className="w-full h-full border-none"
                title="PDF Preview Fallback"
              />
            </object>

            {/* Soft hint only (does not block) */}
            {hintVisible && (
              <div className="absolute inset-0 z-[55] flex items-center justify-center pointer-events-none">
                <div className="text-cyan-400/40 font-mono text-xs uppercase tracking-widest animate-pulse">
                  Initializing_Stream…
                </div>
              </div>
            )}

            {/* While checking, show a small status badge (non-blocking) */}
            {status === "checking" && (
              <div className="absolute bottom-6 left-6 z-[60] px-4 py-2 rounded-xl bg-black/60 border border-cyan-500/20 text-cyan-300/60 font-mono text-[10px] uppercase tracking-widest">
                VERIFYING_ASSET…
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
