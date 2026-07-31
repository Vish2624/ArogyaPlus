import {
  ClipboardList,
  FlaskConical,
  Images,
  LayoutDashboard,
  LogOut,
  Package as PackageIcon,
  SlidersHorizontal,
  UserCircle,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import clsx from "clsx";

import Logo from "@/components/common/Logo";
import { useAuthStore } from "@/store/authStore";

const GROUPS = [
  {
    label: "Overview",
    links: [{ to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    links: [
      { to: "/admin/packages", label: "Packages", icon: PackageIcon },
      { to: "/admin/tests", label: "Tests", icon: FlaskConical },
      { to: "/admin/parameters", label: "Parameters", icon: SlidersHorizontal },
      { to: "/admin/banners", label: "Banners", icon: Images },
    ],
  },
  {
    label: "Management",
    links: [{ to: "/admin/bookings", label: "Bookings", icon: ClipboardList }],
  },
  {
    label: "Account",
    links: [{ to: "/admin/profile", label: "My Profile", icon: UserCircle }],
  },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const admin = useAuthStore((s) => s.admin);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex h-full w-72 shrink-0 flex-col overflow-y-auto border-r border-slate-100 bg-white transition-transform duration-200 ease-in-out",
          "lg:static lg:z-auto lg:w-64 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-slate-100 px-5 text-lg font-bold text-primary-800">
          <span className="flex items-center gap-2">
            <Logo className="h-9 w-auto" />
            Admin
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-500 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-4 p-3">
          {GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">{group.label}</p>
              <div className="space-y-1">
                {group.links.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
                        isActive ? "bg-primary-50 text-primary-700" : "text-slate-500 hover:bg-slate-50"
                      )
                    }
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-3">
          {admin && (
            <div className="mb-2 flex items-center gap-2.5 rounded-lg px-3 py-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">
                {admin.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-800">{admin.username}</p>
                <p className="truncate text-[11px] text-slate-500">{admin.email}</p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
          >
            <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
