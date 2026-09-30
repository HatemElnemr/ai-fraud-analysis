import { FaCheck, FaTimes, FaQuestion } from "react-icons/fa";

/**
 * Full-width verdict banner: icon + title, timestamp/session reference, and
 * the big confidence score.
 *
 * Expects the object returned by `normalizeMatchResult`.
 */
export function StatusBanner({ result, timestamp, sessionId }) {
  const { status, score, threshold } = result;

  const variant =
    status === "match"
      ? {
          title: "Match Identified",
          icon: FaCheck,
          box: "bg-[#5B89D4]/4 border-[#5B89D4]/15 shadow-[0_0_50px_rgba(91,137,212,0.05)]",
          iconBox: "bg-[#5B89D4]/12",
          text: "text-[#5B89D4]",
        }
      : status === "no-match"
        ? {
            title: "No Match Found",
            icon: FaTimes,
            box: "bg-red-500/4 border-red-500/15",
            iconBox: "bg-red-500/12",
            text: "text-red-400",
          }
        : {
            title: "Analysis Inconclusive",
            icon: FaQuestion,
            box: "bg-amber-500/4 border-amber-500/15",
            iconBox: "bg-amber-500/12",
            text: "text-amber-400",
          };

  const Icon = variant.icon;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-4 sm:py-5 rounded border mb-6 sm:mb-8 ${variant.box}`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4">
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 ${variant.iconBox}`}
        >
          <Icon size={20} className={variant.text} />
        </div>
        <div>
          <div
            className={`font-bold text-base sm:text-lg ${variant.text}`}
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            {variant.title}
          </div>
          <div
            className="text-[#6B7280] text-[9px] sm:text-[10px] mt-0.5"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            {timestamp} · Session {sessionId}
          </div>
        </div>
      </div>

      <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-[rgba(91,137,212,0.08)]">
        <div
          className={`text-3xl sm:text-4xl font-bold tabular-nums ${variant.text}`}
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          {score === null ? "—" : `${score}%`}
        </div>
        <div className="text-[#4B5563] text-[8px] sm:text-[9px] uppercase tracking-wider">
          Confidence Score · threshold {threshold}
        </div>
      </div>
    </div>
  );
}
