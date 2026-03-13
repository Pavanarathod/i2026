//@ts-nocheck
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
import ProgramSection from "@/features/landing/ProgramSection";
import EventsSection from "@/features/landing/EventsSection";
import ServiceSection from "@/features/landing/ServiceSection";
import AboutSection from "@/features/landing/AboutSection";
import ContactSection from "@/features/landing/ContactSection";
import SearchInput from "@/features/search/SearchInput";

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

const headerReveal = {
  hidden: { opacity: 0, y: -16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.06,
    },
  },
};

const navItemReveal = (i: number) => ({
  hidden: { opacity: 0, y: -8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.07 },
  },
});

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
    { id: "programs", label: "Programs" },
    { id: "events", label: "Events" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ] as const;

  const scrollToSection = (id: (typeof navItems)[number]["id"]) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <motion.header
        initial="hidden"
        animate="show"
        variants={headerReveal}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl"
      >
        <div className="relative mx-auto flex w-full max-w-380 items-center justify-between gap-3 px-4 py-3 lg:px-8">
          {/* Left side mobile: logo */}
          <div className="flex items-center gap-3 md:hidden">
            <Link to="/" className="flex items-center">
              <div className="flex h-12 w-20 items-center">
                <img
                  src={isDarkTheme ? logoDarkMobile : logoWhiteMobile}
                  alt="ISHVI logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Desktop logo */}
          <Link to="/" className="z-10 hidden items-center gap-3 md:flex">
            <div className="flex h-16 w-36">
              <img
                src={isDarkTheme ? logoDark : logoWhite}
                alt="ISHVI logo"
                className="block h-full w-full object-cover bg-transparent"
              />
            </div>
          </Link>

          <motion.nav
            variants={headerReveal}
            className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 items-center gap-3 px-2 py-2 md:flex md:pointer-events-auto"
          >
            {navItems.map((item, index) => (
              <motion.button
                type="button"
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                variants={navItemReveal(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                <span>{item.label}</span>
              </motion.button>
            ))}
          </motion.nav>

          {/* Desktop right side */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeModeSwitch isDarkTheme={isDarkTheme} setTheme={setTheme} />
            <motion.button
              onClick={onPrimaryCTA}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              variants={navItemReveal(4)}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110"
            >
              Apply Now
            </motion.button>
          </div>

          {/* Mobile right side */}
          <div className="ml-auto flex items-center gap-2 md:hidden">
            <motion.button
              onClick={onPrimaryCTA}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              variants={navItemReveal(4)}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110"
            >
              Apply Now
            </motion.button>

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
                side="left"
                className="w-[86%] border-r border-border bg-background/98 p-0 sm:max-w-sm"
              >
                <SheetHeader className="border-b border-border/70 px-5 py-5 text-left">
                  <SheetTitle className="text-base">Explore ISHVI</SheetTitle>
                  <SheetDescription>
                    Browse sections, switch theme, and continue with your next
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
                      <Button className="w-full" onClick={onPrimaryCTA}>
                        Apply Now <Sparkles className="h-4 w-4" />
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={onPrimaryCTA}
                      >
                        {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      <section className="relative min-h-[88vh] overflow-hidden [background:linear-gradient(180deg,color-mix(in_oklab,var(--background)_72%,white)_0%,color-mix(in_oklab,var(--secondary)_70%,white)_52%,var(--background)_100%)] dark:[background:linear-gradient(180deg,color-mix(in_oklab,var(--background)_92%,black)_0%,color-mix(in_oklab,var(--secondary)_58%,var(--background))_48%,color-mix(in_oklab,var(--accent)_30%,var(--background))_100%)]">
        <div className="pointer-events-none absolute inset-0 opacity-90">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/18 blur-3xl dark:bg-primary/14" />
          <div className="absolute top-32 -right-17.5 h-80 w-80 rounded-full bg-chart-2/20 blur-3xl dark:bg-chart-2/12" />
          <div className="absolute -bottom-22.5 -left-15 h-80 w-80 rounded-full bg-chart-3/15 blur-3xl dark:bg-chart-3/10" />
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent dark:via-primary/20" />
        </div>

        <div className="mx-auto w-full max-w-380 px-4 py-5 md:py-28 lg:px-8">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-10 md:grid-cols-2"
          >
            <div className="text-center md:text-left">
              <motion.h1
                variants={item}
                className="mt-6 text-5xl font-black tracking-tight md:text-6xl xl:text-7xl"
              >
                Study Abroad{" "}
                <span className="text-primary">with AI-First Guidance</span>
              </motion.h1>

              <motion.p
                variants={item}
                className="mt-4 max-w-2xl text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground md:tracking-[0.2em] mx-auto"
              >
                Smart Counseling by AI, Finalized by Experts
              </motion.p>

              <motion.p
                variants={item}
                className="hidden md:block mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                We combine experienced counselors with AI agents that analyze
                universities, scholarships, profile fit, and deadlines so you
                can move from dreaming to applying with confidence.
              </motion.p>

              <motion.div variants={item} className="mt-8 w-full max-w-2xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Discover your best option
                </p>
                <SearchInput />
              </motion.div>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="hidden mt-8 md:grid gap-3 text-sm text-muted-foreground"
              >
                {[
                  "AI-matched programs based on profile, interests, and goals",
                  "AI agents for SOP workflows, checklist validation, and reminders",
                  "Visa and scholarship planning driven by real-time deadlines",
                  "Human mentor review at every major decision point",
                ].map((t) => (
                  <motion.div
                    key={t}
                    variants={item}
                    className="flex items-center justify-start gap-3 text-left md:text-left text-sm md:items-start md:justify-start"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{t}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <LandingPageRightSection />
          </motion.div>
        </div>
      </section>

      <main>
        <ProgramSection index={0} />
        <EventsSection index={1} />
        <ServiceSection index={2} />
        <AboutSection index={3} />
        <ContactSection index={4} />
      </main>

      <footer className="border-t border-border/70 bg-background/80">
        <div className="mx-auto flex w-full max-w-352 flex-wrap items-center justify-between gap-3 px-4 py-5 lg:px-8 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} ISHVI. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <a href="#" className="transition hover:text-foreground">
              LinkedIn
            </a>
            <a href="#" className="transition hover:text-foreground">
              Instagram
            </a>
            <a href="#" className="transition hover:text-foreground">
              X
            </a>
            <a href="#" className="transition hover:text-foreground">
              YouTube
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
