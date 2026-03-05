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
  Moon,
  Search,
  Settings2,
  Sparkles,
  Sun,
  UserCircle2,
  Users,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/app/providers/ThemeProvider";
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
    hint: "Overview and activity",
  },
  {
    label: "Students",
    to: "/students",
    icon: Users,
    hint: "Applicants and records",
  },
  {
    label: "Applications",
    to: "/applications",
    icon: FileText,
    hint: "Submission pipeline",
  },
  {
    label: "Universities",
    to: "/universities",
    icon: Building2,
    hint: "Partners and destination data",
  },
];

const utilityNav: NavItem[] = [
  {
    label: "Discover",
    to: "/dashboard",
    icon: Compass,
    hint: "Smart shortcuts",
  },
  {
    label: "Insights",
    to: "/dashboard",
    icon: ChartNoAxesCombined,
    hint: "Trends and performance",
  },
];

function ThemeModeSwitch({
  isDarkTheme,
  setTheme,
}: {
  isDarkTheme: boolean;
  setTheme: (theme: "light" | "dark" | "system") => void;
}) {
  return (
    <div className="flex items-center rounded-full border border-border/70 bg-card/85 p-0.5 shadow-sm backdrop-blur">
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Switch to light mode"
        className={clsx(
          "grid h-8 w-8 place-items-center rounded-full transition",
          !isDarkTheme
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        )}
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label="Switch to dark mode"
        className={clsx(
          "grid h-8 w-8 place-items-center rounded-full transition",
          isDarkTheme
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        )}
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  );
}

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
          "group flex items-center gap-2.5 rounded-2xl border px-2.5 py-2 text-sm transition",
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
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl",
              isActive
                ? "bg-primary-foreground/15"
                : "bg-secondary text-foreground group-hover:bg-background",
            )}
          >
            <Icon className="h-4.5 w-4.5" />
          </span>

          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">
                {item.label}
              </span>
              <span
                className={clsx(
                  "block truncate text-[11px]",
                  isActive
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground",
                )}
              >
                {item.hint}
              </span>
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
  const { theme, setTheme } = useTheme();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const [collapsed, setCollapsed] = React.useState(false);

  const activeLabel =
    primaryNav.find((item) => location.pathname.startsWith(item.to))?.label ??
    "Workspace";

  const isDarkTheme =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_36%),radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--chart-2)_10%,transparent),transparent_30%),var(--background)] text-foreground">
      <div className="flex h-full overflow-hidden">
        <aside
          className={clsx(
            "hidden shrink-0 border-r border-border/70 bg-card/70 backdrop-blur-xl transition-all duration-300 md:block",
            collapsed ? "w-20" : "w-72",
          )}
        >
          <div className="sticky top-0 flex h-screen flex-col overflow-y-auto px-3 py-3">
            <div className="rounded-3xl border border-border/70 bg-background/80 p-2.5 shadow-sm">
              <div
                className={clsx(
                  "flex items-center gap-2.5",
                  collapsed ? "justify-center" : "justify-between",
                )}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>

                  {!collapsed && (
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-semibold">
                          ISHVI Console
                        </span>
                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                          v2
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Multi-role workspace
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setCollapsed((prev) => !prev)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-border/70 bg-background/75 text-muted-foreground shadow-sm transition hover:bg-secondary hover:text-foreground"
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {collapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-4">
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

              <section className="space-y-2">
                <div className="space-y-2">
                  {utilityNav.map((item) => (
                    <DesktopNavItem
                      key={item.label}
                      item={item}
                      collapsed={collapsed}
                    />
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-auto pt-4">
              <div
                className={clsx(
                  "rounded-3xl border border-border/70 bg-background/75 p-2.5 shadow-sm",
                  collapsed && "p-2",
                )}
              >
                <button
                  type="button"
                  className={clsx(
                    "flex w-full items-center gap-2.5 rounded-2xl px-2 py-2 text-left transition hover:bg-secondary",
                    collapsed && "justify-center",
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary">
                    <UserCircle2 className="h-4.5 w-4.5" />
                  </span>

                  {!collapsed && (
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {user?.userData?.firstname || "Go to Profile"}
                      </span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        Profile and preferences
                      </span>
                    </span>
                  )}
                </button>

                <Button
                  variant="ghost"
                  onClick={logout}
                  className={clsx(
                    "mt-1.5 h-9 w-full rounded-2xl text-sm",
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
            <div className="flex items-center gap-3 px-4 py-3 md:px-5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                    Active
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Multi-role control panel
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <h1 className="text-base font-semibold md:text-xl">
                    {activeLabel}
                  </h1>
                  <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] text-muted-foreground">
                    Modern dashboard shell
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ThemeModeSwitch isDarkTheme={isDarkTheme} setTheme={setTheme} />
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-2xl border border-border/70 bg-card/85 text-muted-foreground shadow-sm transition hover:bg-secondary hover:text-foreground"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-2xl border border-border/70 bg-card/85 text-muted-foreground shadow-sm transition hover:bg-secondary hover:text-foreground"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="hidden h-9 items-center gap-2 rounded-2xl border border-border/70 bg-card/85 px-3 text-sm font-medium text-muted-foreground shadow-sm transition hover:bg-secondary hover:text-foreground sm:inline-flex"
                  aria-label="Settings"
                >
                  <Settings2 className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-auto">
            <div className="min-h-full min-w-0 px-4 py-4 pb-24 md:px-5 md:py-5 md:pb-5">
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
