/**
 * The model's explanation for its verdict (`reasoning` in the response).
 * Renders nothing when the function didn't return one.
 */
export function ReasoningCard({ message }) {
  if (!message) return null;

  return (
    <div className="bg-[#1A1E2D] border border-[rgba(91,137,212,0.07)] rounded p-4 sm:p-5">
      <div
        className="text-[#6B7280] text-[9px] uppercase tracking-[0.2em] mb-3"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        Analysis Reasoning
      </div>
      <p className="text-[#8A92A6] text-xs sm:text-sm leading-relaxed">
        {message}
      </p>
    </div>
  );
}
