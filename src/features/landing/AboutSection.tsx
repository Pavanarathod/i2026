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

export default function AboutSection({ index }: Props) {
  const sectionDirection = index % 2 === 0 ? -1 : 1;
  const sectionMotionVariants = sectionReveal(sectionDirection);

  return (
    <motion.section
      id="about"
      variants={sectionMotionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={clsx(
        "min-h-[100vh] border-b border-border/70",
        "bg-[radial-gradient(circle_at_left,color-mix(in_oklab,var(--secondary)_20%,transparent),transparent_46%),radial-gradient(circle_at_right,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_46%),var(--background)]",
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
            About
          </motion.h2>
          <motion.p
            variants={sectionMotionVariants}
            className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Introduce your mission, what makes your process dependable, and your
            success story.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}
