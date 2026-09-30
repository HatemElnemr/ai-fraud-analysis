import { FaChevronDown } from "react-icons/fa";

const fieldBase =
  "w-full bg-[#13151F] border border-[rgba(0,240,255,0.18)] rounded-sm px-3 py-2.5 sm:py-3 text-[#DDE1EC] text-xs sm:text-sm placeholder:text-[#374151] focus:outline-none focus:border-[#5B89D4]/50 focus:ring-1 focus:ring-[#5B89D4]/10 transition-all";

function Label({ label, required }) {
  return (
    <label
      className="text-[#6B7280] text-[10px] uppercase tracking-[0.15em] flex items-center gap-1"
      style={{ fontFamily: "JetBrains Mono, monospace" }}
    >
      {label} {required && <span className="text-[#5B89D4]">*</span>}
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
            value ? "text-[#DDE1EC]" : "text-[#374151]"
          }`}
        >
          <option value="">Select…</option>
          {options.map((option) => (
            <option key={option} value={option} className="text-[#DDE1EC]">
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
