import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const TacticalButton = ({
  to,
  onClick,
  children,
  className = "",
  containerClassName = "",
  type = "button",
  isLink = true,
  size = "md", // "sm", "md", "lg"
  download = false,
  ariaLabel,
}) => {
  const reduceMotion = useReducedMotion?.() ?? false;

  const sizeClasses = {
    sm: "px-6 py-2 text-[10px]",
    md: "px-10 py-3.5 text-sm md:text-base",
    lg: "px-14 py-5 text-lg",
  };

  const content = (
    <div
      className={[
        "relative",
        sizeClasses[size],
        "rounded-2xl",
        "bg-black/80",
        "font-black italic uppercase tracking-tighter",
        "text-white",
        "flex items-center justify-center gap-2",
        "transition-all duration-300",
        "group-hover:bg-cyan-500/10",
        "group-hover:text-white",
        "backdrop-blur-md",
        "border border-cyan-500/10",
        "group-hover:border-cyan-400/25",
        className,
      ].join(" ")}
    >
      {/* subtle inner highlight */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 via-transparent to-transparent opacity-60" />

      {children}
    </div>
  );

  const wrapperClassName = [
    "relative group",
    "p-[2px] rounded-2xl overflow-hidden",
    "transition-transform active:scale-95",
    "focus-within:ring-2 focus-within:ring-cyan-500/50 focus-within:ring-offset-2 focus-within:ring-offset-black/40",
    containerClassName,
  ].join(" ");

  // Gradient border + animated spin (reduced motion safe)
  const gradientOverlay = (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 opacity-40 group-hover:opacity-100 transition-opacity"
      animate={reduceMotion ? undefined : { rotate: 360 }}
      transition={reduceMotion ? undefined : { duration: 3, repeat: Infinity, ease: "linear" }}
    />
  );

  // “Scanline shimmer” effect on hover
  const scanline = (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    >
      <div className="absolute -left-1/2 top-0 h-full w-[200%] bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.15),transparent)] translate-x-[-40%] group-hover:translate-x-[40%] transition-transform duration-700" />
    </div>
  );

  const buttonProps = {
    className: wrapperClassName,
    onClick,
    ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
  };

  // Decide external / internal
  const isFile = typeof to === "string" && /\.(pdf|zip|doc|docx|png|jpg|jpeg|svg)$/i.test(to);
  const isInternalPreview = typeof to === "string" && to.startsWith("/preview/");
  const isHttp = typeof to === "string" && to.startsWith("http");
  const isMail = typeof to === "string" && to.startsWith("mailto:");
  const isTel = typeof to === "string" && to.startsWith("tel:");
  const isExternal = !!to && (isHttp || isMail || isTel || isFile) && !isInternalPreview;

  if (isLink && to) {
    if (isExternal) {
      return (
        <a
          href={to}
          {...buttonProps}
          target={isHttp ? "_blank" : "_self"}
          rel={isHttp ? "noopener noreferrer" : undefined}
          {...(download
            ? { download: typeof download === "string" ? download : true }
            : {})}
        >
          {gradientOverlay}
          {scanline}
          {content}
        </a>
      );
    }

    return (
      <Link to={to} {...buttonProps}>
        {gradientOverlay}
        {scanline}
        {content}
      </Link>
    );
  }

  return (
    <button type={type} {...buttonProps}>
      {gradientOverlay}
      {scanline}
      {content}
    </button>
  );
};

export default TacticalButton;
