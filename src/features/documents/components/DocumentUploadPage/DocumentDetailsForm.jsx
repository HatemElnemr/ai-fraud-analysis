/**
 * "Document Details" card: the persisted metadata fields of the upload form
 * (`title` and the optional `content_text`). Kept in sync with the
 * `documents` table — no field here lacks a column.
 *
 * `form` is `{ title, contextText }`; `onPatch` merges partial updates.
 */
export function DocumentDetailsForm({ form, onPatch }) {
  return (
    <div className="border border-[rgba(91,137,212,0.12)] bg-[#1A1E2D] rounded-lg p-6">
      <h3 className="text-[#DDE1EC] text-xs font-bold uppercase tracking-wider mb-4 border-b border-[rgba(91,137,212,0.1)] pb-2 font-mono">
        Document Details
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-[#8A92A6] mb-1">
            Document Title *
          </label>
          <input
            type="text"
            placeholder="e.g. Narcotic Report — Week 1"
            value={form.title}
            onChange={(e) => onPatch({ title: e.target.value })}
            className="w-full bg-[#13151F] border border-[rgba(91,137,212,0.2)] rounded px-3 py-2 text-xs text-[#DDE1EC] focus:outline-none focus:border-[#5B89D4]"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-[#8A92A6] mb-1">
            Context / Description
          </label>
          <textarea
            rows={3}
            placeholder="Optional context about this document…"
            value={form.contextText}
            onChange={(e) => onPatch({ contextText: e.target.value })}
            className="w-full bg-[#13151F] border border-[rgba(91,137,212,0.2)] rounded px-3 py-2 text-xs text-[#DDE1EC] focus:outline-none focus:border-[#5B89D4] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
