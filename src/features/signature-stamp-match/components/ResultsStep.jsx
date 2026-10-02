import { CyberBtn } from "../../fingerprint/components/shared";
import { ReasoningCard } from "../../fingerprint/components/FingerprintResults";
import { SIGNATURE_STAMP_MATCH_FUNCTION } from "../constants";
import { ArchiveRecordCard } from "./ArchiveRecordCard";
import { MatchStatusBanner } from "./MatchStatusBanner";
import { MetricsCard } from "./MetricsCard";
import { NoMatchState } from "./NoMatchState";
import { SampleComparison } from "./SampleComparison";
import { SessionDetailsCard } from "./SessionDetailsCard";

/**
 * Results step of an analysis page — extracted from the page so the page
 * only wires state. Takes the normalized `result`, the `run` timings, the
 * page's config object, and the mark-specific slots (`matchVisual`).
 *
 * Below-threshold runs mirror the fingerprint analysis: a dedicated
 * `NoMatchState` panel showing only the verdict, score and reasoning —
 * never the closest record's image or identity fields (they are not proof
 * of a match). Matched and inconclusive runs get the status banner, the
 * comparison grid, and the session/action cards.
 */
export function ResultsStep({
  result,
  run,
  config,
  queryPreview,
  queryFileName,
  matchVisual,
  operator,
  onRetry,
  onReset,
}) {
  const timestamp = run.finishedAt.toLocaleString();

  // Below threshold → fingerprint-style "not found" panel, nothing else.
  if (result.status === "no-match") {
    return (
      <div className="max-w-3xl mx-auto">
        <NoMatchState
          subject={config.markType}
          score={result.score}
          threshold={result.threshold}
          timestamp={timestamp}
          sessionId={run.sessionId}
          message={result.message}
          actionLabel={config.results.resetLabel}
          onNewAnalysis={onReset}
        />
      </div>
    );
  }

  return (
    <>
      <MatchStatusBanner
        result={result}
        timestamp={timestamp}
        sessionId={run.sessionId}
        matchTitle={config.results.matchTitle}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: visuals + metrics + reasoning */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <SampleComparison
            result={result}
            queryPreview={queryPreview}
            queryFileName={queryFileName}
            matchImage={result.archiveRecord?.imageUrl ?? null}
            legend={config.legend}
          >
            {matchVisual}
          </SampleComparison>

          <MetricsCard result={result} title={config.results.metricsTitle} />

          <ReasoningCard message={result.message} />
        </div>

        {/* Right: record + session + actions */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <ArchiveRecordCard
            result={result}
            typeLabel={config.typeLabel}
            entityLabel={config.record.entityLabel}
            authorityLabel={config.record.authority ?? config.record.authorityLabel}
            recordType={config.record.recordType}
            emptyNote={config.record.emptyNote}
          />

          <SessionDetailsCard
            rows={[
              { k: "Document Type", v: config.session.documentType },
              { k: "Submitted At", v: run.submittedAt.toLocaleTimeString() },
              {
                k: "Processing Time",
                v: `${(run.durationMs / 1000).toFixed(2)} seconds`,
              },
              { k: "Threshold", v: `${result.threshold}%` },
              { k: "Edge Function", v: SIGNATURE_STAMP_MATCH_FUNCTION },
              { k: "Operator", v: operator },
            ]}
          />

          {/* Inconclusive run (e.g. a model-availability spike the API
              already retried): re-run with the file kept. */}
          {result.status === "unknown" && (
            <CyberBtn onClick={onRetry} className="w-full">
              {config.results.retryLabel}
            </CyberBtn>
          )}

          <CyberBtn onClick={onReset} outline className="w-full">
            {config.results.resetLabel}
          </CyberBtn>
        </div>
      </div>
    </>
  );
}
