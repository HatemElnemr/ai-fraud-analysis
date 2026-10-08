/**
 * Full-screen "work in progress" shell shared by both document pages
 * (upload in flight, comparison running).
 *
 * The page-specific artwork is passed as `children`; the title/subtitle
 * describe what the backend is currently doing.
 */
export function LoadingScreen({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[#13151F] flex flex-col items-center justify-center p-6 text-white font-sans">
      <div className="relative z-10 flex flex-col items-center gap-8">
        {children}
        <div className="text-center">
          <p className="text-[#DDE1EC] text-sm tracking-[0.2em] uppercase mb-1 font-semibold">
            {title}
          </p>
          <p className="text-[#6B7280] text-xs font-mono">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
