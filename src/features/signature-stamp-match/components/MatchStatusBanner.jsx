import { FaCheck, FaQuestion, FaTimes } from "react-icons/fa";

/**
 * Full-width verdict banner: icon + title, session reference, and the big
 * match score.
 *
 * Expects the object returned by `normalizeMatchResult`. `matchTitle` is the
 * mark-specific success wording ("Signature Verified" / "Stamp Verified").
 */
export function MatchStatusBanner({
  result,
  timestamp,
  sessionId,
  matchTitle = "Match Verified",
}) {
  const variants = {
    match: {
      title: matchTitle,
      icon: FaCheck,
      box: "bg-[#5B89D4]/5 border-[#5B89D4]/20 shadow-[0_0_50px_rgba(91,137,212,0.05)]",
      iconBox: "bg-[#5B89D4]/15",
      text: "text-[#5B89D4]",
    },
    "no-match": {
      title: "No Match Found",
      icon: FaTimes,
      box: "bg-red-500/5 border-red-500/20",
      iconBox: "bg-red-500/15",
      text: "text-red-400",
    },
    unknown: {
      title: "Analysis Inconclusive",
      icon: FaQuestion,
      box: "bg-amber-500/5 border-amber-500/20",
      iconBox: "bg-amber-500/15",
      text: "text-amber-400",
    },
  };

  const variant = variants[result.status] ?? variants.unknown;
  const Icon = variant.icon;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 rounded-lg border mb-6 sm:mb-8 ${variant.box}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 ${variant.iconBox}`}
        >
          <Icon size={20} className={variant.text} />
        </div>
        <div>
          <div className={`font-bold text-base sm:text-lg ${variant.text}`}>
            {variant.title}
          </div>
          <div className="text-[#6B7280] text-[10px] sm:text-xs mt-0.5 font-mono">
            {timestamp} · Session {sessionId}
          </div>
        </div>
      </div>

      <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-[rgba(91,137,212,0.1)]">
        <div
          className={`text-3xl sm:text-4xl font-bold tabular-nums ${variant.text}`}
          style={{ fontFamily: "monospace" }}
        >
          {result.score === null || result.score === undefined
            ? "N/A"
            : `${result.score}%`}
        </div>
        <div className="text-[#4B5563] text-[9px] sm:text-[10px] uppercase tracking-wider">
          Match Score · threshold {result.threshold}%
        </div>
      </div>
    </div>
  );
}
