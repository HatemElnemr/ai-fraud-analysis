import { FaTimes } from "react-icons/fa";
import { TbFileSearch } from "react-icons/tb";

/**
 * Verdict panel shown when the comparison comes back below the match
 * threshold — the document version of the fingerprint/signature
 * "No Match Found" screen.
 *
 * `compare-documents` always returns its *closest* library document, even
 * when nothing actually matched. Rendering that record would imply a
 * provenance the score does not support, so this state deliberately shows
 * **no reference record fields**: only the verdict, the measured
 * similarity, and the function's own explanation.
 *
 * `subject` names what was analysed (defaults to "document"), `message`
 * carries the analyst-facing notes (`summary` from the payload fits here),
 * and `onNewAnalysis` sends the analyst back to the upload form.
 */
export function NoMatchState({
  subject = "document",
  score,
  threshold,
  fileName,
  timestamp,
  message,
  onNewAnalysis,
}) {
  return (
    <div className="border border-red-500/15 bg-[#1A1E2D] rounded-lg p-8 sm:p-14 flex flex-col items-center gap-6 text-center">
      <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center">
        <FaTimes size={30} className="text-[#EF4444]" />
      </div>

      <div>
        <p className="text-[#EF4444] text-[10px] tracking-[0.25em] uppercase font-mono mb-2">
          Comparison Verdict
        </p>
        <h2 className="text-[#DDE1EC] text-xl sm:text-2xl font-bold mb-3 tracking-wide">
          No Match Found
        </h2>
        <p className="text-[#8A92A6] text-xs sm:text-sm max-w-lg leading-relaxed">
          The uploaded {subject} did not match any record in the library.
          No reference document has been verified, so none is shown for this
          result.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <ScoreChip
          label="Similarity Score"
          value={
            score === null || score === undefined ? "—" : `${score}%`
          }
          accent
        />
        <ScoreChip
          label="Match Threshold"
          value={
            threshold === null || threshold === undefined
              ? "—"
              : `${threshold}%`
          }
        />
      </div>

      {fileName || timestamp ? (
        <div
          className="text-[#4B5563] text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-mono break-all"
          title={fileName || undefined}
        >
          {fileName}
          {fileName && timestamp ? " · " : ""}
          {timestamp}
        </div>
      ) : null}

      {message ? (
        <div className="w-full max-w-lg border border-[rgba(91,137,212,0.1)] bg-[#13151F] rounded-lg p-4 text-left">
          <div className="text-[#4B5563] text-[9px] uppercase tracking-[0.2em] mb-2 font-mono">
            Analyst Notes
          </div>
          <p className="text-[#8A92A6] text-xs leading-relaxed">{message}</p>
        </div>
      ) : null}

      <button
        onClick={onNewAnalysis}
        className="py-3 px-6 bg-[#5B89D4] hover:bg-[#6A96DB] text-[#13151F] font-bold text-xs uppercase tracking-wider rounded transition-colors inline-flex items-center justify-center gap-2 font-mono"
      >
        <TbFileSearch size={15} />
        Start a New Analysis
      </button>
    </div>
  );
}

/** Small labelled figure used for score/threshold. */
function ScoreChip({ label, value, accent = false }) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border min-w-[9rem] ${
        accent
          ? "border-red-500/20 bg-red-500/5"
          : "border-[rgba(91,137,212,0.12)] bg-[#13151F]"
      }`}
    >
      <div
        className={`${accent ? "text-[#EF4444]" : "text-[#DDE1EC]"} text-xl sm:text-2xl font-bold tabular-nums font-mono`}
      >
        {value}
      </div>
      <div className="text-[#4B5563] text-[8px] sm:text-[9px] uppercase tracking-wider mt-1 font-mono">
        {label}
      </div>
    </div>
  );
}
