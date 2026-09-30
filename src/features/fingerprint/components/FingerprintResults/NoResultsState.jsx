import { TbFingerprint } from "react-icons/tb";
import { CyberBtn } from "../shared";

/**
 * Rendered when the results route is opened without a comparison response
 * (direct URL visit, refresh, or a back/forward cache restore).
 */
export function NoResultsState({ onBack }) {
  return (
    <div className="border border-[rgba(91,137,212,0.12)] rounded bg-[#1A1E2D] p-8 sm:p-12 flex flex-col items-center gap-5 text-center">
      <div className="text-[#5B89D4]">
        <TbFingerprint className="w-16 h-16" />
      </div>
      <div>
        <div
          className="text-[#DDE1EC] text-base sm:text-lg font-bold mb-2"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          No Analysis Result
        </div>
        <p className="text-[#8A92A6] text-xs sm:text-sm max-w-sm">
          This page only shows a result right after a fingerprint comparison
          runs. Upload a print to start a new analysis.
        </p>
      </div>
      <CyberBtn onClick={onBack}>Start an Analysis</CyberBtn>
    </div>
  );
}
