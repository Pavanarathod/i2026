import { useTheme } from "@/app/providers/ThemeProvider";
import logoDark from "@/assets/images/logoDark.png";
import logoDarkMobile from "@/assets/images/logoMobileDark.png";
import logoWhiteMobile from "@/assets/images/logoMobileWhite.png";
import logoWhite from "@/assets/images/logoWhite.png";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuthModalStore } from "@/features/auth/authModalStore";
import { useAuthStore } from "@/features/auth/store";
import { useMediaQuery } from "@uidotdev/usehooks";
import clsx from "clsx";
import { Menu, Moon, Sparkles, Sun } from "lucide-react";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchInput from "@/features/search/SearchInput";
function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[0.99]",
        variant === "primary" &&
          "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90",
        variant === "secondary" &&
          "border border-border bg-card text-foreground hover:bg-secondary",
        variant === "ghost" &&
          "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

function ThemeModeSwitch({
  isDarkTheme,
  setTheme,
  className,
}: {
  isDarkTheme: boolean;
  setTheme: (theme: "light" | "dark" | "system") => void;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex items-center rounded-full border border-border/70 bg-card/85 p-1 shadow-sm backdrop-blur",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        title="Light mode"
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
        title="Dark mode"
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

export default function PublicHeader() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const openAuthModal = useAuthModalStore((s) => s.open);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  // ✅ Update based on your store shape
  const token = useAuthStore((s: { token: string | null }) => s.token);
  const user = useAuthStore((s: { user: unknown | null }) => s.user);
  const isLoggedIn = Boolean(token || user);
  const isDarkTheme =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const onPrimaryCTA = () => {
    if (isLoggedIn) navigate("/dashboard");
    else openAuthModal();
  };

  const navItems = [
    { id: "features", label: "Features" },
    { id: "universities", label: "Universities" },
    { id: "programs", label: "Programs" },
    { id: "community", label: "Community" },
  ] as const;

  const scrollToSection = (id: (typeof navItems)[number]["id"]) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-380 items-center justify-between gap-3 px-4 py-3">
        {isSmallDevice ? (
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-16 w-36">
              <img
                src={isDarkTheme ? logoDarkMobile : logoWhiteMobile}
                alt="ISHVI logo"
                className="block h-12 w-16"
              />
            </div>
          </Link>
        ) : (
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-16 w-36">
              <img
                src={isDarkTheme ? logoDark : logoWhite}
                alt="ISHVI logo"
                className="block h-full w-full object-cover bg-transparent"
              />
            </div>
          </Link>
        )}

        <div className="hidden flex-1 px-3 md:block">
          <SearchInput />
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeModeSwitch isDarkTheme={isDarkTheme} setTheme={setTheme} />
          {isLoggedIn ? (
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button onClick={onPrimaryCTA}>
                Get Started <Sparkles className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {isLoggedIn ? (
            <Button
              variant="ghost"
              className="px-3"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
          ) : (
            <Button variant="ghost" className="px-3" onClick={openAuthModal}>
              Login
            </Button>
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-2xl border border-border/70 bg-card/85 text-foreground shadow-sm transition hover:bg-secondary"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <SheetContent
              side="right"
              className="w-[86%] border-l border-border bg-background/98 p-0 sm:max-w-sm"
            >
              <SheetHeader className="border-b border-border/70 px-5 py-5 text-left">
                <SheetTitle className="text-base">Explore ISHVI</SheetTitle>
                <SheetDescription>
                  Browse sections, switch theme, and continue with the best next
                  action.
                </SheetDescription>
              </SheetHeader>

              <div className="flex h-full flex-col px-5 py-5">
                <ThemeModeSwitch
                  isDarkTheme={isDarkTheme}
                  setTheme={setTheme}
                  className="mb-6 self-start"
                />

                <div className="grid gap-2">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/70 px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-secondary"
                      >
                        <span>{item.label}</span>
                        <span className="text-muted-foreground">/</span>
                      </button>
                    </SheetClose>
                  ))}
                </div>

                <div className="mt-auto space-y-3 pt-6">
                  <SheetClose asChild>
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => scrollToSection("features")}
                    >
                      See how it works
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button className="w-full" onClick={onPrimaryCTA}>
                      {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
