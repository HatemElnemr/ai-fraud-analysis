import { motion } from "motion/react";
import { FaChevronDown } from "react-icons/fa";

/** Decorative background grid. */
export function GridBg() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.35]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,240,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.06) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
  );
}

/** Section heading with the small cyan accent bar. */
export function SectionHeading({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-1 h-3 bg-[#00F0FF] rounded-sm" />
      <h3
        className="text-[#F3F4F6] text-[11px] uppercase tracking-[0.18em]"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        {children}
      </h3>
    </div>
  );
}

const fieldBase =
  "w-full bg-[#030712] border border-[rgba(0,240,255,0.18)] rounded-sm px-3 py-2.5 sm:py-3 text-[#F3F4F6] text-xs sm:text-sm placeholder:text-[#374151] focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/10 transition-all";

function Label({ label, required }) {
  return (
    <label
      className="text-[#6B7280] text-[10px] uppercase tracking-[0.15em] flex items-center gap-1"
      style={{ fontFamily: "JetBrains Mono, monospace" }}
    >
      {label} {required && <span className="text-[#00F0FF]">*</span>}
    </label>
  );
}

/** Standard text/date input with label. */
export function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label label={label} required={required} />
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={fieldBase}
      />
    </div>
  );
}

/** Select input with label. */
export function SelectField({ label, value, onChange, options, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label label={label} required={required} />
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${fieldBase} appearance-none pr-8 cursor-pointer ${
            value ? "text-[#F3F4F6]" : "text-[#374151]"
          }`}
        >
          <option value="">Select…</option>
          {options.map((option) => (
            <option key={option} value={option} className="text-[#F3F4F6]">
              {option}
            </option>
          ))}
        </select>
        <FaChevronDown
          size={10}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563]"
        />
      </div>
    </div>
  );
}

/** Multi-line input with label. */
export function TextareaField({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label label={label} />
      <textarea
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldBase} resize-none`}
      />
    </div>
  );
}

/** Inline error banner. */
export function ErrorBanner({ msg }) {
  return (
    <div className="border border-[#EF4444]/30 bg-[#EF4444]/5 rounded px-4 py-3 text-[#EF4444] text-xs">
      {msg}
    </div>
  );
}

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
    ? "border border-[#00F0FF]/30 text-[#00F0FF] hover:bg-[#00F0FF]/8"
    : "bg-[#00F0FF] text-[#030712]";
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

/** Animated fingerprint glyph; `scanning` adds a sweep line. */
export function FingerprintSVG({
  size = 80,
  scanning = false,
  className = "",
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="fpGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.3" />
        </linearGradient>
        {scanning && (
          <linearGradient id="fpScan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0" />
            <stop offset="50%" stopColor="#00F0FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
          </linearGradient>
        )}
      </defs>
      {[18, 26, 34, 42].map((r) => (
        <ellipse
          key={r}
          cx="50"
          cy="55"
          rx={r * 0.75}
          ry={r}
          stroke="url(#fpGrad)"
          strokeWidth="1.2"
        />
      ))}
      <path
        d="M28 38 Q50 20 72 38"
        stroke="url(#fpGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M24 30 Q50 6 76 30"
        stroke="url(#fpGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {scanning ? (
        <motion.rect
          x="0"
          width="100"
          height="12"
          fill="url(#fpScan)"
          initial={{ y: 10 }}
          animate={{ y: 90 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <circle cx="50" cy="55" r="3" fill="#00F0FF" />
      )}
    </svg>
  );
}
