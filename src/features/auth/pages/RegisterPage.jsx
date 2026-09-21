import BrandPanel from "../components/BrandPanel";
import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
  return (
    <div className="flex">
      <BrandPanel paragraph="Create your operator account to access the identification system." />
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;
