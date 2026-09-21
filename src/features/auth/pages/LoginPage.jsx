import BrandPanel from "../components/BrandPanel";
import LoginForm from "../components/LoginForm";

function LoginPage() {
  return (
    <div className="flex">
      <BrandPanel paragraph="AI-powered forensic document analysis" />
      <LoginForm />
    </div>
  );
}

export default LoginPage;
