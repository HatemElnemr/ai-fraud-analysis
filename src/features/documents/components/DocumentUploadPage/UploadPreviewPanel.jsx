import { DocumentSVG } from "../../shared";

/**
 * Sticky right-hand preview of the document about to be stored: the
 * illustration plus the values that will be written to the `documents`
 * row (`title`, file name) and the operator behind the upload.
 */
export function UploadPreviewPanel({ title, file, userName }) {
  return (
    <div className="border border-[rgba(91,137,212,0.1)] bg-[#1A1E2D] rounded-lg p-5 sticky top-6">
      <p className="text-[#6B7280] text-[10px] tracking-[0.2em] uppercase mb-4 font-mono">
        Preview
      </p>
      <div className="flex flex-col items-center mb-4">
        <DocumentSVG size={160} />
      </div>
      <div className="space-y-2.5">
        {[
          ["Title", title || "—"],
          ["File", file?.name || "—"],
          ["Type", file?.type || "—"],
          ["Operator", userName],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3">
            <span className="text-[#4B5563] text-[10px] font-mono">{k}</span>
            <span className="text-[#8A92A6] text-[10px] text-right truncate max-w-35 font-mono">
              {v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
