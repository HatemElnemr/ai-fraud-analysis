import { FingerprintSVG } from "../shared";

/**
 * Side-by-side "Query vs Best Match" panels.
 *
 * The query side shows the image the analyst uploaded; the match side shows
 * `person.fingerprint_url` straight from Supabase. The heading reflects the
 * verdict: the function always returns its *closest* record, so a
 * below-threshold candidate is labelled "Closest Candidate", not "Best Match".
 *
 * Either side falls back to the fingerprint glyph when there is no image.
 */
export function SampleComparison({
  queryPreview,
  queryFileName,
  person,
  status,
}) {
  const hasPerson = Boolean(person);
  const isMatch = status === "match";

  const matchHeading = !hasPerson
    ? "No Candidate"
    : isMatch
      ? "Best Match"
      : "Closest Candidate";
  const matchCaption = !hasPerson
    ? "Nothing returned"
    : isMatch
      ? "Database Record"
      : "Below threshold · not a match";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <SamplePanel
        heading="Query"
        headingClass="text-[#4B5563]"
        cardClass="bg-[#1A1E2D] border border-[rgba(91,137,212,0.08)]"
        caption="Uploaded Sample"
        captionClass="text-[#374151]"
        src={queryPreview}
        alt={
          queryFileName
            ? `Uploaded sample: ${queryFileName}`
            : "Uploaded fingerprint sample"
        }
      />

      <SamplePanel
        heading={matchHeading}
        headingClass="text-[#5B89D4]"
        cardClass="bg-[#1A1E2D] border border-[#5B89D4]/18 shadow-[0_0_30px_rgba(91,137,212,0.06)]"
        caption={matchCaption}
        captionClass="text-[#5B89D4]/50"
        src={hasPerson ? person?.fingerprint_url : null}
        alt="Best matching database fingerprint"
        showMinutiae
      />
    </div>
  );
}

function SamplePanel({
  heading,
  headingClass,
  cardClass,
  caption,
  captionClass,
  src,
  alt,
  showMinutiae = false,
}) {
  return (
    <div
      className={`${cardClass} rounded p-4 sm:p-5 flex flex-col items-center gap-3`}
    >
      <div
        className={`${headingClass} text-[9px] uppercase tracking-[0.2em]`}
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        {heading}
      </div>

      <div className="w-full flex justify-center">
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-32 h-40 sm:w-40 sm:h-44 object-cover rounded border border-[rgba(91,137,212,0.2)] grayscale"
          />
        ) : (
          <FingerprintSVG
            size={160}
            showMinutiae={showMinutiae}
            className="w-32 h-32 sm:w-40 sm:h-40"
          />
        )}
      </div>

      <div
        className={`${captionClass} text-[9px] uppercase tracking-wider text-center`}
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        {caption}
      </div>
    </div>
  );
}
