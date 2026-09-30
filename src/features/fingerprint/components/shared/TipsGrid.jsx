/** Responsive grid of small "how to get a good scan" tip cards. */
export function TipsGrid({ tips, className = "" }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${className}`}>
      {tips.map((tip) => (
        <div
          key={tip.title}
          className="bg-[#1A1E2D] border border-[rgba(91,137,212,0.07)] rounded p-3.5 sm:p-4"
        >
          <div className="text-[#5B89D4] text-base mb-1">{tip.sym}</div>
          <div className="text-[#DDE1EC] text-xs font-semibold">
            {tip.title}
          </div>
          <div className="text-[#6B7280] text-xs mt-0.5">{tip.body}</div>
        </div>
      ))}
    </div>
  );
}
