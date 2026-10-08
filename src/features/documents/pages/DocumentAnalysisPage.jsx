import { useState } from "react";
import { TbFileSearch } from "react-icons/tb";
import { useCompareDocuments } from "../hooks/useCompareDocuments";
import { ErrorBanner, PageHeader } from "../shared";
import {
  AnalysisDropzoneCard,
  AnalysisScanningState,
  ComparisonResults,
  HowItWorksPanel,
  SelectedFileCard,
} from "../components/DocumentAnalysisPage";

/**
 * Compares an uploaded document against the library by triggering the
 * `compare-documents` Supabase Edge Function.
 *
 * The file state lives here, the request lives in `useCompareDocuments`,
 * and the markup is split into the shared header/dropzone primitives and
 * the `DocumentAnalysisPage` cards. Renders three screens in place:
 * form → scanning → results.
 */
export default function DocumentAnalysisPage() {
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState("");
  const { analyze, loading, error, result, clearError, reset } =
    useCompareDocuments();

  const handleSelect = (nextFile) => {
    setLocalError("");
    clearError();
    setFile(nextFile);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setLocalError("Please upload a document to analyze.");
      return;
    }
    setLocalError("");
    await analyze(file);
  };

  const handleNewAnalysis = () => {
    reset();
    setLocalError("");
    setFile(null);
  };

  if (loading) {
    return <AnalysisScanningState />;
  }

  if (result) {
    return (
      <ComparisonResults
        result={result}
        file={file}
        onNewAnalysis={handleNewAnalysis}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#13151F] text-white font-sans px-4 py-8 md:px-10">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          icon={<TbFileSearch size={14} className="text-[#5B89D4]" />}
          eyebrow="Document Analysis"
          title="Compare Document"
          description="Upload a document to find its closest match in the library and identify any differences or tampering."
        />

        <ErrorBanner message={localError || error} />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3 space-y-5">
            <AnalysisDropzoneCard file={file} onSelect={handleSelect} />

            <button
              onClick={handleAnalyze}
              className="w-full py-3 bg-[#5B89D4] hover:bg-[#6A96DB] text-[#13151F] font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 font-mono"
            >
              <TbFileSearch size={16} />
              Run Analysis
            </button>
          </div>

          {/* ── Right: explainer + selected file ── */}
          <div className="md:col-span-2 space-y-4">
            <HowItWorksPanel />
            <SelectedFileCard file={file} />
          </div>
        </div>
      </div>
    </div>
  );
}
