import { SectionHeading } from "../../fingerprint/components/shared";

/**
 * "Analysis Scope" card: what kind of mark is being verified and which
 * parameters the comparison checks.
 *
 * The mark-specific artwork (`icon`) and copy come from the owning feature's
 * constants, so signature and stamp pages share this layout.
 */
export function AnalysisScopeCard({
  heading = "Analysis Scope",
  icon,
  title,
  subtitle,
  parametersLabel,
  parameters = [],
}) {
  return (
    <div className="bg-[#1A1E2D] border border-[rgba(91,137,212,0.08)] rounded-lg p-5 sm:p-6 flex flex-col gap-5">
      <SectionHeading>{heading}</SectionHeading>

      <div className="flex flex-col items-center p-6 border border-[rgba(91,137,212,0.12)] bg-[#13151F] rounded-lg text-center gap-3">
        {icon}
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#DDE1EC]">
            {title}
          </div>
          <div className="text-[#6B7280] text-[11px] mt-1">{subtitle}</div>
        </div>
      </div>

      <div className="border-t border-[rgba(91,137,212,0.06)] pt-4">
        <div className="text-[#4B5563] text-[9px] sm:text-[10px] uppercase tracking-wider mb-3 font-mono">
          {parametersLabel}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
          {parameters.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-xs text-[#8A92A6]"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#5B89D4] shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
