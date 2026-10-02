import {
  CyberBtn,
  Dropzone,
  DropzoneEmptyState,
  SectionHeading,
} from "../../fingerprint/components/shared";

/**
 * Upload panel of the form step: section heading, drag & drop zone (empty or
 * preview), and the submit action. (The step's error banner lives in
 * `FormStep`, rendered full-width above the grid.)
 *
 * File state lives in the owning page (`useImageFile`); the shared `Dropzone`
 * owns the interaction (drag visuals, click-to-open, hidden input) and this
 * component supplies the mark-specific copy and the white preview card that
 * keeps dark ink legible.
 */
export function UploadZoneCard({
  heading,
  dropText,
  hint,
  formats,
  icon,
  alt,
  file,
  preview,
  onSelect,
  onClear,
  onSubmit,
  submitLabel,
  idleLabel,
}) {
  return (
    <div className="bg-[#1A1E2D] border border-[rgba(91,137,212,0.08)] rounded-lg p-5 sm:p-6 flex flex-col gap-5">
      <SectionHeading>{heading}</SectionHeading>

      <Dropzone
        preview={preview}
        onSelect={onSelect}
        tone="blue"
        className="flex-1 min-h-50 flex flex-col items-center justify-center"
      >
        {preview ? (
          <div className="p-4 sm:p-5 w-full flex flex-col items-center gap-4">
            <div className="w-full rounded border border-[rgba(255,255,255,0.1)] bg-white flex items-center justify-center p-4 min-h-32.5">
              <img
                src={preview}
                alt={alt}
                className="max-h-28 max-w-full object-contain"
              />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <div className="text-[#DDE1EC] text-xs truncate max-w-45 sm:max-w-55">
                {file?.name}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="text-[10px] sm:text-xs text-[#4B5563] hover:text-[#8A92A6] underline transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <DropzoneEmptyState
            size="lg"
            icon={icon}
            dropText={dropText}
            hint={hint}
            formats={formats}
          />
        )}
      </Dropzone>

      <CyberBtn onClick={onSubmit} disabled={!file}>
        {file ? submitLabel : idleLabel}
      </CyberBtn>
    </div>
  );
}
