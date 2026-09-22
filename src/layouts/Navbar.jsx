import { useState } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../features/auth/context/AuthContext";
import { getDefaultRoute, getNavLinks } from "./navConfig";
import logo from "/assets/logo-icon.svg";

export default function Navbar({ onLogout }) {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = getNavLinks(role);
  const homePath = getDefaultRoute(role);
  const displayName =
    user?.user_metadata?.display_name || user?.email || "Operator";

  const handleLogout = async () => {
    setMobileOpen(false);
    await onLogout?.();
    navigate("/login", { replace: true });
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition-all ${
      isActive
        ? "text-[#5B89D4] bg-[#5B89D4]/8 border border-[#5B89D4]/20"
        : "text-[#6B7280] hover:text-[#8A92A6] border border-transparent hover:border-[rgba(0,240,255,0.08)]"
    }`;

  return (
    <nav className="sticky top-0 z-20 border-b border-[rgba(0,240,255,0.09)] bg-[#13151F]/80 backdrop-blur-sm">
      <div className="px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 xl:gap-6">
          <button
            type="button"
            onClick={() => navigate(homePath)}
            className="flex items-center gap-3"
          >
            <div className=" flex items-center justify-center pt-1.5">
              <img src={logo} alt="logo" width={30} height={30} />
            </div>
            <span
              className="text-[#DDE1EC] text-sm font-medium tracking-[0.2em] uppercase"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              DocSense X Pro
            </span>
          </button>

          {/* Desktop navigation links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={linkClasses}
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {Icon && <Icon size={13} />}
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden 2xl:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B89D4] animate-pulse" />
            <span
              className="text-[#8A92A6] text-[10px] tracking-[0.15em] uppercase"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              System Online
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#8A92A6] text-sm">
            <FaUserCircle size={15} />
            <span className="hidden sm:block max-w-24 xl:max-w-40 truncate">
              {displayName}
            </span>
            {role && (
              <span
                className="hidden xl:inline px-2 py-0.5 rounded text-[10px] uppercase tracking-wider text-[#5B89D4] bg-[#5B89D4]/8 border border-[#5B89D4]/20"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {role}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="hidden lg:flex items-center gap-1.5 text-[#6B7280] hover:text-[#5B89D4] transition-colors text-sm"
          >
            Logout
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="lg:hidden text-[#8A92A6] hover:text-[#5B89D4] transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation links */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[rgba(0,240,255,0.09)] px-4 sm:px-6 py-3 flex flex-col gap-1">
          {links.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={linkClasses}
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {Icon && <Icon size={13} />}
              {label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="text-left px-3 py-1.5 text-xs text-[#6B7280] hover:text-[#5B89D4] transition-colors"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
