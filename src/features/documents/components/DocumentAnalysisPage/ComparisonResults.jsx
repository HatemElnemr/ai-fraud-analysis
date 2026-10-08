import { MATCH_THRESHOLD } from "../../constants";
import { DifferencesCard } from "./DifferencesCard";
import { InputAnalysisCard } from "./InputAnalysisCard";
import { MatchedRecordCard } from "./MatchedRecordCard";
import { NoMatchState } from "./NoMatchState";
import { ResultScoreBanner } from "./ResultScoreBanner";
import { ResultsHeader } from "./ResultsHeader";
import { SummaryCard } from "./SummaryCard";
import { UploadedFileCard } from "./UploadedFileCard";

/**
 * Full comparison-results screen for a `compare-documents` payload:
 * score banner, then a two-column layout with the analysis + differences on
 * the left and the matched record + summary on the right.
 *
 * The payload's `hasDifferences` flag wins; when the function omits it, the
 * presence of differences decides the verdict.
 *
 * A below-threshold run gets the dedicated `NoMatchState` panel instead —
 * verdict, score and notes only, never the closest record's identity fields
 * (they are not proof of a match).
 */
export function ComparisonResults({ result, file, onNewAnalysis }) {
  const differences = Array.isArray(result.differences) ? result.differences : [];
  const hasDifferences = result.hasDifferences ?? differences.length > 0;

  if (isNoMatch(result)) {
    return (
      <div className="min-h-screen bg-[#13151F] text-white font-sans px-4 py-8 md:px-10">
        <div className="max-w-3xl mx-auto">
          <ResultsHeader onNewAnalysis={onNewAnalysis} />
          <NoMatchState
            score={result.similarity_score ?? null}
            threshold={MATCH_THRESHOLD}
            fileName={file?.name ?? ""}
            message={result.summary || result.message || ""}
            onNewAnalysis={onNewAnalysis}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#13151F] text-white font-sans px-4 py-8 md:px-10">
      <div className="max-w-5xl mx-auto">
        <ResultsHeader onNewAnalysis={onNewAnalysis} />

        <ResultScoreBanner
          score={result.similarity_score ?? 0}
          hasDifferences={hasDifferences}
          differenceCount={differences.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left — analysis + diffs */}
          <div className="lg:col-span-3 space-y-5">
            <InputAnalysisCard analysis={result.inputDocumentAnalysis} />
            <DifferencesCard differences={differences} />
          </div>

          {/* Right — matched doc, summary, uploaded file */}
          <div className="lg:col-span-2 space-y-5">
            <MatchedRecordCard document={result.document} />
            <SummaryCard summary={result.summary} />
            <UploadedFileCard file={file} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Decides whether the payload counts as "no match found".
 *
 * An explicit verdict from the function always wins; otherwise the score is
 * compared against `MATCH_THRESHOLD`. A payload with neither falls back to
 * the normal results screen (which degrades on its own when the record is
 * missing) rather than declaring a failure we can't prove.
 */
function isNoMatch(result) {
  if (!result || typeof result !== "object") return false;

  const explicit =
    result.matched ?? result.isMatch ?? result.match ?? result.matchFound;
  if (typeof explicit === "boolean") return !explicit;
  if (typeof explicit === "string") {
    const value = explicit.trim().toLowerCase();
    if (["false", "no", "no-match", "nomatch", "no match"].includes(value)) {
      return true;
    }
    if (["true", "yes", "match", "matched"].includes(value)) return false;
  }

  if (result.status === "no-match" || result.noMatch === true) return true;

  const score = Number(result.similarity_score);
  return Number.isFinite(score) && score < MATCH_THRESHOLD;
}
