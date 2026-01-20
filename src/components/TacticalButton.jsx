import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const TacticalButton = ({
    to,
    onClick,
    children,
    className = "",
    containerClassName = "",
    type = "button",
    isLink = true,
    size = "md" // "sm", "md", "lg"
}) => {
    const sizeClasses = {
        sm: "px-6 py-2 text-[10px]",
        md: "px-12 py-4 text-base",
        lg: "px-16 py-6 text-xl"
    };

    const content = (
        <div className={`relative ${sizeClasses[size]} bg-black rounded-xl font-black text-white italic tracking-tighter uppercase transition-colors group-hover:bg-cyan-500/5 flex items-center justify-center gap-2 ${className}`}>
            {children}
        </div>
    );

    const buttonProps = {
        className: `relative group p-[2px] rounded-xl overflow-hidden transition-transform active:scale-95 ${containerClassName}`,
        onClick
    };

    const gradientOverlay = (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 animate-[spin_3s_linear_infinite] opacity-30 group-hover:opacity-100 transition-opacity" />
    );

    if (isLink && to) {
        const isExternal = to.startsWith('http') || to.startsWith('mailto') || to.startsWith('tel');

        if (isExternal) {
            return (
                <a href={to} {...buttonProps} target={to.startsWith('http') ? "_blank" : "_self"} rel={to.startsWith('http') ? "noopener noreferrer" : ""}>
                    {gradientOverlay}
                    {content}
                </a>
            );
        }

        return (
            <Link to={to} {...buttonProps}>
                {gradientOverlay}
                {content}
            </Link>
        );
    }

    return (
        <button type={type} {...buttonProps}>
            {gradientOverlay}
            {content}
        </button>
    );
};

export default TacticalButton;
