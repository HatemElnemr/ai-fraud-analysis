import { AnimatePresence, motion } from "motion/react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import logo from "/assets/logo.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../../../shared/utils/supabase";
import { registerSchema } from "../schemas/registerSchema";

function RegisterForm() {
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [confirmPasswordIsVisible, setConfirmPasswordIsVisible] =
    useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function togglePasswordVisibility() {
    setPasswordIsVisible(!passwordIsVisible);
  }
  function toggleConfirmPasswordVisibility() {
    setConfirmPasswordIsVisible(!confirmPasswordIsVisible);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    // Clear any form-level (server) error while the user edits.
    setFormError("");

    const result = registerSchema.safeParse(updatedForm);

    const getFieldError = (field) =>
      result.success
        ? ""
        : (result.error.issues.find((issue) => issue.path[0] === field)
            ?.message ?? "");

    setErrors((prev) => {
      const nextErrors = { ...prev, [name]: getFieldError(name) };

      // The confirm-password check depends on the password value, so
      // revalidate it whenever the password changes — but only if the
      // user has already interacted with the field, to avoid showing
      // "Confirm Password is required" before they reach it.
      if (
        name === "password" &&
        (updatedForm.confirmPassword !== "" || prev.confirmPassword)
      ) {
        nextErrors.confirmPassword = getFieldError("confirmPassword");
      }

      return nextErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      // Surface every invalid field at once (first message per field).
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        data: {
          display_name: result.data.displayName,
        },
      },
    });

    setLoading(false);
    if (error) {
      setFormError(error.message);
      return;
    }

    navigate("/dashboard/fingerprint-upload");
  };

  return (
    <motion.div
      className="flex flex-col justify-center items-center lg:flex-2 flex-1 p-8 not-sm:min-h-screen"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="sm:hidden w-93.75 flex gap-2.5 items-start">
        <img src={logo} alt="logo" width={24} height={24} />
        <h1 className="text-[#F3F4F6] text-[16px] font-orbitron font-bold uppercase leading-6 tracking-[1.6px]">
          Docsense x pro
        </h1>
      </div>
      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col sm:w-[384px] w-93.75 pt-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        <div className="flex flex-col gap-1">
          <h1 className="font-orbitron font-bold text-2xl leading-8 text-[#F3F4F6]">
            Register Account
          </h1>
          <p className="font-inter font-normal text-[14px] leading-5 text-[#9CA3AF]">
            Create your operator credentials below.
          </p>
        </div>
        <div className="flex flex-col gap-4 pt-8">
          <div className="flex flex-col gap-1.5">
            <label className="text-[#6B7280] font-inter font-medium text-[10px] leading-3.75 uppercase tracking-[1.5px]">
              Full Name
            </label>
            <input
              className={`bg-[#080F1E] border px-4 py-3 placeholder:text-[#374151] text-[14px] font-inter text-[#F3F4F6] outline-none focus:border-[#00F0FF] ${
                errors.displayName ? "border-red-500" : "border-[#00F0FF1F]"
              }`}
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
            {errors.displayName && (
              <p className="text-[#EF4444] text-[12px]">{errors.displayName}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#6B7280] font-inter font-medium text-[10px] leading-3.75 uppercase tracking-[1.5px]">
              Email Address
            </label>
            <input
              className={`bg-[#080F1E] border px-4 py-3 placeholder:text-[#374151] text-[14px] font-inter text-[#F3F4F6] outline-none focus:border-[#00F0FF] ${
                errors.email ? "border-red-500" : "border-[#00F0FF1F]"
              }`}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="operator@agency.gov"
            />
            {errors.email && (
              <p className="text-[#EF4444] text-[12px]">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[#6B7280] font-inter font-medium text-[10px] leading-3.75 uppercase tracking-[1.5px]">
              Password
            </label>
            <div className="relative ">
              <input
                className={`w-full bg-[#080F1E] border px-4 py-3 placeholder:text-[#374151] text-[14px] font-inter text-[#F3F4F6] outline-none focus:border-[#00F0FF] ${
                  errors.password ? "border-red-500" : "border-[#00F0FF1F]"
                }`}
                type={passwordIsVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
              <button
                className="absolute w-3.75 h-3.75 right-3 top-[15.5px] text-[#4B5563] cursor-pointer"
                type="button"
                onClick={togglePasswordVisibility}
              >
                {passwordIsVisible ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[#EF4444] text-[12px]">{errors.password}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[#6B7280] font-inter font-medium text-[10px] leading-3.75 uppercase tracking-[1.5px]">
              Confirm Password
            </label>
            <div className="relative ">
              <input
                className={`w-full bg-[#080F1E] border px-4 py-3 placeholder:text-[#374151] text-[14px] font-inter text-[#F3F4F6] outline-none focus:border-[#00F0FF] ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-[#00F0FF1F]"
                }`}
                type={confirmPasswordIsVisible ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
              <button
                className="absolute w-3.75 h-3.75 right-3 top-[15.5px] text-[#4B5563] cursor-pointer"
                type="button"
                onClick={toggleConfirmPasswordVisibility}
              >
                {confirmPasswordIsVisible ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[#EF4444] text-[12px]">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
        <div className="min-h-6 text-[#EF4444] font-inter leading-5 text-[14px]">
          <AnimatePresence mode="wait">
            {formError && (
              <motion.p
                key={formError}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {formError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          formNoValidate
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="bg-[#00F0FF] my-6 font-orbitron font-bold text-[12px] leading-4 tracking-[1.8px] uppercase w-full py-3 cursor-pointer"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </motion.button>

        <div className="text-[#4B5563] font-inter leading-5 text-[14px] text-center">
          Already have access?{" "}
          <Link to="/login" className="text-[#00F0FF] hover:underline">
            Login
          </Link>
        </div>
      </motion.form>
    </motion.div>
  );
}

export default RegisterForm;
