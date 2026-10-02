import { FaTimes } from "react-icons/fa";
import { CyberBtn } from "../../fingerprint/components/shared";

/**
 * Full-page verdict shown when the comparison comes back below the match
 * threshold — the same "not found" panel the fingerprint analysis uses.
 *
 * The Edge Function always returns its *closest* record — image, name and
 * all — even when nothing actually matched. Rendering that record would
 * imply an identity the score does not support, so this state deliberately
 * shows **no database imagery or record fields**: only the verdict, the
 * measured score, and the model's reasoning.
 *
 * `subject` names the mark in the copy ("signature" / "stamp"), and
 * `onNewAnalysis` sends the analyst back to the upload form.
 */
export function NoMatchState({
  subject = "document",
  score,
  threshold,
  timestamp,
  sessionId,
  message,
  actionLabel = "Start a New Analysis",
  onNewAnalysis,
}) {
  return (
    <div className="border border-red-500/15 bg-[#1A1E2D] rounded p-8 sm:p-14 flex flex-col items-center gap-6 text-center">
      <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center">
        <FaTimes size={30} className="text-red-400" />
      </div>

      <div>
        <div
          className="text-red-400 text-lg sm:text-2xl font-bold mb-3"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          No Match Found
        </div>
        <p className="text-[#8A92A6] text-xs sm:text-sm max-w-lg leading-relaxed">
          The uploaded {subject} did not match any record in the database.
          No identity has been verified and no reference image is shown for
          this result.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <ScoreChip
          label="Confidence Score"
          value={score === null || score === undefined ? "—" : `${score}%`}
          accent
        />
        <ScoreChip
          label="Match Threshold"
          value={
            threshold === null || threshold === undefined ? "—" : `${threshold}%`
          }
        />
      </div>

      {timestamp || sessionId ? (
        <div
          className="text-[#4B5563] text-[9px] sm:text-[10px] uppercase tracking-[0.18em]"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          {timestamp}
          {timestamp && sessionId ? " · " : ""}
          {sessionId ? `Session ${sessionId}` : ""}
        </div>
      ) : null}

      {message ? (
        <div className="w-full max-w-lg border border-[rgba(91,137,212,0.1)] bg-[#13151F] rounded p-4 text-left">
          <div
            className="text-[#4B5563] text-[9px] uppercase tracking-[0.2em] mb-2"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Analyst Notes
          </div>
          <p className="text-[#8A92A6] text-xs leading-relaxed">{message}</p>
        </div>
      ) : null}

      <CyberBtn onClick={onNewAnalysis}>{actionLabel}</CyberBtn>
    </div>
  );
}

/** Small labelled figure used for score/threshold. */
function ScoreChip({ label, value, accent = false }) {
  return (
    <div
      className={`px-4 py-3 rounded border min-w-[9rem] ${
        accent
          ? "border-red-500/20 bg-red-500/5"
          : "border-[rgba(91,137,212,0.12)] bg-[#13151F]"
      }`}
    >
      <div
        className={`${accent ? "text-red-400" : "text-[#DDE1EC]"} text-xl sm:text-2xl font-bold tabular-nums`}
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        {value}
      </div>
      <div className="text-[#4B5563] text-[8px] sm:text-[9px] uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}
