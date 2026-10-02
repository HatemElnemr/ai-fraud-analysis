/**
 * Side-by-side "Uploaded Query vs Archive" panels plus the colour legend.
 *
 * The query side shows the image the analyst uploaded. The archive side shows
 * the matching overlay — `matchImage` from the response when the function
 * returns one, otherwise the mark-specific SVG passed as `children`. The
 * heading reflects the verdict: the function reports its *closest* record, so
 * a below-threshold candidate is labelled "Closest Candidate", not "Best
 * Match", and a payload without a record is labelled "No Candidate".
 */
export function SampleComparison({
  result,
  queryPreview,
  queryFileName,
  matchImage,
  legend = [],
  children,
}) {
  const hasRecord = Boolean(result.archiveRecord);
  const isMatch = result.status === "match";

  const matchHeading = !hasRecord
    ? "No Candidate"
    : isMatch
      ? "Best Match"
      : "Closest Candidate";
  const matchCaption = !hasRecord
    ? "Nothing returned"
    : isMatch
      ? "Archive Record Overlay"
      : "Below threshold · not a match";

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Uploaded sample */}
        <div className="bg-[#1A1E2D] border border-[rgba(91,137,212,0.08)] rounded-lg p-4 sm:p-5 flex flex-col items-center gap-3">
          <div className="text-[#4B5563] text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-mono">
            Uploaded Query
          </div>
          <div className="w-full rounded border border-[rgba(255,255,255,0.08)] bg-white flex items-center justify-center p-3 min-h-30">
            {queryPreview && (
              <img
                src={queryPreview}
                alt={
                  queryFileName
                    ? `Uploaded sample: ${queryFileName}`
                    : "Uploaded sample"
                }
                className="max-h-28 max-w-full object-contain"
              />
            )}
          </div>
          <div className="text-[#4B5563] text-[9px] uppercase tracking-wider font-mono">
            Uploaded Sample
          </div>
        </div>

        {/* Archive side: SVG overlay or the record image when returned */}
        <div className="bg-[#1A1E2D] border border-[#5B89D4]/20 rounded-lg p-4 sm:p-5 flex flex-col items-center gap-3 shadow-[0_0_30px_rgba(91,137,212,0.06)]">
          <div className="text-[#5B89D4] text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-mono">
            {matchHeading}
          </div>
          <div className="flex items-center justify-center flex-1 w-full py-2 min-h-30">
            {matchImage ? (
              <img
                src={matchImage}
                alt="Best matching archive record"
                className="max-h-36 max-w-full object-contain rounded border border-[rgba(91,137,212,0.2)] bg-white p-2"
              />
            ) : (
              children
            )}
          </div>
          <div className="text-[#5B89D4]/60 text-[9px] uppercase tracking-wider font-mono">
            {matchCaption}
          </div>
        </div>
      </div>

      {/* Colour legend */}
      {legend.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#1A1E2D] border border-[rgba(91,137,212,0.06)] rounded-lg text-[10px] sm:text-xs">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-4 h-1 rounded-full"
                style={{ background: item.color }}
              />
              <span className="text-[#6B7280]">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
