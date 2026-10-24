import {
  UserRoundIcon,
  BrushIcon,
  CrownIcon,
  PencilRulerIcon,
  PencilLineIcon,
  CodeIcon,
  ChartPieIcon,
  PaletteIcon,
  CircleCheck
} from 'lucide-react'

// 👑 THE MASTER DEFAULT PERMISSIONS REFERENCE MAP
// 👑 PERMISSIONS: MAINLY WE CREATED THE PERMISSIONS FEATURE TO ALLOW/PREVENT SPECIFIC FUNCTIONALITY 
//    (CAN WORK BUT WON'T USE IT FOR ROUTE GUARDING)

// Note that the admin Role is used by default better-auth
export const ROLE_LEVELS = { "client": 1, "maintainer": 2, "owner": 3, "admin": 4 };

// used in table lists
export const ROLE_ICONS = {
  admin: <UserRoundIcon className='text-chart-2 size-4' />,
  owner: <CrownIcon className='size-4 text-chart-5 dark:text-chart-5' />,
  // Subscriber: <CrownIcon className='text-chart-5 size-4' />,
  maintainer: <PencilRulerIcon className='text-chart-3 size-4' />,
  client: <PencilLineIcon className='text-chart-1 size-4' />
}

// Define the precise features you want to toggle on/off dynamically
export const AVAILABLE_PERMISSIONS = [
  { id: "manage:orders", label: "Manage & Track Orders", icon: (<CodeIcon />) },
  { id: "view:billing", label: "View Financial Billing & Revenue Data", icon: (<ChartPieIcon />) },
  { id: "delete:orders", label: "Permanently Delete Client Orders", icon: (<PaletteIcon />) },
  { id: "manage:users", label: "Create & Modify Low-Tier User Accounts", icon: (<CircleCheck />) }
];
// Default permissions for users
export const DEFAULT_ROLE_PERMISSIONS = {
  "client": ["view:own_profile"],
  "maintainer": ["view:own_profile", "manage:orders"],
  "owner": ["view:own_profile", "manage:orders", "view:billing", "manage:users"],
  "admin": ["view:own_profile", "manage:orders", "view:billing", "manage:users", "delete:orders"]
};

// ⚙️ CENTRALIZED ACCESSIBILITY CONFIG HUB
export const ROUTING_AUTH_CONFIG = {
  protectedRoutes: [

    { path: "/dashboard/orders", minRole: "client", requiredPermission: "" },
    { path: "/pages/user-settings", minRole: "owner", requiredPermission: "" },
    { path: "/pages/user-profile", minRole: "owner", requiredPermission: "" },

    // Example: Only Owners/Admins usually see billing, but a trusted user with "view:billing" can enter!
    { path: "/admin/create-new-users", minRole: "admin", requiredPermission: "" },
    { path: "/admin/update-permissions", minRole: "admin", requiredPermission: "" },
    { path: "/pages/auth/register", minRole: "admin", requiredPermission: "" }
  ],
  loginRedirect: "/pages/auth/login",
  unauthorizedRedirect: "/connection-down"
};

