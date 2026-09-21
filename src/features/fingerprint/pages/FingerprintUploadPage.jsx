import { motion } from "motion/react";

function FingerprintUploadPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="p-8"
    >
      FingerprintUploadPage
    </motion.div>
  );
}

export default FingerprintUploadPage;
