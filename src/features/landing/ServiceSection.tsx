import { motion, type Variants } from "framer-motion";
import clsx from "clsx";

const sectionReveal = (dir: number): Variants => ({
  hidden: { opacity: 0, x: dir * 48, scale: 0.98 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
});

type Props = {
  index: number;
};

export default function ServiceSection({ index }: Props) {
  const sectionDirection = index % 2 === 0 ? -1 : 1;
  const sectionMotionVariants = sectionReveal(sectionDirection);

  return (
    <motion.section
      id="services"
      variants={sectionMotionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={clsx(
        "min-h-[100vh] border-b border-border/70",
        "bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--chart-3)_14%,transparent),transparent_42%),linear-gradient(140deg,color-mix(in_oklab,var(--background)_75%,white)_0%,color-mix(in_oklab,var(--accent)_20%,var(--background))_100%)]",
        "relative overflow-hidden",
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-65 bg-[radial-gradient(circle_at_top,transparent_84%,rgba(0,0,0,0.04))] dark:bg-[radial-gradient(circle_at_top,transparent_84%,rgba(255,255,255,0.05))]" />
      <div className="mx-auto flex h-full w-full max-w-380 items-center px-4 py-14 lg:px-8">
        <div className="max-w-4xl">
          <motion.h2
            variants={sectionMotionVariants}
            className="text-4xl font-black tracking-tight md:text-5xl"
          >
            Services
          </motion.h2>
          <motion.p
            variants={sectionMotionVariants}
            className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            List services like SOP review, visa support, scholarship guidance, and
            profile building.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}
