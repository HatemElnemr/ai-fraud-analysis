import { FiClipboard } from "react-icons/fi";

/**
 * The `inputDocumentAnalysis` block of the payload: what the function
 * concluded about the *uploaded* document (type, subject, key points).
 * Renders nothing when the function returned no analysis.
 */
export function InputAnalysisCard({ analysis }) {
  if (!analysis) return null;

  return (
    <div className="border border-[rgba(91,137,212,0.12)] bg-[#1A1E2D] rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <FiClipboard size={13} className="text-[#5B89D4]" />
        <span className="text-[#DDE1EC] text-xs font-semibold uppercase tracking-wider font-mono">
          Input Document Analysis
        </span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] px-2 py-0.5 rounded border border-[#5B89D4]/25 text-[#5B89D4] bg-[#5B89D4]/10 uppercase tracking-wide font-mono">
          {analysis.doc_type}
        </span>
      </div>
      <p className="text-[#8A92A6] text-xs leading-relaxed mb-4">
        {analysis.subject}
      </p>
      <div className="space-y-2">
        {(analysis.key_points ?? []).map((pt, i) => (
          <div key={i} className="flex gap-2.5 items-start">
            <div className="w-1 h-1 rounded-full bg-[#5B89D4] mt-1.5 shrink-0" />
            <p className="text-[#6B7280] text-xs leading-relaxed">{pt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
