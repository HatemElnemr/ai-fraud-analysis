/**
 * Small status card under the analysis sidebar showing the file that is
 * about to be compared (name + size), or an empty placeholder.
 */
export function SelectedFileCard({ file }) {
  return (
    <div className="border border-[rgba(91,137,212,0.08)] bg-[#13151F] rounded-lg p-4">
      <p className="text-[#4B5563] text-[10px] mb-2 font-mono">Selected file</p>
      {file ? (
        <>
          <p className="text-[#8A92A6] text-xs font-medium truncate">
            {file.name}
          </p>
          <p className="text-[#4B5563] text-[10px] mt-0.5 font-mono">
            {(file.size / 1024).toFixed(0)} KB
          </p>
        </>
      ) : (
        <p className="text-[#4B5563] text-xs italic">No file selected</p>
      )}
    </div>
  );
}
