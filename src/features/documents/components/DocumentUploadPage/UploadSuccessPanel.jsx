import { motion } from "motion/react";
import { FiCheckCircle } from "react-icons/fi";

/**
 * Confirmation screen after a successful insert into `documents`.
 *
 * `record` is the row returned by the insert (real id + `created_at`);
 * `fileName` covers the one detail the table doesn't store — the original
 * file's name on disk.
 */
export function UploadSuccessPanel({
  record,
  fileName,
  userName,
  onUploadAnother,
  onAnalyze,
}) {
  return (
    <div className="min-h-screen bg-[#13151F] flex items-center justify-center p-6 text-white font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="border border-[rgba(91,137,212,0.15)] bg-[#1A1E2D] rounded-lg p-8 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 flex items-center justify-center mx-auto mb-5">
            <FiCheckCircle size={24} className="text-[#10B981]" />
          </div>
          <h2 className="text-[#DDE1EC] text-xl font-semibold mb-2 tracking-wide">
            Document Stored
          </h2>
          <p className="text-[#6B7280] text-xs mb-6 font-mono">
            Document indexed successfully in the library
          </p>

          <div className="bg-[#13151F] rounded border border-[rgba(91,137,212,0.1)] p-4 text-left space-y-2.5 mb-6">
            {[
              ["Document ID", record?.id ?? "—"],
              ["Title", record?.title ?? "—"],
              ["File", fileName],
              ["Uploaded by", userName],
              [
                "Timestamp",
                record?.created_at
                  ? new Date(record.created_at).toLocaleString()
                  : new Date().toLocaleString(),
              ],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-start gap-4">
                <span className="text-[#6B7280] text-[11px] shrink-0 font-mono">
                  {k}
                </span>
                <span className="text-[#8A92A6] text-[11px] text-right font-mono truncate">
                  {v}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onUploadAnother}
              className="flex-1 py-2 text-xs border border-[rgba(91,137,212,0.2)] text-[#8A92A6] hover:text-[#5B89D4] rounded transition-colors font-mono"
            >
              Upload Another
            </button>
            <button
              onClick={onAnalyze}
              className="flex-1 py-2 text-xs bg-[#5B89D4] text-[#13151F] rounded font-semibold hover:bg-[#6A96DB] transition-colors font-mono"
            >
              Analyze a Doc
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
