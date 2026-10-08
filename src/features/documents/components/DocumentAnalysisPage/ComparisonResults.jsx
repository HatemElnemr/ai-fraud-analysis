import { DifferencesCard } from "./DifferencesCard";
import { InputAnalysisCard } from "./InputAnalysisCard";
import { MatchedRecordCard } from "./MatchedRecordCard";
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
 */
export function ComparisonResults({ result, file, onNewAnalysis }) {
  const differences = Array.isArray(result.differences) ? result.differences : [];
  const hasDifferences = result.hasDifferences ?? differences.length > 0;

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
