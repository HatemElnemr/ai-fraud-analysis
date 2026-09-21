import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import logo from "/assets/logo.png";
import { Link, useNavigate } from "react-router";
import { supabase } from "../../../shared/utils/supabase";

function LoginForm() {
  const [isVisible, setIsVisible] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevForm) => ({ ...prevForm, [name]: value }));
  };

  function toggleVisibility() {
    setIsVisible(!isVisible);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { email, password } = formData;

    if (email.trim() === "") {
      setErrorMessage("Email Address is required.");
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

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    navigate("/dashboard/fingerprint-uplaod");
  };

  return (
    <div className="flex flex-col justify-center items-center lg:flex-2 flex-1 p-8 not-sm:min-h-screen">
      <div className="sm:hidden w-[calc(100%-2rem)] flex gap-2.5 items-start">
        <img src={logo} alt="logo" width={24} height={24} />
        <h1 className="text-[#F3F4F6] text-[16px] font-orbitron font-bold uppercase leading-6 tracking-[1.6px]">
          Docsense x pro
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:w-[384px] w-[calc(100%-2rem)] pt-10"
      >
        <div className="flex flex-col gap-1">
          <h1 className="font-orbitron font-bold text-2xl leading-8 text-[#F3F4F6]">
            Login
          </h1>
          <p className="font-inter font-normal text-[14px] leading-5 text-[#9CA3AF]">
            Enter credentials to access the system.
          </p>
        </div>
        <div className="flex flex-col gap-4 pt-8">
          <div className="flex flex-col gap-1.5">
            <label className="text-[#6B7280] font-inter font-medium text-[10px] leading-3.75 uppercase tracking-[1.5px]">
              Email Address
            </label>
            <input
              className="bg-[#080F1E] border border-[#00F0FF1F] px-4 py-3 placeholder:text-[#374151] text-[14px] font-inter text-[#F3F4F6] outline-none focus:border-[#00F0FF]"
              type="email"
              name="email"
              required
              placeholder="operator@agency.gov"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[#6B7280] font-inter font-medium text-[10px] leading-3.75 uppercase tracking-[1.5px]">
              Password
            </label>
            <div className="relative ">
              <input
                className="w-full bg-[#080F1E] border border-[#00F0FF1F] px-4 py-3 placeholder:text-[#374151] text-[14px] font-inter text-[#F3F4F6] outline-none focus:border-[#00F0FF]"
                type={isVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
              <button
                className="absolute w-3.75 h-3.75 right-3 top-[15.5px] text-[#4B5563] cursor-pointer"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? <FaRegEyeSlash /> : <FaRegEye />}
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
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-[#4B5563] font-inter leading-5 text-[14px] text-center">
          You don't have an account?{" "}
          <Link to="/register" className="text-[#00F0FF] hover:underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
