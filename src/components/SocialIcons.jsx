import React from "react";
import { motion } from "framer-motion";

// You'll need to install the corresponding icon library (e.g., react-icons or use Font Awesome CDN)
// Assuming Font Awesome is loaded globally for the original icon classes (fab, fas).
// For a fully professional build, consider using a React-specific icon library.

const socialLinks = [
  { href: "https://github.com/yourusername", iconClass: "fab fa-github", label: "GitHub" },
  { href: "https://linkedin.com/in/yourusername", iconClass: "fab fa-linkedin-in", label: "LinkedIn" },
  { href: "mailto:theophilus@example.com", iconClass: "fas fa-envelope", label: "Email" },
];

export default function SocialIcons() {
  return (
    <div className="flex gap-6 mt-8 justify-center md:justify-start">
      {socialLinks.map((link) => (
        <motion.a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
          whileHover={{ scale: 1.2, y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <i className={`${link.iconClass} text-3xl`}></i>
        </motion.a>
      ))}
    </div>
  );
}