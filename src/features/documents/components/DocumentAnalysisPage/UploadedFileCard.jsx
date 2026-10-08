/**
 * Small card echoing the file that was compared (name + size) — the only
 * part of the request that doesn't live in the database.
 */
export function UploadedFileCard({ file }) {
  if (!file) return null;

  return (
    <div className="border border-[rgba(91,137,212,0.08)] bg-[#13151F] rounded-lg p-4">
      <p className="text-[#4B5563] text-[10px] tracking-[0.15em] uppercase mb-2 font-mono">
        Uploaded File
      </p>
      <p className="text-[#8A92A6] text-xs font-medium truncate">{file.name}</p>
      <p className="text-[#4B5563] text-[10px] mt-0.5 font-mono">
        {(file.size / 1024).toFixed(0)} KB
      </p>
    </div>
  );
}
