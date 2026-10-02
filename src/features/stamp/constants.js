/** Supabase storage bucket that holds archived stamp/seal reference marks. */
export const STAMP_BUCKET = "stamp-bucket";

/** Route that runs a stamp verification. */
export const ANALYSIS_PATH = "/dashboard/stamp-analysis";

/**
 * Everything that makes this page the *stamp* verifier: copy, labels,
 * fallback metrics, and the mark type handed to `signature-stamp-match`.
 * (Mirrors the `PAGE` config object used by `StampUploadPage`.)
 */
export const STAMP_ANALYSIS = {
  markType: "stamp",
  bucket: STAMP_BUCKET,
  breadcrumb: "Stamp Analysis",
  typeLabel: "Stamp",
  title: "Stamp & Seal Verification",
  subtitle:
    "Upload an official stamp or seal image to verify against the seal archive database.",
  scope: {
    title: "Official Seal / Stamp",
    subtitle: "Geometric, radial & ink density evaluation",
    parametersLabel: "Stamp Verification Parameters",
    parameters: [
      "Ring geometry comparison",
      "Ink density mapping",
      "Radial detail matching",
      "Seal diameter estimation",
    ],
  },
  upload: {
    heading: "Upload Stamp Image",
    dropText: "Drop stamp/seal image here",
    hint: "or click to browse from device",
    formats: "JPG · PNG · TIFF · max 10 MB",
    alt: "Stamp to verify",
    submitLabel: "Verify Stamp",
    idleLabel: "Upload Image to Continue",
  },
  scanning: {
    title: "Analyzing Stamp",
    subtitle:
      "Running radial & geometric comparison against archived seal records…",
    status: "Analyzing Seal Geometry…",
    steps: ["Extracting patterns", "Matching archive"],
  },
  results: {
    title: "Verification Results",
    completedLabel: "Stamp comparison completed",
    matchTitle: "Stamp Verified",
    metricsTitle: "Stamp Analysis Metrics",
    resetLabel: "New Stamp Comparison",
    retryLabel: "Retry Comparison",
  },
  /**
   * Metric labels the analysis is expected to report. They are appended to
   * whatever the response actually returned (declared metrics, mark type,
   * record label, any other scalar response field) as `—` placeholders for
   * the measurements the function didn't report — never invented values.
   */
  fallbackMetrics: [
    "Ink Density",
    "Circular Accuracy",
    "Estimated Diameter",
    "Pattern Type",
    "Inner Detail",
    "Algorithm",
  ],
  legend: [
    { color: "#5B89D4", label: "Database seal" },
    { color: "#F59E0B", label: "Query sample" },
    { color: "#10B981", label: "Match markers" },
  ],
  record: {
    entityLabel: "Issuing Entity",
    authorityLabel: "Issuing Body",
    recordType: "Official Seal / Rubber Stamp",
    emptyNote:
      "No archive stamp matched this query, so no record was returned.",
  },
  session: {
    documentType: "Stamp / Seal",
  },
};
