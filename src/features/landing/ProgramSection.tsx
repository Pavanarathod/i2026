import { motion, type Variants } from "framer-motion";
import clsx from "clsx";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProgramsList } from "./landing.hooks";

const sectionReveal = (dir: number): Variants => ({
  hidden: {
    opacity: 0,
    x: dir * 48,
    scale: 0.98,
  },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
});

type Props = {
  index: number;
};

const PROGRAM_PREVIEW_LIMIT = 10;

export default function ProgramSection({ index }: Props) {
  const { programs, isGettingProgramsLoading } = useGetProgramsList();
  const [searchText, setSearchText] = useState("");
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const programList = programs?.data?.data ?? [];

  const filteredPrograms = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return programList;

    return programList.filter((program) =>
      program.related_programs.toLowerCase().includes(query),
    );
  }, [programList, searchText]);

  const visiblePrograms = showAll
    ? filteredPrograms
    : filteredPrograms.slice(0, PROGRAM_PREVIEW_LIMIT);

  const isShowMoreNeeded = filteredPrograms.length > PROGRAM_PREVIEW_LIMIT;
  const sectionDirection = index % 2 === 0 ? -1 : 1;
  const sectionMotionVariants = sectionReveal(sectionDirection);

  const handleProgramSelect = (program: string) => {
    const query = new URLSearchParams();
    query.set("related_program", program);
    navigate(`/search?${query.toString()}`);
  };

  if (isGettingProgramsLoading) return <>Loading</>;

  return (
    <motion.section
      id="programs"
      variants={sectionMotionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={clsx(
        " border-b border-border/70",
        "relative overflow-hidden",
        "[background:linear-gradient(180deg,color-mix(in_oklab,var(--background)_72%,white)_0%,color-mix(in_oklab,var(--secondary)_70%,white)_52%,var(--background)_100%)]",
        "dark:[background:linear-gradient(180deg,color-mix(in_oklab,var(--background)_92%,black)_0%,color-mix(in_oklab,var(--secondary)_58%,var(--background))_48%,color-mix(in_oklab,var(--accent)_30%,var(--background))_100%)]",
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/18 blur-3xl dark:bg-primary/14" />
        <div className="absolute top-32 -right-17.5 h-80 w-80 rounded-full bg-chart-2/20 blur-3xl dark:bg-chart-2/12" />
        <div className="absolute -bottom-22.5 -left-15 h-80 w-80 rounded-full bg-chart-3/15 blur-3xl dark:bg-chart-3/10" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent dark:via-primary/20" />
      </div>
      <div className="mx-auto flex h-full w-full max-w-380 px-4 py-14 lg:px-8">
        <div className="w-full space-y-8">
          <motion.div
            variants={sectionMotionVariants}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <h2 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
              Programs
            </h2>
            <div className="relative w-full max-w-lg">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchText}
                onChange={(event) => {
                  setSearchText(event.target.value);
                  setShowAll(false);
                }}
                type="text"
                placeholder="Search programs..."
                className="w-full rounded-full border border-border bg-card/80 py-2.5 pr-4 pl-10 text-sm text-foreground shadow-sm outline-none ring-0 backdrop-blur transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visiblePrograms.map((item) => {
              const isTopRanked = item.count >= 1500;

              return (
                <button
                  type="button"
                  key={item.related_programs}
                  onClick={() => handleProgramSelect(item.related_programs)}
                  className={clsx(
                    "group relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 px-5 py-4 text-left backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/10",
                  )}
                >
                  <span
                    className={clsx(
                      "absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-80 transition-opacity duration-200",
                      isTopRanked
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-80",
                    )}
                  />
                  <p className="line-clamp-2 text-[15px] font-semibold text-foreground">
                    {item.related_programs}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.count} opportunities
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                    View matches
                    <ChevronDown className="h-3.5 w-3.5 rotate-[-90deg] group-hover:translate-x-0.5" />
                  </span>
                </button>
              );
            })}

            {visiblePrograms.length === 0 ? (
              <p className="col-span-full rounded-xl border border-dashed border-border/70 bg-card/40 py-8 text-center text-sm text-muted-foreground">
                No matching programs found.
              </p>
            ) : null}
          </div>

          {isShowMoreNeeded ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-5 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur transition hover:bg-card"
              >
                {showAll ? (
                  <>
                    Show fewer
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show all programs
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}
