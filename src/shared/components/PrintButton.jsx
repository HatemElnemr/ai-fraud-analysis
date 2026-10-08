import { FiPrinter } from "react-icons/fi";

/**
 * Opens the browser's print dialog on the current results screen — print
 * on paper, or "Save as PDF" from the dialog itself. No PDF library: the
 * shared `@media print` rules in `src/index.css` strip the dashboard
 * chrome (nav, buttons, grid backdrop) and turn the dark UI into a white,
 * page-broken report.
 *
 * Screen-only: hidden on paper both by `print:hidden` and by the
 * stylesheet's blanket `button` rule.
 */
export function PrintButton({
  label = "Print / Save as PDF",
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`flex items-center justify-center gap-1.5 text-xs border border-[rgba(91,137,212,0.15)] text-[#8A92A6] hover:text-[#5B89D4] hover:border-[rgba(91,137,212,0.35)] px-3 py-2 rounded transition-colors font-mono print:hidden ${className}`}
    >
      <FiPrinter size={13} />
      {label}
    </button>
  );
}
