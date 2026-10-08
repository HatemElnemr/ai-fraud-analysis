import { motion } from "motion/react";
import { FiAlertTriangle } from "react-icons/fi";

/**
 * Red inline banner used by both document pages to surface a validation or
 * request failure. Renders nothing when there is no message.
 */
export function ErrorBanner({ message }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-5 flex items-center gap-2 border border-red-500/20 bg-red-500/10 rounded px-4 py-3"
    >
      <FiAlertTriangle size={15} className="text-red-400 shrink-0" />
      <span className="text-red-400 text-xs font-mono">{message}</span>
    </motion.div>
  );
}
