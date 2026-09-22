import { InputField, SectionHeading } from "../../fingerprint/components/FormFields";

/** "Reference Details" card holding the optional `label` field. */
export function MarkDetailsCard({ label, onChange, placeholder }) {
  return (
    <div className="bg-[#1A1E2D] border border-[rgba(91,137,212,0.08)] rounded p-4 sm:p-6">
      <SectionHeading>Reference Details</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <InputField
            label="Label"
            placeholder={placeholder}
            value={label}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
