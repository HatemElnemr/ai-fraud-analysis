import { useNavigate } from "react-router";
import { FiUpload } from "react-icons/fi";
import { ANALYSIS_RESULTS_PATH } from "../constants";
import {
  CyberBtn,
  Dropzone,
  DropzoneEmptyState,
  ErrorBanner,
  FilePreview,
  GridBg,
  PageHeader,
  TipsGrid,
} from "../components/shared";
import { ScanningState } from "../components/FingerprintAnalysis";
import { useCompareFingerprint } from "../hooks/useCompareFingerprint";
import { useImageFile } from "../hooks/useImageFile";

/** Guidance shown under the dropzone for getting a scannable print. */
const ANALYSIS_TIPS = [
  {
    sym: "◎",
    title: "High contrast",
    body: "Ensure clear ridge visibility",
  },
  {
    sym: "⊡",
    title: "Full print",
    body: "Capture core and delta regions",
  },
  {
    sym: "◈",
    title: "No blur",
    body: "Sharp, focused image required",
  },
];

/**
 * Runs a fingerprint image through the `compare-fingerprint` Edge Function
 * and hands the response to the results route.
 *
 * File state lives in `useImageFile`, the Supabase call in
 * `useCompareFingerprint` — this component only wires them to the UI.
 */
function FingerprintAnalysis() {
  const navigate = useNavigate();
  const { file, preview, error: fileError, load, clear, detach } =
    useImageFile();
  const { compare, loading, error: compareError } = useCompareFingerprint();
  const error = fileError || compareError;

  const analyze = async () => {
    const result = await compare(file);
    if (!result) return; // failure is surfaced through `compareError`
    // The preview URL now belongs to the results page — don't revoke it here.
    detach();
    navigate(ANALYSIS_RESULTS_PATH, {
      state: { result, preview, fileName: file.name },
    });
  };

  return (
    <div className="min-h-screen bg-[#13151F] flex flex-col relative">
      <GridBg />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-2xl mx-auto">
          <PageHeader
            className="mb-6 sm:mb-8"
            crumb="New Analysis"
            title="Upload Fingerprint"
            description="Submit a fingerprint image to run a biometric match against the database."
          />

          {loading ? (
            <ScanningState />
          ) : (
            <>
              <Dropzone preview={preview} onSelect={load} tone="blue">
                {preview ? (
                  <FilePreview
                    file={file}
                    preview={preview}
                    alt="Fingerprint preview"
                    badge="LOADED"
                    layout="row"
                    tone="blue"
                    checks={[
                      "Image quality: Acceptable",
                      "Format: Compatible",
                      "Resolution: Sufficient",
                    ]}
                    onClear={clear}
                    clearLabel="Remove file"
                  />
                ) : (
                  <DropzoneEmptyState
                    size="lg"
                    icon={
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[rgba(91,137,212,0.2)] flex items-center justify-center">
                        <FiUpload size={20} className="text-[#5B89D4]" />
                      </div>
                    }
                    dropText="Drag and drop fingerprint image"
                    hint="or click to browse files"
                    formats="JPG · PNG · BMP · TIFF · max 10 MB"
                  />
                )}
              </Dropzone>

              {error && (
                <div className="mt-4">
                  <ErrorBanner msg={error} />
                </div>
              )}

              <TipsGrid tips={ANALYSIS_TIPS} className="mt-4 sm:mt-5" />

              <div className="mt-5">
                <CyberBtn onClick={analyze} disabled={!file}>
                  {file
                    ? "Run Biometric Analysis"
                    : "Upload a File to Continue"}
                </CyberBtn>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default FingerprintAnalysis;
