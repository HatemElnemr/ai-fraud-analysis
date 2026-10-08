import { ACCEPTED_DOC_FORMATS } from "../../constants";
import { DocumentSVG, FileDropzone } from "../../shared";

/**
 * "Document Upload" card: the dropzone that collects the file to compare.
 * The file itself stays with the owning page.
 */
export function AnalysisDropzoneCard({ file, onSelect }) {
  return (
    <div className="border border-[rgba(91,137,212,0.12)] bg-[#1A1E2D] rounded-lg p-6">
      <h3 className="text-[#DDE1EC] text-xs font-bold uppercase tracking-wider mb-2 font-mono">
        Document Upload
      </h3>
      <FileDropzone
        file={file}
        onSelect={onSelect}
        className="p-8 gap-4"
        idleClassName="border-[rgba(91,137,212,0.15)] hover:border-[rgba(91,137,212,0.3)]"
        selectedMeta="ready for analysis"
        showCheck
      >
        <>
          <DocumentSVG size={150} />
          <div className="text-center">
            <p className="text-[#8A92A6] text-sm">
              Drop document here or click to browse
            </p>
            <p className="text-[#4B5563] text-xs mt-1 font-mono">
              {ACCEPTED_DOC_FORMATS}
            </p>
          </div>
        </>
      </FileDropzone>
    </div>
  );
}
