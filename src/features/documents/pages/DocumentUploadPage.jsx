import { useState } from "react";
import { useNavigate } from "react-router";
import { FiBookOpen, FiUploadCloud } from "react-icons/fi";
import { ACCEPTED_DOC_FORMATS, ANALYSIS_PATH } from "../constants";
import { useUploadDocument } from "../hooks/useUploadDocument";
import { ErrorBanner, FileDropzone, PageHeader } from "../shared";
import {
  DocumentDetailsForm,
  UploadPreviewPanel,
  UploadSuccessPanel,
  UploadingState,
} from "../components/DocumentUploadPage";

const EMPTY_FORM = () => ({ title: "", contextText: "" });

/**
 * Stores a new document: the file is staged in `document-bucket`, then a
 * `documents` row is inserted (`title`, `file_type`, `context_text`,
 * `document_url`).
 *
 * Form/file state lives here, the request lives in `useUploadDocument`,
 * and the markup is split into the shared dropzone primitives and the
 * `DocumentUploadPage` cards. Renders three screens in place:
 * form → saving → success.
 */
export default function DocumentUploadPage({
  user = { name: "Operator" },
  onNavigate,
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const { submit, saving, error, savedDocument, clearError, reset } =
    useUploadDocument();

  /** Editing the form or picking a file also clears a stale failure. */
  const patch = (next) => {
    clearError();
    setForm((prev) => ({ ...prev, ...next }));
  };
  const handleSelect = (nextFile) => {
    clearError();
    setFile(nextFile);
  };

  const handleSubmit = () => submit({ ...form, file });

  const handleUploadAnother = () => {
    reset();
    setForm(EMPTY_FORM());
    setFile(null);
  };

  const handleAnalyze = () => {
    if (onNavigate) onNavigate("doc-compare");
    else navigate(ANALYSIS_PATH);
  };

  if (saving) {
    return <UploadingState />;
  }

  if (savedDocument) {
    return (
      <UploadSuccessPanel
        record={savedDocument}
        fileName={file?.name ?? ""}
        userName={user.name}
        onUploadAnother={handleUploadAnother}
        onAnalyze={handleAnalyze}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#13151F] text-white font-sans relative px-4 py-8 md:px-10">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          icon={<FiBookOpen size={14} className="text-[#5B89D4]" />}
          eyebrow="Document Library"
          title="Upload Document"
          description="Add a new document to the forensic evidence library for future comparison and verification."
        />

        <ErrorBanner message={error} />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* ── Left: metadata + file + submit ── */}
          <div className="md:col-span-3 space-y-4">
            <DocumentDetailsForm form={form} onPatch={patch} />

            <div className="border border-[rgba(91,137,212,0.12)] bg-[#1A1E2D] rounded-lg p-6">
              <h3 className="text-[#DDE1EC] text-xs font-bold uppercase tracking-wider mb-2 font-mono">
                Attach Document
              </h3>
              <FileDropzone
                file={file}
                onSelect={handleSelect}
                className="p-6 gap-3"
                leading={
                  <FiUploadCloud size={28} className="text-[#5B89D4]/70" />
                }
              >
                <div className="text-center">
                  <p className="text-[#8A92A6] text-sm">
                    Drop file here or click to browse
                  </p>
                  <p className="text-[#4B5563] text-xs mt-1 font-mono">
                    {ACCEPTED_DOC_FORMATS}
                  </p>
                </div>
              </FileDropzone>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-[#5B89D4] hover:bg-[#6A96DB] text-[#13151F] font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 font-mono"
            >
              <FiUploadCloud size={16} />
              Upload to Library
            </button>
          </div>

          {/* ── Right: live preview of the pending row ── */}
          <div className="md:col-span-2">
            <UploadPreviewPanel
              title={form.title}
              file={file}
              userName={user.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
