import {
  FaFingerprint,
  FaUsers,
  FaFileAlt,
  FaCog,
  FaPenNib,
  FaEdit,
} from "react-icons/fa";
import { FaStamp } from "react-icons/fa6";
import { ANALYSIS_PATH as SIGNATURE_ANALYSIS_PATH } from "../features/signature/constants";
import { ANALYSIS_PATH as STAMP_ANALYSIS_PATH } from "../features/stamp/constants";

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
    {
      label: "Signature Upload",
      path: "/dashboard/signature-upload",
      icon: FaPenNib,
    },
    {
      label: "Stamp Upload",
      path: "/dashboard/stamp-upload",
      icon: FaStamp,
    },
    {
      label: "Edit Marks",
      path: "/dashboard/mark-edit",
      icon: FaEdit,
    },
  ],
  user: [
    {
      label: "Fingerprint Analysis",
      path: "/dashboard/fingerprint-analysis",
      icon: FaFingerprint,
    },
    {
      label: "Signature Analysis",
      path: SIGNATURE_ANALYSIS_PATH,
      icon: FaPenNib,
    },
    {
      label: "Stamp Analysis",
      path: STAMP_ANALYSIS_PATH,
      icon: FaStamp,
    },
  ],
};

/** Where each role lands after login and when visiting "/". */
export const DEFAULT_ROUTE_BY_ROLE = {
  admin: "/dashboard/fingerprint-upload",
  user: "/dashboard/fingerprint-analysis",
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
