import { SignatureScopeIcon } from "../signature/components/SignatureAnalysis";
import { StampScopeIcon } from "../stamp/components/StampAnalysis";

/**
 * Per-type editor configuration for the reference-mark edit flow.
 *
 * `editorForMarkType(mark_type)` is the gate: the edit screen never shows a
 * form ("suggestion") until it has checked whether the stored mark is a
 * signature or a stamp, so a record can only ever be edited with the fields,
 * placeholders, tips, and bucket that match its actual type. Unknown types
 * return null and the caller reports the mismatch instead of guessing.
 */
export const MARK_EDITORS = {
  signature: {
    markType: "signature",
    bucket: "signature-bucket",
    typeLabel: "Signature",
    labelPlaceholder: "e.g. 2024 contracts signature, notarized signature v2",
    entityNamePlaceholder: "e.g. Sarah Al Mansouri or Ministry of Justice",
    imageTitle: "Signature Image",
    dropText: "Drop a replacement signature image",
    tips: [
      "Scan on white background",
      "300 DPI minimum recommended",
      "Avoid shadows or creases",
    ],
    icon: <SignatureScopeIcon />,
    showAuthority: false,
    authorityPlaceholder: "",
    saveLabel: "Save Signature",
    savingMsg: "Saving Signature…",
    successTitle: "Signature Updated",
  },
  stamp: {
    markType: "stamp",
    bucket: "stamp-bucket",
    typeLabel: "Stamp",
    labelPlaceholder: "e.g. 2024 contracts stamp, notarized stamp v2",
    entityNamePlaceholder: "e.g. Ministry of Justice or Acme Seal Co.",
    imageTitle: "Stamp Image",
    dropText: "Drop a replacement stamp image",
    tips: [
      "Capture the full circular boundary",
      "Even ink pressure preferred",
      "Flat surface — no distortion",
    ],
    icon: <StampScopeIcon />,
    showAuthority: true,
    authorityPlaceholder: "e.g. Ministry of Justice or Official Gazette",
    saveLabel: "Save Stamp",
    savingMsg: "Saving Stamp…",
    successTitle: "Stamp Updated",
  },
};

/**
 * The mark-type check itself: returns the editor config for
 * `"signature"` / `"stamp"`, or `null` for anything else (missing,
 * misspelled, or a type this app doesn't edit — e.g. fingerprint).
 */
export function editorForMarkType(markType) {
  return MARK_EDITORS[markType] ?? null;
}
