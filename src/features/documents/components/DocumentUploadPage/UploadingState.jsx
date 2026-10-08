import { motion } from "motion/react";
import { DocumentSVG, LoadingScreen } from "../../shared";

/**
 * Full-screen state shown while the file is being staged in
 * `document-bucket` and the `documents` row is being written.
 */
export function UploadingState() {
  return (
    <LoadingScreen
      title="Uploading to Library"
      subtitle="Encrypting and indexing document…"
    >
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <DocumentSVG scanning size={220} />
      </motion.div>
    </LoadingScreen>
  );
}
