import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useLocation, useNavigate } from "react-router";
import { FiChevronRight } from "react-icons/fi";
import { ANALYSIS_PATH } from "../constants";
import { CyberBtn, GridBg } from "../components/shared";
import {
  IdentityRecordCard,
  NoMatchState,
  NoResultsState,
  PatternAnalysisCard,
  ReasoningCard,
  SampleComparison,
  StatusBanner,
  TechnicalMetadataCard,
} from "../components/FingerprintResults";
import { normalizeMatchResult } from "../components/FingerprintResults/matchResult";

/** `2026-09-30 14:32` → `BIO-20260930-1432` (UI-only reference). */
function createSessionId(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    "BIO",
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`,
    `${pad(date.getHours())}${pad(date.getMinutes())}`,
  ].join("-");
}

/**
 * Renders the response of the `compare-fingerprint` Edge Function.
 *
 * Everything on screen is derived from the payload handed over by
 * `FingerprintAnalysis` through router state: verdict + score from
 * `normalizeMatchResult`, the candidate from `person`, the classification
 * from `inputFingerprintType`, and the measured round-trip time. A direct
 * visit or refresh (no state) falls back to `NoResultsState`; a below-threshold
 * response renders `NoMatchState`, which never shows database imagery.
 */
export function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const payload = state?.result ?? null;
  const preview = state?.preview ?? null;
  const fileName = state?.fileName ?? "";

  // Fixed on first render so the stamp doesn't drift across re-renders.
  const [analyzedAt] = useState(() => new Date());
  const [sessionId] = useState(() => createSessionId(new Date()));

  // The analysis page handed this object URL over — revoke it on the way out.
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const goAnalysis = () => navigate(ANALYSIS_PATH);

  if (payload === null) {
    return (
      <div className="min-h-screen bg-[#13151F] flex flex-col relative">
        <GridBg />
        <main className="flex-1 p-4 sm:p-6 lg:p-10 relative z-10">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb />
            <NoResultsState onBack={goAnalysis} />
          </div>
        </main>
      </div>
    );
  }

  const result = normalizeMatchResult(payload);

  // Below threshold → dedicated page: verdict + score only, never the closest
  // record's image or identity fields (they are not proof of a match).
  if (result.status === "no-match") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="min-h-screen bg-[#13151F] flex flex-col relative"
      >
        <GridBg />
        <main className="flex-1 p-4 sm:p-6 lg:p-10 relative z-10">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb />
            <div className="max-w-3xl mx-auto">
              <NoMatchState
                score={result.score}
                threshold={result.threshold}
                timestamp={analyzedAt.toLocaleString()}
                sessionId={sessionId}
                message={result.message}
                onNewAnalysis={goAnalysis}
              />
            </div>
          </div>
        </main>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen bg-[#13151F] flex flex-col relative"
    >
      <GridBg />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb />

          <StatusBanner
            result={result}
            timestamp={analyzedAt.toLocaleString()}
            sessionId={sessionId}
          />

          {/* Content Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column: sample comparison + analysis */}
            <div className="lg:col-span-3 flex flex-col gap-5">
              <SampleComparison
                queryPreview={preview}
                queryFileName={fileName}
                person={result.person}
                status={result.status}
              />
              <PatternAnalysisCard
                fingerprintType={result.fingerprintType}
                result={result}
              />
              <ReasoningCard message={result.message} />
            </div>

            {/* Right Column: identity + technical metadata + actions */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <IdentityRecordCard
                person={result.person}
                status={result.status}
              />
              <TechnicalMetadataCard
                fingerprintType={result.fingerprintType}
              />
              <CyberBtn onClick={goAnalysis} outline className="w-full">
                New Analysis
              </CyberBtn>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

/** Dashboard › Analysis › Results trail. */
function Breadcrumb() {
  return (
    <div
      className="flex items-center gap-1.5 text-[#4B5563] text-[9px] sm:text-[10px] uppercase tracking-[0.18em] mb-4 sm:mb-6"
      style={{ fontFamily: "JetBrains Mono, monospace" }}
    >
      Dashboard <FiChevronRight size={10} /> Analysis{" "}
      <FiChevronRight size={10} />
      <span className="text-[#5B89D4]">Results</span>
    </div>
  );
}

export default ResultsPage;
