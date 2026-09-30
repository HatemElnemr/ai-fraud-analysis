import { FaCheck } from "react-icons/fa";
import { CyberBtn } from "../shared";

/** Success confirmation shown after a record has been committed. */
export function RecordSuccessPanel({
  fullName,
  recordId,
  nationality,
  insertedAt,
  onReset,
  onDone,
}) {
  const summary = [
    {
      k: "Record ID",
      v: recordId,
      valueClass: "text-[#5B89D4] truncate max-w-[60%]",
      mono: true,
    },
    {
      k: "Subject",
      v: fullName,
      valueClass: "text-[#DDE1EC] truncate max-w-[60%] text-right",
    },
    { k: "Nationality", v: nationality, valueClass: "text-[#DDE1EC]" },
    {
      k: "Inserted at",
      v: insertedAt,
      valueClass: "text-[#8A92A6] text-[10px] sm:text-xs",
      mono: true,
    },
  ];

  return (
    <div className="border border-[#5B89D4]/20 rounded bg-[#1A1E2D] p-6 sm:p-10 lg:p-12 flex flex-col items-center gap-6 text-center shadow-[0_0_60px_rgba(0,240,255,0.05)]">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#5B89D4]/30 bg-[#5B89D4]/8 flex items-center justify-center">
        <FaCheck size={26} className="text-[#5B89D4]" />
      </div>

      <div>
        <div
          className="text-[#DDE1EC] text-lg sm:text-xl font-bold mb-2"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          Record Inserted
        </div>
        <p className="text-[#8A92A6] text-xs sm:text-sm max-w-sm">
          The biometric record for{" "}
          <span className="text-[#DDE1EC] font-medium">{fullName}</span> has
          been committed to the database.
        </p>
      </div>

      <div className="w-full max-w-sm bg-[#13151F] border border-[rgba(0,240,255,0.1)] rounded p-4 sm:p-5 text-left flex flex-col gap-3">
        {summary.map((row) => (
          <div
            key={row.k}
            className="flex justify-between items-center text-xs"
          >
            <span className="text-[#4B5563] shrink-0">{row.k}</span>
            <span
              className={row.valueClass}
              style={
                row.mono ? { fontFamily: "JetBrains Mono, monospace" } : {}
              }
            >
              {row.v}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <CyberBtn onClick={onReset} outline className="w-full">
          Insert Another
        </CyberBtn>
        <CyberBtn onClick={onDone} className="w-full">
          Done
        </CyberBtn>
      </div>
    </div>
  );
}
