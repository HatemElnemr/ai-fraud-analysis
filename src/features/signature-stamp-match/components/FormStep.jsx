import { FiUpload } from "react-icons/fi";
import { ErrorBanner } from "../../fingerprint/components/shared";
import { AnalysisScopeCard } from "./AnalysisScopeCard";
import { UploadZoneCard } from "./UploadZoneCard";

/**
 * Form step of an analysis page: scope card, upload zone, and the error
 * banner — extracted from the page so the page only wires state.
 *
 * The error renders as its own full-width banner above the grid (rather
 * than buried inside the upload card) so a failed run is impossible to
 * miss; picking a fresh file clears it through the page's `handleSelect`.
 *
 * Everything mark-specific arrives via `config` (the `SIGNATURE_ANALYSIS` /
 * `STAMP_ANALYSIS` object) and `scopeIcon` (the per-mark SVG).
 */
export function FormStep({
  config,
  scopeIcon,
  file,
  preview,
  error,
  onSelect,
  onClear,
  onSubmit,
}) {
  return (
    <>
      {error && (
        <div className="mb-6">
          <ErrorBanner msg={error} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalysisScopeCard
          icon={scopeIcon}
          title={config.scope.title}
          subtitle={config.scope.subtitle}
          parametersLabel={config.scope.parametersLabel}
          parameters={config.scope.parameters}
        />

        <UploadZoneCard
          heading={config.upload.heading}
          dropText={config.upload.dropText}
          hint={config.upload.hint}
          formats={config.upload.formats}
          icon={
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border border-[rgba(91,137,212,0.15)] bg-[#1A1E2D] flex items-center justify-center">
              <FiUpload size={20} className="text-[#5B89D4]" />
            </div>
          }
          alt={config.upload.alt}
          file={file}
          preview={preview}
          onSelect={onSelect}
          onClear={onClear}
          onSubmit={onSubmit}
          submitLabel={config.upload.submitLabel}
          idleLabel={config.upload.idleLabel}
        />
      </div>
    </>
  );
}
