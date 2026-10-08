import { FiBookOpen } from "react-icons/fi";
import { TbFileSearch } from "react-icons/tb";

/**
 * "Matched Record" card: the library document the function picked as the
 * closest reference, with a link that opens it from the bucket.
 * Renders nothing when the payload carries no matched document.
 */
export function MatchedRecordCard({ document }) {
  if (!document) return null;

  return (
    <div className="border border-[rgba(91,137,212,0.12)] bg-[#1A1E2D] rounded-lg p-5">
      <p className="text-[#6B7280] text-[10px] tracking-[0.2em] uppercase mb-3 font-mono">
        Matched Record
      </p>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded border border-[#5B89D4]/25 bg-[#5B89D4]/10 flex items-center justify-center shrink-0">
          <TbFileSearch size={14} className="text-[#5B89D4]" />
        </div>
        <div className="min-w-0">
          <p className="text-[#DDE1EC] text-sm font-semibold leading-tight truncate">
            {document.title}
          </p>
          <p className="text-[#5B89D4] text-[10px] mt-0.5 truncate font-mono">
            {(document.id ?? "").substring(0, 18)}…
          </p>
        </div>
      </div>
      <div className="space-y-2 border-t border-[rgba(91,137,212,0.08)] pt-3">
        {[
          ["File Type", document.file_type || "PDF"],
          [
            "Indexed",
            document.created_at
              ? new Date(document.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—",
          ],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-[#4B5563] text-[10px] font-mono">{k}</span>
            <span className="text-[#8A92A6] text-[10px] font-mono">{v}</span>
          </div>
        ))}
      </div>
      {document.document_url && (
        <a
          href={document.document_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 w-full py-2 text-[10px] border border-[rgba(91,137,212,0.2)] text-[#5B89D4] rounded hover:bg-[#5B89D4]/10 transition-colors font-mono"
        >
          <FiBookOpen size={11} />
          View Reference Document
        </a>
      )}
    </div>
  );
}
