import { motion } from "motion/react";
import { DocumentSVG, LoadingScreen } from "../../shared";

/**
 * Full-screen state shown while `compare-documents` cross-references the
 * uploaded file against the library: two documents with a pulsing link
 * between them.
 */
export function AnalysisScanningState() {
  return (
    <LoadingScreen
      title="Cross-Referencing Library"
      subtitle="Searching for highest similarity match…"
    >
      <div className="relative flex items-center gap-6 md:gap-10">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          <DocumentSVG scanning size={180} />
        </motion.div>
        <div className="flex flex-col gap-1">
          <motion.div
            className="w-8 h-0.5 bg-[#5B89D4]/40 rounded"
            animate={{ scaleX: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-5 h-0.5 bg-[#5B89D4]/30 rounded"
            animate={{ scaleX: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.15 }}
          />
          <motion.div
            className="w-8 h-0.5 bg-[#5B89D4]/40 rounded"
            animate={{ scaleX: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          />
        </div>
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
        >
          <DocumentSVG size={180} />
        </motion.div>
      </div>
    </LoadingScreen>
  );
}
