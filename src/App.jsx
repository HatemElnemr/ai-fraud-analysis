import { AnimatePresence } from "motion/react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import { useAuth } from "./features/auth/context/AuthContext";
import FingerprintUploadPage from "./features/fingerprint/pages/FingerprintUploadPage";

import { getDefaultRoute } from "./layouts/navConfig";
import PlaceholderPage from "./shared/components/PlaceholderPage";
import DashboardLayout from "./layouts/DashboardLayout";
import { SignatureUploadPage } from "./features/signature/pages/SignatureUploadPage";
import { StampUploadPage } from "./features/stamp/pages/StampUploadPage";

/** Requires authentication; otherwise redirects to /login. */
function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

/** Keeps authenticated users out of /login and /register. */
function RedirectIfAuthed({ children }) {
  const { isAuthenticated, role } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={getDefaultRoute(role)} replace />;
  }
  return children;
}

/** Sends "/" to the correct dashboard home for the current role. */
function HomeRedirect() {
  const { role } = useAuth();
  return <Navigate to={getDefaultRoute(role)} replace />;
}

/** Restricts a route to specific roles; others are sent to their dashboard. */
function RequireRole({ roles, children }) {
  const { role } = useAuth();
  if (!roles.includes(role)) {
    return <Navigate to={getDefaultRoute(role)} replace />;
  }
  return children;
}

function App() {
  const { loading } = useAuth();
  const location = useLocation();

  // Wait for the Supabase session to be restored before rendering routes.
  // Without this, a page refresh starts with isAuthenticated=false and the
  // route guards redirect to /login before the session resolves.
  if (loading) {
    return (
      <div className="bg-[#13151F] min-h-screen text-[#DDE1EC] flex items-center justify-center">
        <span className="font-orbitron font-bold text-[12px] leading-4 tracking-[1.8px] uppercase text-[#5B89D4]">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-[#13151F] min-h-screen text-[#DDE1EC]">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/login"
            element={
              <RedirectIfAuthed>
                <LoginPage />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfAuthed>
                <RegisterPage />
              </RedirectIfAuthed>
            }
          />

          {/* Authenticated dashboard shell — shared Navbar + routed content */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<HomeRedirect />} />
            <Route
              index
              path="fingerprint-upload"
              element={
                <RequireRole roles={["admin"]}>
                  <FingerprintUploadPage />
                </RequireRole>
              }
            />
            <Route
              index
              path="signature-upload"
              element={
                <RequireRole roles={["admin"]}>
                  <SignatureUploadPage />
                </RequireRole>
              }
            />
            <Route
              index
              path="stamp-upload"
              element={
                <RequireRole roles={["admin"]}>
                  <StampUploadPage />
                </RequireRole>
              }
            />

            {/* Admin-only content */}
            <Route
              path="users"
              element={
                <RequireRole roles={["admin"]}>
                  <PlaceholderPage title="Users" />
                </RequireRole>
              }
            />
          </Route>

          {/* Root and unknown paths resolve to the role dashboard */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <HomeRedirect />
              </RequireAuth>
            }
          />
          <Route
            path="*"
            element={
              <RequireAuth>
                <HomeRedirect />
              </RequireAuth>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
