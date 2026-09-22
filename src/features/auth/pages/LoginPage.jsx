import { motion } from "motion/react";
import BrandPanel from "../components/BrandPanel";
import LoginForm from "../components/LoginForm";
import { GridBg } from "../../fingerprint/components/FormFields";

function LoginPage() {
  return (
    <motion.div
      className="flex"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <GridBg />
      <BrandPanel paragraph="AI-powered forensic document analysis" />
      <LoginForm />
    </motion.div>
  );
}

export default LoginPage;
