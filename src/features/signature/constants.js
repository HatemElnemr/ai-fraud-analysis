/** Supabase storage bucket that holds archived signature reference marks. */
export const SIGNATURE_BUCKET = "signature-bucket";

/** Route that runs a signature verification. */
export const ANALYSIS_PATH = "/dashboard/signature-analysis";

/**
 * Everything that makes this page the *signature* verifier: copy, labels,
 * fallback metrics, and the mark type handed to `signature-stamp-match`.
 * (Mirrors the `PAGE` config object used by `SignatureUploadPage`.)
 */
export const SIGNATURE_ANALYSIS = {
  markType: "signature",
  bucket: SIGNATURE_BUCKET,
  breadcrumb: "Signature Analysis",
  typeLabel: "Signature",
  title: "Signature Verification",
  subtitle:
    "Upload a handwritten signature image to verify against the signature archive database.",
  scope: {
    title: "Handwritten Signature",
    subtitle: "Biometric stroke & stroke-geometry evaluation",
    parametersLabel: "Signature Verification Parameters",
    parameters: [
      "Stroke pattern matching",
      "Pen pressure analysis",
      "Slant & loop ratio detection",
      "Baseline alignment & density",
    ],
  },
  upload: {
    heading: "Upload Signature Image",
    dropText: "Drop signature image here",
    hint: "or click to browse from device",
    formats: "JPG · PNG · TIFF · max 10 MB",
    alt: "Signature to verify",
    submitLabel: "Verify Signature",
    idleLabel: "Upload Image to Continue",
  },
  scanning: {
    title: "Analyzing Signature",
    subtitle:
      "Running biometric comparison against archived records…",
    status: "Extracting Stroke Dynamics…",
    steps: ["Extracting features", "Matching archive"],
  },
  results: {
    title: "Verification Results",
    completedLabel: "Signature comparison completed",
    matchTitle: "Signature Verified",
    metricsTitle: "Signature Analysis Metrics",
    resetLabel: "New Signature Comparison",
    retryLabel: "Retry Comparison",
  },
  /**
   * Metric labels the analysis is expected to report. They are appended to
   * whatever the response actually returned (declared metrics, mark type,
   * record label, any other scalar response field) as `—` placeholders for
   * the measurements the function didn't report — never invented values.
   */
  fallbackMetrics: [
    "Stroke Consistency",
    "Pen Pressure",
    "Slant Angle",
    "Loop Ratio",
    "Stroke Count",
    "Algorithm",
  ],
  legend: [
    { color: "#5B89D4", label: "Database record" },
    { color: "#F59E0B", label: "Query sample" },
    { color: "#10B981", label: "Match points" },
  ],
  record: {
    entityLabel: "Signatory",
    authority: "Authority",
    recordType: "Handwritten Signature",
    emptyNote:
      "No archive signature matched this query, so no record was returned.",
  },
  session: {
    documentType: "Signature",
  },
};
