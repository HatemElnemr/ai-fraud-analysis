import { motion } from "motion/react";
import BrandPanel from "../components/BrandPanel";
import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
  return (
    <motion.div
      className="flex"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <BrandPanel paragraph="Create your operator account to access the identification system." />
      <RegisterForm />
    </motion.div>
  );
}

export default RegisterPage;
