import BrandPanel from "../components/auth/BrandPanel";
import LoginForm from "../components/auth/LoginForm";

function LoginPage() {
  return (
    <div className="flex">
      <BrandPanel paragraph="AI-powered forensic document analysis" />
      <LoginForm />
    </div>
  );
}

export default LoginPage;
