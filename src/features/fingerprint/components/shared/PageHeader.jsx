import { FaChevronRight } from "react-icons/fa";

/**
 * Breadcrumb + title + description block shared by the fingerprint pages.
 *
 * `crumb` is the last (highlighted) breadcrumb step; the "Dashboard" root is
 * always rendered for consistency across the dashboard.
 */
export function PageHeader({ crumb, title, description, className = "" }) {
  return (
    <div className={className}>
      <div
        className="flex items-center gap-1.5 text-[#4B5563] text-[9px] sm:text-[10px] uppercase tracking-[0.18em] mb-4 sm:mb-6"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        Dashboard <FaChevronRight size={9} />{" "}
        <span className="text-[#5B89D4]">{crumb}</span>
      </div>

      <div className="mb-6 sm:mb-8">
        <h2
          className="text-[#DDE1EC] text-xl sm:text-2xl font-bold"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          {title}
        </h2>
        {description && (
          <p className="text-[#8A92A6] mt-1 sm:mt-1.5 text-xs sm:text-sm">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
