import { motion } from "motion/react";

/** Cyan primary/outline action button. */
export function CyberBtn({
  children,
  onClick,
  outline,
  className = "",
  disabled,
}) {
  const base =
    "font-orbitron font-bold text-[12px] leading-4 tracking-[1.8px] uppercase py-3 px-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const style = outline
    ? "border border-[#5B89D4]/30 text-[#5B89D4] hover:bg-[#5B89D4]/8"
    : "bg-[#5B89D4] text-[#13151F]";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      className={`${base} ${style} ${className}`}
    >
      {children}
    </motion.button>
  );
}
