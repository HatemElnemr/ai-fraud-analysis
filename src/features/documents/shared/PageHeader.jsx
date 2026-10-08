/**
 * Eyebrow + title + description header shared by the two document form
 * screens. The icon (react element) leads the uppercase eyebrow line.
 */
export function PageHeader({ icon, eyebrow, title, description }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[#5B89D4] text-[10px] tracking-[0.25em] uppercase font-mono">
          {eyebrow}
        </span>
      </div>
      <h1 className="text-[#DDE1EC] text-2xl md:text-3xl font-bold mb-1 tracking-wide">
        {title}
      </h1>
      <p className="text-[#6B7280] text-sm">{description}</p>
    </div>
  );
}
