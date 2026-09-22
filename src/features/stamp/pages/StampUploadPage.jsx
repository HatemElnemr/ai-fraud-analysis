import { useCallback, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import {
  CyberBtn,
  ErrorBanner,
  GridBg,
} from "../../fingerprint/components/FormFields";
import { archiveReferenceMark } from "../../reference-marks/api";
import { useEntityPicker } from "../../reference-marks/hooks/useEntityPicker";
import {
  ArchivingIndicator,
  EntitySection,
  EntryPreview,
  ImageDropzone,
  MarkDetailsCard,
  MarkSuccessPanel,
} from "../../reference-marks/components";

/** Everything that makes this page the *stamp* registry. */
const PAGE = {
  bucket: "stamp-bucket",
  markType: "stamp",
  typeLabel: "Stamp",
  breadcrumb: "Stamp Upload",
  title: "Stamp & Seal Registry",
  subtitle:
    "Upload and classify an official seal or rubber stamp for biometric archiving.",
  imageTitle: "Stamp Image",
  dropText: "Drop stamp image here",
  labelPlaceholder: "e.g. 2024 contracts stamp, notarized stamp v2",
  entityNamePlaceholder: "e.g. Ministry of Justice or Acme Seal Co.",
  fileRequiredMsg: "A stamp image is required.",
  savingMsg: "Archiving Stamp…",
  submitLabel: "Archive Stamp",
  submitClassName: "",
  submitErrorMsg: "Failed to archive the stamp. Please try again.",
  tips: [
    "Capture the full circular boundary",
    "Even ink pressure preferred",
    "Flat surface — no distortion",
  ],
  icon: (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="16" stroke="#5B89D4" strokeWidth="2" />
      <circle
        cx="20"
        cy="20"
        r="11"
        stroke="#5B89D4"
        strokeWidth="1"
        strokeDasharray="3 2"
        opacity={0.5}
      />
      <circle cx="20" cy="20" r="4" fill="#5B89D4" opacity={0.8} />
    </svg>
  ),
};

export function StampUploadPage({ onNavigate }) {
  const picker = useEntityPicker();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [label, setLabel] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const load = useCallback((f) => {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  /* upload → public URL → insert into reference_marks */
  const handleSubmit = async () => {
    if (!picker.entityId) {
      setErr(
        "Select an existing entity or create a new one before archiving.",
      );
      return;
    }
    if (!file) {
      setErr(PAGE.fileRequiredMsg);
      return;
    }

    setErr("");
    setSaving(true);

    try {
      await archiveReferenceMark({
        bucket: PAGE.bucket,
        markType: PAGE.markType,
        entityId: picker.entityId,
        label,
        file,
      });
      setSubmitted(true);
    } catch (error) {
      setErr(error.message || PAGE.submitErrorMsg);
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setLabel("");
    picker.reset();
    setSubmitted(false);
    setSaving(false);
    setErr("");
  };

  return (
    <div className="min-h-screen bg-[#13151F] flex flex-col relative">
      <GridBg />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div
            className="flex items-center gap-1.5 text-[#4B5563] text-[9px] sm:text-[10px] uppercase tracking-[0.18em] mb-4 sm:mb-6"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Dashboard <FaChevronRight size={9} />{" "}
            <span className="text-[#5B89D4]">{PAGE.breadcrumb}</span>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2
              className="text-[#DDE1EC] text-xl sm:text-2xl font-bold"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              {PAGE.title}
            </h2>
            <p className="text-[#8A92A6] mt-1.5 text-xs sm:text-sm">
              {PAGE.subtitle}
            </p>
          </div>

          {submitted ? (
            <MarkSuccessPanel
              typeLabel={PAGE.typeLabel}
              entityInfo={picker.entityInfo}
              label={label}
              preview={preview}
              onReset={reset}
              onNavigate={onNavigate}
            />
          ) : (
            /* Main Form Layout */
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left Column: Form Details */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                <EntitySection
                  picker={picker}
                  namePlaceholder={PAGE.entityNamePlaceholder}
                />
                <MarkDetailsCard
                  label={label}
                  onChange={setLabel}
                  placeholder={PAGE.labelPlaceholder}
                />
                {err && <ErrorBanner msg={err} />}
              </div>

              {/* Right Column: Upload & Actions */}
              <div className="lg:col-span-2 flex flex-col gap-5">
                <ImageDropzone
                  title={PAGE.imageTitle}
                  icon={PAGE.icon}
                  dropText={PAGE.dropText}
                  tips={PAGE.tips}
                  file={file}
                  preview={preview}
                  onSelect={load}
                  onClear={clearFile}
                />

                <EntryPreview
                  typeLabel={PAGE.typeLabel}
                  entityInfo={picker.entityInfo}
                  label={label}
                  fileName={file?.name}
                />

                {/* Submit Action */}
                {saving ? (
                  <ArchivingIndicator label={PAGE.savingMsg} />
                ) : (
                  <CyberBtn
                    onClick={handleSubmit}
                    className={PAGE.submitClassName}
                  >
                    {PAGE.submitLabel}
                  </CyberBtn>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
