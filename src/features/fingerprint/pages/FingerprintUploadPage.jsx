import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { FaChevronRight, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router";
import { supabase } from "../../../shared/utils/supabase";
import {
  FINGERPRINT_BUCKET,
  MAX_FILE_BYTES,
  NATIONALITIES,
  PEOPLE_TABLE,
  generateRecordId,
} from "../constants";
import {
  CyberBtn,
  ErrorBanner,
  FingerprintSVG,
  GridBg,
  InputField,
  SectionHeading,
  SelectField,
} from "../components/FormFields";

const EMPTY_FORM = () => ({
  fullName: "",
  recordId: generateRecordId(),
  nationality: "",
});

function FingerprintUploadPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [err, setErr] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const set = (key) => (value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const load = useCallback((f) => {
    setErr("");
    if (!f.type.startsWith("image/")) {
      setErr("Please choose a valid image file.");
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setErr("Image is too large. Maximum size is 10 MB.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const clearFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) load(f);
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
    if (preview) URL.revokeObjectURL(preview);
    setForm(EMPTY_FORM());
    setFile(null);
    setPreview(null);
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
            {/* Breadcrumb */}
            <div
              className="flex items-center gap-1.5 text-[#4B5563] text-[9px] sm:text-[10px] uppercase tracking-[0.18em] mb-4 sm:mb-6"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              Dashboard <FaChevronRight size={9} />{" "}
              <span className="text-[#5B89D4]">Insert Record</span>
            </div>

            <div className="mb-6 sm:mb-8">
              <h2
                className="text-[#DDE1EC] text-xl sm:text-2xl font-bold"
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                Insert Database Record
              </h2>
              <p className="text-[#8A92A6] mt-1 sm:mt-1.5 text-xs sm:text-sm">
                Register a new subject and their biometric fingerprint data into
                the system.
              </p>
            </div>

            {/* Success state */}
            {submitted ? (
              <div className="border border-[#5B89D4]/20 rounded bg-[#1A1E2D] p-6 sm:p-10 lg:p-12 flex flex-col items-center gap-6 text-center shadow-[0_0_60px_rgba(0,240,255,0.05)]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#5B89D4]/30 bg-[#5B89D4]/8 flex items-center justify-center">
                  <FaCheck size={26} className="text-[#5B89D4]" />
                </div>
                <div>
                  <div
                    className="text-[#DDE1EC] text-lg sm:text-xl font-bold mb-2"
                    style={{ fontFamily: "Orbitron, sans-serif" }}
                  >
                    Record Inserted
                  </div>
                  <p className="text-[#8A92A6] text-xs sm:text-sm max-w-sm">
                    The biometric record for{" "}
                    <span className="text-[#DDE1EC] font-medium">
                      {form.fullName}
                    </span>{" "}
                    has been committed to the database.
                  </p>
                </div>

                {/* Summary card */}
                <div className="w-full max-w-sm bg-[#13151F] border border-[rgba(0,240,255,0.1)] rounded p-4 sm:p-5 text-left flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#4B5563]">Record ID</span>
                    <span
                      className="text-[#5B89D4] truncate max-w-[60%]"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {form.recordId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#4B5563]">Subject</span>
                    <span className="text-[#DDE1EC] truncate max-w-[60%] text-right">
                      {form.fullName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#4B5563]">Nationality</span>
                    <span className="text-[#DDE1EC]">{form.nationality}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#4B5563]">Inserted at</span>
                    <span
                      className="text-[#8A92A6] text-[10px] sm:text-xs"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                  <CyberBtn onClick={reset} outline className="w-full">
                    Insert Another
                  </CyberBtn>
                  <CyberBtn
                    onClick={() => navigate("/dashboard/fingerprint-upload")}
                    className="w-full"
                  >
                    Done
                  </CyberBtn>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* ── Left: form ── */}
                <div className="lg:col-span-3 flex flex-col gap-4 sm:gap-6">
                  {/* Personal Information */}
                  <div className="bg-[#1A1E2D] border border-[rgba(0,240,255,0.08)] rounded p-4 sm:p-6">
                    <SectionHeading>Personal Information</SectionHeading>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <InputField
                          label="Full Name"
                          placeholder="Subject full legal name"
                          value={form.fullName}
                          onChange={set("fullName")}
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <SelectField
                          label="Nationality"
                          value={form.nationality}
                          onChange={set("nationality")}
                          options={NATIONALITIES}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Classification */}
                  <div className="bg-[#1A1E2D] border border-[rgba(0,240,255,0.08)] rounded p-4 sm:p-6">
                    <SectionHeading>Classification</SectionHeading>
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-[#6B7280] text-[10px] uppercase tracking-[0.15em] flex items-center gap-1"
                        style={{ fontFamily: "JetBrains Mono, monospace" }}
                      >
                        Record ID <span className="text-[#5B89D4]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          value={form.recordId}
                          onChange={(e) => set("recordId")(e.target.value)}
                          className="w-full bg-[#13151F] border border-[rgba(0,240,255,0.18)] rounded-sm pl-3 pr-16 py-2.5 sm:py-3 text-[#5B89D4] text-xs sm:text-sm focus:outline-none focus:border-[#5B89D4]/50 focus:ring-1 focus:ring-[#5B89D4]/10 transition-all"
                          style={{ fontFamily: "JetBrains Mono, monospace" }}
                        />
                        <button
                          type="button"
                          onClick={() => set("recordId")(generateRecordId())}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#4B5563] hover:text-[#5B89D4] uppercase tracking-wider transition-colors px-1 py-1"
                          style={{ fontFamily: "JetBrains Mono, monospace" }}
                        >
                          Regen
                        </button>
                      </div>
                    </div>
                  </div>

                  {err && <ErrorBanner msg={err} />}
                </div>

                {/* ── Right: fingerprint upload + submit ── */}
                <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">
                  {/* Fingerprint upload */}
                  <div className="bg-[#1A1E2D] border border-[rgba(0,240,255,0.08)] rounded p-4 sm:p-6">
                    <SectionHeading>
                      Fingerprint Image{" "}
                      <span className="text-[#5B89D4]">*</span>
                    </SectionHeading>

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={onDrop}
                      onClick={() => {
                        if (!preview) fileRef.current?.click();
                      }}
                      className={`relative border rounded transition-all duration-300 ${
                        dragOver
                          ? "border-[#5B89D4] bg-[#5B89D4]/5 shadow-[0_0_30px_rgba(0,240,255,0.1)]"
                          : preview
                            ? "border-[rgba(0,240,255,0.25)] bg-[#13151F]"
                            : "border-dashed border-[rgba(0,240,255,0.14)] bg-[#13151F] cursor-pointer hover:border-[rgba(0,240,255,0.3)]"
                      }`}
                    >
                      {preview ? (
                        <div className="p-4 sm:p-5 flex flex-col items-center gap-3 sm:gap-4">
                          <div className="relative">
                            <img
                              src={preview}
                              alt="Fingerprint to register"
                              className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded border border-[rgba(0,240,255,0.2)] grayscale"
                            />
                            <div
                              className="absolute top-1.5 right-1.5 border border-[#5B89D4]/30 rounded px-1.5 py-0.5 text-[#5B89D4] text-[8px] bg-[#13151F]/90"
                              style={{
                                fontFamily: "JetBrains Mono, monospace",
                              }}
                            >
                              READY
                            </div>
                          </div>
                          <div className="text-center w-full px-2">
                            <div className="text-[#DDE1EC] text-xs font-medium truncate max-w-45 mx-auto">
                              {file?.name}
                            </div>
                            <div
                              className="text-[#4B5563] text-[10px] mt-0.5"
                              style={{
                                fontFamily: "JetBrains Mono, monospace",
                              }}
                            >
                              {file
                                ? `${(file.size / 1024).toFixed(1)} KB`
                                : ""}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearFile();
                            }}
                            className="text-xs text-[#4B5563] hover:text-[#8A92A6] underline transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="py-8 sm:py-12 flex flex-col items-center gap-3 sm:gap-4">
                          <FingerprintSVG
                            size={80}
                            className="sm:w-25 sm:h-25"
                          />
                          <div className="text-center px-4">
                            <div className="text-[#DDE1EC] text-xs font-medium">
                              Drop fingerprint image
                            </div>
                            <div className="text-[#6B7280] text-xs mt-0.5">
                              or click to browse
                            </div>
                          </div>
                          <div
                            className="text-[#374151] text-[8px] uppercase tracking-wider"
                            style={{ fontFamily: "JetBrains Mono, monospace" }}
                          >
                            JPG · PNG · BMP · max 10 MB
                          </div>
                        </div>
                      )}
                    </div>

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) load(f);
                        e.target.value = "";
                      }}
                    />
                  </div>

                  {/* Record preview */}
                  <div className="bg-[#1A1E2D] border border-[rgba(0,240,255,0.07)] rounded p-4 sm:p-5">
                    <div
                      className="text-[#6B7280] text-[9px] uppercase tracking-[0.2em] mb-3 sm:mb-4"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      Record Preview
                    </div>
                    <div className="flex flex-col gap-2 sm:gap-2.5">
                      {[
                        {
                          k: "Record ID",
                          v: form.recordId || "—",
                          mono: true,
                          cyan: true,
                        },
                        {
                          k: "Subject",
                          v: form.fullName || "—",
                          mono: false,
                          cyan: false,
                        },
                        {
                          k: "Nationality",
                          v: form.nationality || "—",
                          mono: false,
                          cyan: false,
                        },
                      ].map((row) => (
                        <div
                          key={row.k}
                          className="flex justify-between items-center text-xs py-1.5 border-b border-[rgba(0,240,255,0.04)] last:border-0"
                        >
                          <span className="text-[#4B5563] shrink-0">
                            {row.k}
                          </span>
                          <span
                            className={`text-right max-w-[60%] truncate ${
                              row.cyan
                                ? "text-[#5B89D4]"
                                : row.v === "—"
                                  ? "text-[#374151]"
                                  : "text-[#8A92A6]"
                            }`}
                            style={
                              row.mono
                                ? { fontFamily: "JetBrains Mono, monospace" }
                                : {}
                            }
                          >
                            {row.v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  {saving ? (
                    <div className="border border-[rgba(0,240,255,0.12)] rounded bg-[#1A1E2D] py-5 flex flex-col items-center gap-4">
                      <FingerprintSVG size={80} scanning />
                      <div
                        className="text-[#5B89D4] text-xs"
                        style={{ fontFamily: "Orbitron, sans-serif" }}
                      >
                        Committing to Database…
                      </div>
                      <div className="w-3/4">
                        <div className="h-px bg-[#1E2436] overflow-hidden">
                          <motion.div
                            className="h-full bg-[#5B89D4]"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2.2, ease: "easeInOut" }}
                          />
                        </div>
                      </div>
                    </div>
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
