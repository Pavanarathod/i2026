import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Menu, Moon, Sparkles, Sun } from "lucide-react";
import clsx from "clsx";
import logoWhite from "@/assets/images/logoWhite.png";
import logoDark from "@/assets/images/logoDark.png";
import logoWhiteMobile from "@/assets/images/logoMobileWhite.png";
import logoDarkMobile from "@/assets/images/logoMobileDark.png";
import { useTheme } from "@/app/providers/ThemeProvider";
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
import LandingPageRightSection from "@/features/landing/landingPageRightSection";

const container = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

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

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
      {children}
    </span>
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

export default function LandingPage() {
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Nav */}
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
                    Browse sections, switch theme, and continue with the best
                    next action.
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

      {/* Hero */}
      <section className="relative overflow-hidden [background:linear-gradient(180deg,color-mix(in_oklab,var(--background)_72%,white)_0%,color-mix(in_oklab,var(--secondary)_70%,white)_52%,var(--background)_100%)] dark:[background:linear-gradient(180deg,color-mix(in_oklab,var(--background)_92%,black)_0%,color-mix(in_oklab,var(--secondary)_58%,var(--background))_48%,color-mix(in_oklab,var(--accent)_30%,var(--background))_100%)]">
        <div className="pointer-events-none absolute inset-0 opacity-90">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/18 blur-3xl dark:bg-primary/14" />
          <div className="absolute top-32 -right-17.5 h-80 w-80 rounded-full bg-chart-2/20 blur-3xl dark:bg-chart-2/12" />
          <div className="absolute -bottom-22.5 -left-15 h-80 w-80 rounded-full bg-chart-3/15 blur-3xl dark:bg-chart-3/10" />
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent dark:via-primary/20" />
        </div>

        <div className="mx-auto max-w-380 px-4 py-14 md:py-20">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-10 md:grid-cols-2"
          >
            <div>
              <motion.div variants={item} className="flex flex-wrap gap-2">
                <Pill>Personalized shortlists</Pill>
                <Pill>Scholarship discovery</Pill>
                <Pill>Application support</Pill>
              </motion.div>

              <motion.h1
                variants={item}
                className="mt-5 text-4xl font-black tracking-tight md:text-5xl"
              >
                Find the right university, faster with a system built for real
                students.
              </motion.h1>

              <motion.p
                variants={item}
                className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg"
              >
                Search programs and universities, compare requirements, track
                applications, and move from shortlist to offer with clarity.
              </motion.p>

              {/* Quick bullets */}
              <motion.div
                variants={item}
                className="mt-8 grid gap-2 text-sm text-muted-foreground"
              >
                {[
                  "Better search + filters (no clutter)",
                  "Shortlist & compare in one place",
                  "Clear steps for application journey",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{t}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Card (Search preview / product preview) */}
            <LandingPageRightSection />
          </motion.div>
        </div>
      </section>

      {/* Trust / Stats */}
      <section className="border-y border-border/70 bg-card/70">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-10 md:grid-cols-4">
          {[
            { k: "10k+", v: "Student searches" },
            { k: "2k+", v: "Shortlists created" },
            { k: "500+", v: "Universities indexed" },
            { k: "Fast", v: "UI + filtering" },
          ].map((s) => (
            <div
              key={s.v}
              className="rounded-3xl border border-border bg-background/90 p-4 shadow-sm"
            >
              <div className="text-2xl font-black text-primary">{s.k}</div>
              <div className="text-sm text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight md:text-3xl">
              Everything important, no noise
            </h2>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Your landing should sell the *workflow*, not just visuals.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Smart discovery",
              desc: "Search programs/universities with real filters, not endless scrolling.",
            },
            {
              title: "Shortlist & compare",
              desc: "Make decisions faster with structured comparison and saved items.",
            },
            {
              title: "Application pipeline",
              desc: "Map a student journey from enquiry → applied → offer → admit.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="inline-flex rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-accent-foreground">
                Workflow
              </div>
              <div className="mt-4 text-sm font-extrabold text-foreground">
                {f.title}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Plug your existing sections here */}
      <section id="programs" className="mx-auto max-w-7xl px-4 pb-14">
        {/* <LandingPagePrograms /> */}
      </section>

      <section id="universities" className="mx-auto max-w-7xl px-4 pb-14">
        {/* <LandingPageUniversities /> */}
      </section>

      <section id="community" className="mx-auto max-w-7xl px-4 pb-14">
        {/* <LandingPageCommunities /> */}
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70 bg-card/70">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <div>
              <div className="text-sm font-black">ISHVI</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Study abroad workflow, simplified.
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <a href="#features" className="transition hover:text-primary">
                Features
              </a>
              <a href="#universities" className="transition hover:text-primary">
                Universities
              </a>
              <a href="#programs" className="transition hover:text-primary">
                Programs
              </a>
              {isLoggedIn ? (
                <Link to="/dashboard" className="transition hover:text-primary">
                  Dashboard
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="transition hover:text-primary"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 text-xs text-muted-foreground">
            © {new Date().getFullYear()} ISHVI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
