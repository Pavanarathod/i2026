import React from "react";

type Theme = "light" | "dark" | "system";
type Ctx = { theme: Theme; setTheme: (t: Theme) => void };

const ThemeContext = React.createContext<Ctx | null>(null);

function animateThemeTransition() {
  const root = document.documentElement;
  root.classList.add("theme-switching");

  window.clearTimeout(
    (root as typeof root & { __themeTimer?: number }).__themeTimer,
  );
  (root as typeof root & { __themeTimer?: number }).__themeTimer =
    window.setTimeout(() => {
      root.classList.remove("theme-switching");
    }, 100);
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const systemDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)",
  ).matches;
  const isDark = theme === "dark" || (theme === "system" && systemDark);
  root.classList.toggle("dark", isDark);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    return saved ?? "system";
  });

  const setTheme = React.useCallback((t: Theme) => {
    animateThemeTransition();
    localStorage.setItem("theme", t);
    setThemeState(t);
    applyTheme(t);
  }, []);

  React.useEffect(() => {
    applyTheme(theme);

    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onChange = () => theme === "system" && applyTheme("system");
    mq?.addEventListener?.("change", onChange);
    return () => mq?.removeEventListener?.("change", onChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
