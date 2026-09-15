import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/RegisterPage";
import { useAuth } from "./store/AuthContext";
import FingerprintUploadPage from "./pages/FingerprintUploadPage";

function ProtectedRoutes({ isAuthenticated, children, userRole }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (isAuthenticated && userRole === "admin") {
    return <Navigate to="/dashboard/fingerprint-uplaod" replace />;
  }
  return children;
}
function AuthenticatedRoutes({ isAuthenticated, children, userRole }) {
  if (isAuthenticated) {
    if (userRole === "admin") {
      return <Navigate to="/dashboard/fingerprint-uplaod" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  return children;
}

function App() {
  const { isAuthenticated, role } = useAuth();

  return (
    <div className="bg-[#030712] min-h-screen text-[#F3F4F6]">
      <Routes>
        <Route
          path="/login"
          element={
            <AuthenticatedRoutes
              isAuthenticated={isAuthenticated}
              userRole={role}
            >
              <LoginPage />
            </AuthenticatedRoutes>
          }
        />
        <Route
          path="/register"
          element={
            <AuthenticatedRoutes
              isAuthenticated={isAuthenticated}
              userRole={role}
            >
              <RegisterPage />
            </AuthenticatedRoutes>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <div>Home Page</div>
            </ProtectedRoutes>
          }
        />
        <Route path="/dashboard">
          <Route
            path="fingerprint-uplaod"
            element={
              <ProtectedRoutes isAuthenticated={isAuthenticated}>
                <FingerprintUploadPage />
              </ProtectedRoutes>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
