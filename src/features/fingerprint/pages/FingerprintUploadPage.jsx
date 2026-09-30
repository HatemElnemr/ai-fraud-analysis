import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { supabase } from "../../../shared/utils/supabase";
import {
  FINGERPRINT_BUCKET,
  PEOPLE_TABLE,
  generateRecordId,
} from "../constants";
import {
  CyberBtn,
  Dropzone,
  DropzoneEmptyState,
  ErrorBanner,
  FilePreview,
  FingerprintSVG,
  GridBg,
  PageHeader,
  SectionHeading,
} from "../components/shared";
import {
  CommittingState,
  RecordForm,
  RecordPreviewCard,
  RecordSuccessPanel,
} from "../components/FingerprintUpload";
import { useImageFile } from "../hooks/useImageFile";

const EMPTY_FORM = () => ({
  fullName: "",
  recordId: generateRecordId(),
  nationality: "",
});

/**
 * Registers a new subject + fingerprint image into the `people` table.
 *
 * File state/validation lives in `useImageFile`; the markup is split into the
 * shared dropzone primitives and the `FingerprintUpload` cards.
 */
function FingerprintUploadPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [err, setErr] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const { file, preview, error: fileError, load, clear } = useImageFile();

  const error = err || fileError;
  const patch = (next) => setForm((prev) => ({ ...prev, ...next }));

  /** Picking a new image also clears a stale submit error (as before). */
  const handleSelect = (nextFile) => {
    setErr("");
    load(nextFile);
  };

  const uploadFingerprint = async () => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    // Unique, collision-free path per record; extension preserved.
    const path = `${form.recordId}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(FINGERPRINT_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(FINGERPRINT_BUCKET)
      .getPublicUrl(path);

    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!form.fullName.trim() || !form.nationality) {
      setErr("Full Name and Nationality are required.");
      return;
    }
    if (!file) {
      setErr("A fingerprint image is required.");
      return;
    }

    setErr("");
    setSaving(true);

    try {
      const fingerprintUrl = await uploadFingerprint();

      const { error: insertError } = await supabase.from(PEOPLE_TABLE).insert({
        full_name: form.fullName.trim(),
        nationality: form.nationality,
        fingerprint_url: fingerprintUrl,
      });

      if (insertError) throw insertError;

      setSubmitted(true);
    } catch (error) {
      setErr(error.message || "Failed to save the record. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    clear();
    setForm(EMPTY_FORM());
    setSubmitted(false);
    setErr("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative"
    >
      <div className="flex flex-col relative overflow-x-hidden">
        <GridBg />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:p-10 relative z-10">
          <div className="max-w-5xl mx-auto">
            <PageHeader
              crumb="Insert Record"
              title="Insert Database Record"
              description="Register a new subject and their biometric fingerprint data into the system."
            />

            {submitted ? (
              <RecordSuccessPanel
                fullName={form.fullName}
                recordId={form.recordId}
                nationality={form.nationality}
                insertedAt={new Date().toLocaleString()}
                onReset={reset}
                onDone={() => navigate("/dashboard/fingerprint-upload")}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* ── Left: form ── */}
                <div className="lg:col-span-3 flex flex-col gap-4 sm:gap-6">
                  <RecordForm form={form} onPatch={patch} />
                  {error && <ErrorBanner msg={error} />}
                </div>

                {/* ── Right: fingerprint upload + submit ── */}
                <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">
                  <div className="bg-[#1A1E2D] border border-[rgba(0,240,255,0.08)] rounded p-4 sm:p-6">
                    <SectionHeading>
                      Fingerprint Image{" "}
                      <span className="text-[#5B89D4]">*</span>
                    </SectionHeading>

                    <Dropzone
                      preview={preview}
                      onSelect={handleSelect}
                      tone="cyan"
                    >
                      {preview ? (
                        <FilePreview
                          file={file}
                          preview={preview}
                          alt="Fingerprint to register"
                          badge="READY"
                          layout="stack"
                          tone="cyan"
                          showType={false}
                          onClear={clear}
                          clearLabel="Remove"
                        />
                      ) : (
                        <DropzoneEmptyState
                          icon={
                            <FingerprintSVG
                              size={80}
                              className="sm:w-25 sm:h-25"
                            />
                          }
                          dropText="Drop fingerprint image"
                          hint="or click to browse"
                          formats="JPG · PNG · BMP · max 10 MB"
                        />
                      )}
                    </Dropzone>
                  </div>

                  <RecordPreviewCard
                    recordId={form.recordId}
                    fullName={form.fullName}
                    nationality={form.nationality}
                  />

                  {saving ? (
                    <CommittingState />
                  ) : (
                    <CyberBtn onClick={handleSubmit} className="w-full">
                      Commit to Database
                    </CyberBtn>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </motion.div>
  );
}

export default FingerprintUploadPage;
