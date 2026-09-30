import { InputField, SectionHeading, SelectField } from "../shared";
import { NATIONALITIES, generateRecordId } from "../../constants";

/**
 * Left-hand form of the upload page: personal information + record ID
 * classification.
 *
 * `onPatch` receives a partial form object, e.g. `{ fullName: "Jane Doe" }`.
 */
export function RecordForm({ form, onPatch }) {
  return (
    <>
      {/* Personal Information */}
      <div className="bg-[#1A1E2D] border border-[rgba(0,240,255,0.08)] rounded p-4 sm:p-6">
        <SectionHeading>Personal Information</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <InputField
              label="Full Name"
              placeholder="Subject full legal name"
              value={form.fullName}
              onChange={(value) => onPatch({ fullName: value })}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <SelectField
              label="Nationality"
              value={form.nationality}
              onChange={(value) => onPatch({ nationality: value })}
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
              onChange={(e) => onPatch({ recordId: e.target.value })}
              className="w-full bg-[#13151F] border border-[rgba(0,240,255,0.18)] rounded-sm pl-3 pr-16 py-2.5 sm:py-3 text-[#5B89D4] text-xs sm:text-sm focus:outline-none focus:border-[#5B89D4]/50 focus:ring-1 focus:ring-[#5B89D4]/10 transition-all"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            />
            <button
              type="button"
              onClick={() => onPatch({ recordId: generateRecordId() })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#4B5563] hover:text-[#5B89D4] uppercase tracking-wider transition-colors px-1 py-1"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              Regen
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
