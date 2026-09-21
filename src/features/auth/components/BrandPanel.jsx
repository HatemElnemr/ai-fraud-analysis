import { motion } from "motion/react";
import logo from "/assets/logo.png";

function BrandPanel({ paragraph }) {
  return (
    <motion.div
      className="hidden sm:flex flex-1 flex-col justify-center items-center h-screen border-r border-[#00F0FF12]"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <motion.img
        src={logo}
        alt="Logo"
        width="232"
        height="232"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <div className="pt-8 flex flex-col justify-center items-center text-center">
        <h1 className="text-[#F3F4F6] font-orbitron uppercase leading-9 text-[30px] font-bold tracking-[3.6px]">
          Docsense x pro{" "}
        </h1>
        <p className="pt-3 text-[#9CA3AF] font-inter text-[12px] max-w-100 leading-4 tracking-[2.16px] font-normal uppercase">
          {paragraph}
        </p>
      </div>
    </motion.div>
  );
}

export default BrandPanel;
