import BrandPanel from "../components/auth/BrandPanel";
import RegisterForm from "../components/auth/RegisterForm";

function RegisterPage() {
  return (
    <div className="flex">
      <BrandPanel paragraph="Create your operator account to access the identification system." />
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;
