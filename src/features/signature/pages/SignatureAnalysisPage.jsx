import { useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { GridBg, PageHeader } from "../../fingerprint/components/shared";
import { useImageFile } from "../../fingerprint/hooks/useImageFile";
import {
  FormStep,
  ResultsStep,
  ScanningState,
} from "../../signature-stamp-match/components";
import { enrichArchiveRecord } from "../../signature-stamp-match/api";
import { normalizeMatchResult } from "../../signature-stamp-match/matchResult";
import { useSignatureStampMatch } from "../../signature-stamp-match/hooks/useSignatureStampMatch";
import {
  SignatureMatchSVG,
  SignatureScanningVisual,
  SignatureScopeIcon,
} from "../components/SignatureAnalysis";
import { SIGNATURE_ANALYSIS } from "../constants";

/** `2026-10-02 15:32` → `SIG-20261002-1532` (UI-only session reference). */
function createSessionId(prefix, date) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    prefix,
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`,
    `${pad(date.getHours())}${pad(date.getMinutes())}`,
  ].join("-");
}

/**
 * Runs a signature image through the `signature-stamp-match` Edge Function
 * and renders the whole lifecycle in place: `form` → `scanning` → `results`,
 * with failures returned to the form behind `FormStep`'s error banner.
 *
 * The step markup lives in the shared `FormStep` / `ResultsStep` /
 * `ScanningState` components — this page only owns the state machine: file
 * state in `useImageFile`, the Supabase call in `useSignatureStampMatch`,
 * and the payload mapping in `normalizeMatchResult`.
 */
export function SignatureAnalysisPage() {
  const { user } = useAuth();
  const { file, preview, error: fileError, load, clear } = useImageFile();
  const { match, error: matchError, reset: resetMatch } = useSignatureStampMatch({
    markType: SIGNATURE_ANALYSIS.markType,
    bucket: SIGNATURE_ANALYSIS.bucket,
  });

  const [step, setStep] = useState("form");
  const [result, setResult] = useState(null);
  const [run, setRun] = useState(null);
  const error = fileError || matchError;
  const isResults = step === "results" && result !== null && run !== null;
  console.log("SIGNATURE_ANALYSIS", result);

  /** A newly picked file clears the previous attempt's error. */
  const handleSelect = (nextFile) => {
    resetMatch();
    load(nextFile);
  };

  const analyze = async () => {
    if (!file) return;
    resetMatch();
    setStep("scanning");

    const startedAt = Date.now();
    const data = await match(file);
    if (!data) {
      // Failure is surfaced through `matchError` on the form step.
      setStep("form");
      return;
    }

    const normalized = normalizeMatchResult(data, {
      fallbackMetrics: SIGNATURE_ANALYSIS.fallbackMetrics,
    });
    // The function's payload omits the entity's authority and the matched
    // mark's image — read them from the DB so the Archive Record card and
    // the Best Match panel show the real data.
    await enrichArchiveRecord(normalized);

    const finishedAt = new Date();
    setResult(normalized);
    setRun({
      sessionId: createSessionId("SIG", finishedAt),
      submittedAt: new Date(startedAt),
      finishedAt,
      durationMs: finishedAt.getTime() - startedAt,
    });
    setStep("results");
  };

  const reset = () => {
    resetMatch();
    clear();
    setResult(null);
    setRun(null);
    setStep("form");
  };

  const operator =
    user?.user_metadata?.name ?? user?.email ?? "System Operator";

  return (
    <div className="min-h-screen bg-[#13151F] flex flex-col relative">
      <GridBg />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 relative z-10">
        <div className="max-w-5xl mx-auto w-full">
          {step === "scanning" ? (
            <ScanningState {...SIGNATURE_ANALYSIS.scanning}>
              <SignatureScanningVisual />
            </ScanningState>
          ) : (
            <>
              <PageHeader
                className="mb-6 sm:mb-8"
                crumb={SIGNATURE_ANALYSIS.breadcrumb}
                title={
                  isResults
                    ? SIGNATURE_ANALYSIS.results.title
                    : SIGNATURE_ANALYSIS.title
                }
                description={
                  isResults
                    ? `${SIGNATURE_ANALYSIS.results.completedLabel} · ${run.finishedAt.toLocaleString()}`
                    : SIGNATURE_ANALYSIS.subtitle
                }
              />

              {step === "form" && (
                <FormStep
                  config={SIGNATURE_ANALYSIS}
                  scopeIcon={<SignatureScopeIcon />}
                  file={file}
                  preview={preview}
                  error={error}
                  onSelect={handleSelect}
                  onClear={clear}
                  onSubmit={analyze}
                />
              )}

              {isResults && (
                <ResultsStep
                  config={SIGNATURE_ANALYSIS}
                  result={result}
                  run={run}
                  queryPreview={preview}
                  queryFileName={file?.name}
                  matchVisual={<SignatureMatchSVG />}
                  operator={operator}
                  onRetry={analyze}
                  onReset={reset}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default SignatureAnalysisPage;
