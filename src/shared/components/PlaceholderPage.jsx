import { motion } from "motion/react";

/**
 * Lightweight stand-in for dashboard pages that are not built yet.
 * Replace individual usages in `src/App.jsx` with real pages as they land.
 */
export default function PlaceholderPage({ title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-8"
    >
      <h2
        className="text-[#F3F4F6] text-xl font-bold uppercase tracking-[0.15em]"
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        {title}
      </h2>
      {description && (
        <p
          className="mt-3 text-[#6B7280] text-sm"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
