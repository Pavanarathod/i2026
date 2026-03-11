import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function GradientContainer({ children }: Props) {
  return (
    <section className="relative overflow-hidden [background:linear-gradient(180deg,color-mix(in_oklab,var(--background)_72%,white)_0%,color-mix(in_oklab,var(--secondary)_70%,white)_52%,var(--background)_100%)] dark:[background:linear-gradient(180deg,color-mix(in_oklab,var(--background)_92%,black)_0%,color-mix(in_oklab,var(--secondary)_58%,var(--background))_48%,color-mix(in_oklab,var(--accent)_30%,var(--background))_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/18 blur-3xl dark:bg-primary/14" />
        <div className="absolute top-32 -right-17.5 h-80 w-80 rounded-full bg-chart-2/20 blur-3xl dark:bg-chart-2/12" />
        <div className="absolute -bottom-22.5 -left-15 h-80 w-80 rounded-full bg-chart-3/15 blur-3xl dark:bg-chart-3/10" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent dark:via-primary/20" />
      </div>
      <div className="mx-auto max-w-380 px-4 pt-1 space-y-1">{children}</div>
    </section>
  );
}

export default GradientContainer;
