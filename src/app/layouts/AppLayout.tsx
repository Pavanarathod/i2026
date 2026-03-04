import * as React from "react";
import {
  Bell,
  Building2,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileText,
  Home,
  LogOut,
  Search,
  Settings2,
  Sparkles,
  UserCircle2,
  Users,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store";

type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  hint: string;
};

const primaryNav: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: Home,
    hint: "Overview and daily activity",
  },
  {
    label: "Students",
    to: "/students",
    icon: Users,
    hint: "Manage applicants and records",
  },
  {
    label: "Applications",
    to: "/applications",
    icon: FileText,
    hint: "Track submission pipelines",
  },
  {
    label: "Universities",
    to: "/universities",
    icon: Building2,
    hint: "Partner and destination data",
  },
];

const utilityNav: NavItem[] = [
  {
    label: "Discover",
    to: "/dashboard",
    icon: Compass,
    hint: "Shortcuts and smart actions",
  },
  {
    label: "Insights",
    to: "/dashboard",
    icon: ChartNoAxesCombined,
    hint: "Trends and performance views",
  },
];

function DesktopNavItem({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        clsx(
          "group flex items-center gap-3 rounded-2xl border px-3 text-sm transition",
          collapsed ? "justify-center" : "justify-start",
          isActive
            ? "border-primary/20 bg-primary text-primary-foreground shadow-lg shadow-primary/15"
            : "border-transparent text-muted-foreground hover:border-border hover:bg-secondary hover:text-foreground",
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={clsx(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
              isActive
                ? "bg-primary-foreground/15"
                : "bg-secondary text-foreground group-hover:bg-background",
            )}
          >
            <Icon className="h-5 w-5" />
          </span>

          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate font-semibold">{item.label}</span>
              <span
                className={clsx(
                  "block truncate text-xs",
                  isActive
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground",
                )}
              ></span>
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function MobileNavItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={clsx(
        "flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
}

export default function AppLayout() {
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const [collapsed, setCollapsed] = React.useState(false);

  const activeLabel =
    primaryNav.find((item) => location.pathname.startsWith(item.to))?.label ??
    "Workspace";

  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_36%),radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--chart-2)_10%,transparent),transparent_30%),var(--background)] text-foreground">
      <div className="flex h-full overflow-hidden">
        <aside
          className={clsx(
            "hidden shrink-0 border-r border-border/70 bg-card/70 backdrop-blur-xl transition-all duration-300 md:block",
            collapsed ? "w-24" : "w-80",
          )}
        >
          <div className="sticky top-0 flex h-screen flex-col overflow-y-auto px-4 py-4">
            <div className="rounded-3xl border border-border/70 bg-background/80 p-3 shadow-sm">
              <div
                className={clsx(
                  "flex items-center gap-3",
                  collapsed && "justify-center",
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <Sparkles className="h-5 w-5" />
                </div>

                {!collapsed && (
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">
                        ISHVI Console
                      </span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        v2
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Multi-role operations workspace
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className={clsx(
                "mt-1 flex items-center rounded-2xl border border-border/70 bg-background/70 px-3 text-sm font-medium",
                collapsed ? "justify-center" : "justify-between",
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>

            <div className="mt-6 space-y-6">
              <section className="space-y-2">
                <div className="space-y-2">
                  {primaryNav.map((item) => (
                    <DesktopNavItem
                      key={item.label}
                      item={item}
                      collapsed={collapsed}
                    />
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-auto pt-6">
              <div
                className={clsx(
                  "rounded-3xl border border-border/70 bg-background/75 p-3 shadow-sm",
                  collapsed && "p-2",
                )}
              >
                <button
                  type="button"
                  className={clsx(
                    "flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition hover:bg-secondary",
                    collapsed && "justify-center",
                  )}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary">
                    <UserCircle2 className="h-5 w-5" />
                  </span>

                  {!collapsed && (
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {user?.userData?.firstname || "Go to Profile"}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        Profile and preferences
                      </span>
                    </span>
                  )}
                </button>

                <Button
                  variant="ghost"
                  onClick={logout}
                  className={clsx(
                    "mt-2 w-full rounded-2xl",
                    collapsed ? "px-0" : "justify-start",
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  {!collapsed && <span>Logout</span>}
                </Button>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-4 md:px-6">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    Active
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Multi-role control panel
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <h1 className="text-lg font-semibold md:text-2xl">
                    {activeLabel}
                  </h1>
                  <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                    Modern dashboard shell
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-2xl border border-border/70 bg-card/85 text-muted-foreground shadow-sm transition hover:bg-secondary hover:text-foreground"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-2xl border border-border/70 bg-card/85 text-muted-foreground shadow-sm transition hover:bg-secondary hover:text-foreground"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="hidden h-10 items-center gap-2 rounded-2xl border border-border/70 bg-card/85 px-3 text-sm font-medium text-muted-foreground shadow-sm transition hover:bg-secondary hover:text-foreground sm:inline-flex"
                  aria-label="Settings"
                >
                  <Settings2 className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-auto">
            <div className="min-h-full min-w-0 px-4 py-4 pb-24 md:px-6 md:py-6 md:pb-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/92 px-3 py-3 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-2 rounded-3xl border border-border/70 bg-card/80 p-2 shadow-lg shadow-black/5">
          <MobileNavItem icon={Home} label="Home" active />
          <MobileNavItem icon={Search} label="Search" />
          <MobileNavItem icon={Bell} label="Alerts" />
          <MobileNavItem icon={UserCircle2} label="Profile" />
        </div>
      </footer>
    </div>
  );
}
