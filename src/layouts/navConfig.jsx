import {
  FaFingerprint,
  FaUsers,
  FaChartLine,
  FaFileAlt,
  FaCog,
} from "react-icons/fa";

/**
 * Role-based navigation configuration.
 *
 * To add/remove a menu item for a role, edit the relevant array below.
 * Each item needs: a unique `path`, a `label`, and an `icon` component.
 * Any route referenced here should also be registered in `src/App.jsx`.
 */
export const NAV_LINKS_BY_ROLE = {
  admin: [
    {
      label: "Fingerprint Upload",
      path: "/dashboard/fingerprint-upload",
      icon: FaFingerprint,
    },
    { label: "Users", path: "/dashboard/users", icon: FaUsers },
    { label: "Analytics", path: "/dashboard/analytics", icon: FaChartLine },
    { label: "Settings", path: "/dashboard/settings", icon: FaCog },
  ],
  user: [
    {
      label: "Fingerprint Upload",
      path: "/dashboard/fingerprint-upload",
      icon: FaFingerprint,
    },
    { label: "My Reports", path: "/dashboard/reports", icon: FaFileAlt },
    { label: "Settings", path: "/dashboard/settings", icon: FaCog },
  ],
};

/** Where each role lands after login and when visiting "/". */
export const DEFAULT_ROUTE_BY_ROLE = {
  admin: "/dashboard/fingerprint-upload",
  user: "/dashboard/fingerprint-scan",
};

/** Fallback role used when no authenticated role is available yet. */
const FALLBACK_ROLE = "user";

/** Returns the nav links for a role, falling back to the user set. */
export function getNavLinks(role) {
  return NAV_LINKS_BY_ROLE[role] ?? NAV_LINKS_BY_ROLE[FALLBACK_ROLE];
}

/** Returns the default landing route for a role. */
export function getDefaultRoute(role) {
  return DEFAULT_ROUTE_BY_ROLE[role] ?? DEFAULT_ROUTE_BY_ROLE[FALLBACK_ROLE];
}
