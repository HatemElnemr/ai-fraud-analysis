import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import logo from "/assets/logo.png";
import { useState } from "react";
import { supabase } from "../../utils/supabase";
import { Link, useNavigate } from "react-router";
// import { useAuth } from "../../store/AuthContext";

function RegisterForm() {
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [confirmPasswordIsVisible, setConfirmPasswordIsVisible] =
    useState(false);
  const navigate = useNavigate();
  // const { role } = useAuth();

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function togglePasswordVisibility() {
    setPasswordIsVisible(!passwordIsVisible);
  }
  function toggleConfirmPasswordVisibility() {
    setConfirmPasswordIsVisible(!confirmPasswordIsVisible);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { displayName, email, password, confirmPassword } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (displayName.trim() === "") {
      setErrorMessage("Full Name is required.");
      return;
    }
    if (email.trim() === "") {
      setErrorMessage("Email Address is required.");
      return;
    }
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.trim() === "") {
      setErrorMessage("Password is required.");
      return;
    }
    if (password.trim().length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (confirmPassword.trim() === "") {
      setErrorMessage("Confirm Password is required.");
      return;
    }
    if (confirmPassword.trim() !== password.trim()) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    setLoading(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    } else {
      navigate("/dashboard/fingerprint-uplaod");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center lg:flex-2 flex-1 p-8 not-sm:min-h-screen">
      <div className="sm:hidden w-93.75 flex gap-2.5 items-start">
        <img src={logo} alt="logo" width={24} height={24} />
        <h1 className="text-[#F3F4F6] text-[16px] font-orbitron font-bold uppercase leading-6 tracking-[1.6px]">
          Docsense x pro
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:w-[384px] w-93.75 pt-10"
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
              className="bg-[#080F1E] border border-[#00F0FF1F] px-4 py-3 placeholder:text-[#374151] text-[14px] font-inter text-[#F3F4F6] outline-none focus:border-[#00F0FF]"
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#6B7280] font-inter font-medium text-[10px] leading-3.75 uppercase tracking-[1.5px]">
              Email Address
            </label>
            <input
              className="bg-[#080F1E] border border-[#00F0FF1F] px-4 py-3 placeholder:text-[#374151] text-[14px] font-inter text-[#F3F4F6] outline-none focus:border-[#00F0FF]"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="operator@agency.gov"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[#6B7280] font-inter font-medium text-[10px] leading-3.75 uppercase tracking-[1.5px]">
              Password
            </label>
            <div className="relative ">
              <input
                className="w-full bg-[#080F1E] border border-[#00F0FF1F] px-4 py-3 placeholder:text-[#374151] text-[14px] font-inter text-[#F3F4F6] outline-none focus:border-[#00F0FF]"
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
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[#6B7280] font-inter font-medium text-[10px] leading-3.75 uppercase tracking-[1.5px]">
              Confirm Password
            </label>
            <div className="relative ">
              <input
                className="w-full bg-[#080F1E] border border-[#00F0FF1F] px-4 py-3 placeholder:text-[#374151] text-[14px] font-inter text-[#F3F4F6] outline-none focus:border-[#00F0FF]"
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
          </div>
        </div>
        <div className="text-[#EF4444] font-inter leading-5 text-[14px] ">
          {errorMessage && <p>{errorMessage}</p>}
        </div>

        <button
          formNoValidate
          type="submit"
          className="bg-[#00F0FF] my-6 font-orbitron font-bold text-[12px] leading-4 tracking-[1.8px] uppercase w-full py-3 cursor-pointer"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
        <div className="text-[#4B5563] font-inter leading-5 text-[14px] text-center">
          Already have access?{" "}
          <Link href="/login" className="text-[#00F0FF] hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
