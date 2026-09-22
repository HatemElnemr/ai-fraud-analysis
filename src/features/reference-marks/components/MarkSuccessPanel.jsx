import { FaCheck } from "react-icons/fa";
import { CyberBtn } from "../../fingerprint/components/FormFields";
import { entityTypeLabel } from "../constants";

/** Post-submit confirmation screen with the persisted row summary. */
export function MarkSuccessPanel({
  typeLabel,
  entityInfo,
  label,
  preview,
  onReset,
  onNavigate,
}) {
  const rows = [
    { k: "Type", v: typeLabel },
    { k: "Entity", v: entityInfo?.name || "—" },
    { k: "Entity Type", v: entityTypeLabel(entityInfo?.entity_type) },
    { k: "Label", v: label || "—" },
    { k: "Committed at", v: new Date().toLocaleString() },
  ];

  return (
    <div className="border border-[#5B89D4]/20 rounded bg-[#1A1E2D] p-6 sm:p-12 flex flex-col items-center gap-6 text-center shadow-[0_0_60px_rgba(91,137,212,0.04)]">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#5B89D4]/30 bg-[#5B89D4]/8 flex items-center justify-center">
        <FaCheck size={28} className="text-[#5B89D4]" />
      </div>
      <div>
        <div
          className="text-[#DDE1EC] text-lg sm:text-xl font-bold mb-2"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          {typeLabel} Registered
        </div>
        <p className="text-[#8A92A6] text-xs sm:text-sm max-w-sm">
          The {typeLabel.toLowerCase()} for{" "}
          <span className="text-[#DDE1EC] font-medium">{entityInfo?.name}</span>{" "}
          has been committed to the archive.
        </p>
      </div>

      {preview && (
        <div className="border border-[rgba(91,137,212,0.15)] rounded p-4 bg-white/5 max-w-full">
          <img
            src={preview}
            alt={`Registered ${typeLabel}`}
            className="max-h-28 sm:max-h-32 max-w-xs object-contain mx-auto"
            style={{ filter: "drop-shadow(0 0 8px rgba(91,137,212,0.2))" }}
          />
        </div>
      )}

      <div className="w-full max-w-sm bg-[#13151F] border border-[rgba(91,137,212,0.1)] rounded p-4 sm:p-5 text-left flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.k} className="flex justify-between text-xs gap-2">
            <span className="text-[#4B5563] shrink-0">{row.k}</span>
            <span
              className={`truncate ${
                row.k === "Type" || row.k === "Entity"
                  ? "text-[#5B89D4]"
                  : "text-[#DDE1EC]"
              }`}
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {row.v}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <CyberBtn onClick={onReset} outline>
          Register Another
        </CyberBtn>
        <CyberBtn onClick={() => onNavigate("upload")}>Run Analysis</CyberBtn>
      </div>
    </div>
  );
}
