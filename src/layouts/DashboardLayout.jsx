import { motion } from "motion/react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../features/auth/context/AuthContext";
import { supabase } from "../shared/utils/supabase";
import Navbar from "./Navbar";

/**
 * Shared shell for every /dashboard route.
 * Guards authentication once and renders the role-aware Navbar + routed page.
 */
export default function DashboardLayout() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // AuthContext already blocks rendering while loading, but guard here too
  // so the layout is safe to use standalone.
  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-[#030712] text-[#F3F4F6]">
      <Navbar onLogout={handleLogout} />
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
