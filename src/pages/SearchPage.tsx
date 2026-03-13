import GradientContainer from "@/components/common/GradientContainer";
import PublicHeader from "@/components/common/PublicHeader";
import SearchInput from "@/features/search/SearchInput";
import UniversityCard from "@/features/search/UniversityCard";
import { useGetPickListValues } from "@/features/picklist/picklist.hook";
import {
  ArrowUpDown,
  ArrowLeft,
  GraduationCap,
  Layers,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { useGetSearchResults } from "@/features/search/search.hooks";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { motion, type MotionProps } from "framer-motion";

export default function SearchPage() {
  const navigate = useNavigate();
  const { data, isPending } = useGetSearchResults();
  const {
    pickListData: allSemester,
    isGettingPickListValuesLoading: isSemesterLoading,
  } = useGetPickListValues("semester");
  const {
    pickListData: allCountries,
    isGettingPickListValuesLoading: isCountryLoading,
  } = useGetPickListValues("country");
  const {
    pickListData: allDegree,
    isGettingPickListValuesLoading: isDegreeLoading,
  } = useGetPickListValues("degree_type");

  const searchResults = data?.data;
  const university = data?.data?.data;

  const programs = searchResults?.RelatedPrograms;
  const relatedPrograms = searchResults?.Programs;

  const isUniversitySearchLoading = isPending;
  const pickListLoading =
    isSemesterLoading || isCountryLoading || isDegreeLoading;
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDegree = searchParams.get("degree_type") ?? "Masters";
  const selectedCountry = searchParams.getAll("country");
  const selectedSemester = searchParams.getAll("semester");
  const selectedProgram =
    searchParams.get("related_program") ??
    searchParams.get("related_programs") ??
    "";
  const selectedSpecialization = searchParams.get("program") ?? "";
  const [activeDrawer, setActiveDrawer] = useState<
    "programs" | "specializations" | null
  >(null);

  const programValues =
    programs?.length! > 0
      ? programs?.map((p) => ({ title: p.related_programs, total: p.Total }))
      : [];

  const specializationValues =
    relatedPrograms?.length! > 0
      ? [...relatedPrograms!]
          .sort((a, b) => b.Total - a.Total)
          .map((r) => ({ title: r.program, total: r.Total }))
      : [];

  const totalUniversities = searchResults?.pagination?.total ?? 0;
  const skeletonCards = Array.from({ length: 8 }, (_, index) => index);
  const filterSkeletonMap: Record<string, number> = {
    degree_type: 5,
    country: 7,
    semester: 4,
  };

  const handleFilterSelect = (param: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (
        param === "degree_type" ||
        param === "related_program" ||
        param === "program"
      ) {
        if (next.get(param) === value) {
          next.delete(param);
          if (param === "related_program") {
            next.delete("related_programs");
          }
        } else {
          next.set(param, value);
          if (param === "related_program") {
            next.delete("related_programs");
          }
        }
        return next;
      }

      const currentValues = new Set(next.getAll(param));
      next.delete(param);

      if (currentValues.has(value)) {
        currentValues.delete(value);
      } else {
        currentValues.add(value);
      }

      currentValues.forEach((currentValue) => next.append(param, currentValue));

      return next;
    });

    setActiveDrawer(null);
  };

  const closeDrawer = () => setActiveDrawer(null);

  const filterGroups = [
    {
      title: "Degree",
      key: "degree_type",
      values: allDegree?.data ?? [],
      active: selectedDegree,
    },
    {
      title: "Country",
      key: "country",
      values: allCountries?.data ?? [],
      active: selectedCountry,
    },
    {
      title: "Semester",
      key: "semester",
      values: allSemester?.data ?? [],
      active: selectedSemester,
    },
  ];

  const isFilterActive = (param: string, value: string) => {
    if (param === "degree_type") {
      return selectedDegree === value;
    }

    if (param === "country") {
      return selectedCountry.includes(value);
    }

    if (param === "semester") {
      return selectedSemester.includes(value);
    }

    if (param === "related_program") {
      return selectedProgram === value;
    }

    if (param === "program") {
      return selectedSpecialization === value;
    }

    return false;
  };

  const hasFilterParams = (param: string) => {
    if (param === "country" || param === "semester") {
      return searchParams.getAll(param).length > 0;
    }

    return !!searchParams.get(param);
  };

  const hasActiveFilters = Boolean(
    hasFilterParams("program") ||
    hasFilterParams("university") ||
    hasFilterParams("degree_type") ||
    hasFilterParams("related_program") ||
    hasFilterParams("country") ||
    hasFilterParams("semester") ||
    hasFilterParams("year") ||
    hasFilterParams("addon") ||
    hasFilterParams("q"),
  );

  const clearAllFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("program");
      next.delete("related_program");
      next.delete("related_programs");
      next.delete("university");
      next.delete("degree_type");
      next.delete("degreeType");
      next.delete("country");
      next.delete("semester");
      next.delete("year");
      next.delete("addon");
      next.delete("q");
      next.delete("related");
      next.delete("addonConditionType");
      next.delete("page");
      return next;
    });
  };

  const blockReveal = (index: number): MotionProps => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.3,
      ease: "easeOut",
      delay: index * 0.06,
    },
  });

  return (
    <main className="min-h-screen w-full bg-background text-foreground pb-24 md:pb-0">
      <PublicHeader />

      {/* MAIN Section */}
      <GradientContainer>
        <motion.div className="md:hidden" {...blockReveal(0)}>
          <SearchInput />
        </motion.div>

        {/* Main Content */}
        <div className="space-y-3">
          <motion.div
            className="rounded-2xl border border-border/70 bg-card/70 p-4 backdrop-blur-md"
            {...blockReveal(1)}
          >
            <div className="space-y-3">
              {filterGroups.map((group, index) => (
                <motion.div
                  key={group.key}
                  className="space-y-3"
                  {...blockReveal(2 + index * 0.2)}
                >
                  <div
                    className={`overflow-x-auto whitespace-nowrap pb-1 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [scrollbar-height:none] [&::-webkit-scrollbar]:hidden ${
                      isPending ? "pointer-events-none opacity-80" : ""
                    }`}
                  >
                    <div className="inline-flex items-center gap-2">
                      {pickListLoading
                        ? Array.from(
                            {
                              length:
                                filterSkeletonMap[group.key] ??
                                group.values.length ??
                                4,
                            },
                            (_, index) => index,
                          ).map((index) => (
                            <span
                              key={`${group.key}-skeleton-${index}`}
                              className="h-8 w-20 animate-pulse rounded-full border border-border/60 bg-muted/70"
                            />
                          ))
                        : group.values.map((value) => {
                            const isActive = isFilterActive(group.key, value);
                            return (
                              <button
                                type="button"
                                key={`${group.key}-${value}`}
                                onClick={() =>
                                  handleFilterSelect(group.key, value)
                                }
                                className={`rounded-full border px-2.5 py-1.5 text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer md:px-3 md:text-sm hover:shadow-none hover:translate-y-0 ${
                                  isActive
                                    ? "border-primary/80 bg-primary/15 text-primary md:bg-linear-to-r md:from-primary/95 md:to-primary md:text-primary-foreground"
                                    : "border-border/70 bg-background text-foreground/75 md:bg-background md:text-foreground/90 md:hover:border-primary/50 md:hover:text-foreground md:hover:bg-linear-to-r md:hover:from-primary/10 md:hover:to-transparent"
                                }`}
                              >
                                {value}
                              </button>
                            );
                          })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {pickListLoading && (
              <motion.p
                className="mt-3 text-xs text-muted-foreground"
                {...blockReveal(3)}
              >
                Preparing filter options...
              </motion.p>
            )}
          </motion.div>

          {/* PROGRAMS AND SPECIFICATIONS */}
          <motion.div
            className="hidden rounded-2xl border border-border/70 bg-card/70 p-4 backdrop-blur-md md:block"
            {...blockReveal(4)}
          >
            <div className="space-y-3">
              <div className="space-y-3">
                <div className="overflow-x-auto whitespace-nowrap pb-1 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [scrollbar-height:none] [&::-webkit-scrollbar]:hidden">
                  <div className="inline-flex items-center gap-2">
                    {isUniversitySearchLoading
                      ? Array.from({ length: 6 }, (_, index) => index).map(
                          (index) => (
                            <span
                              key={`related-program-skeleton-${index}`}
                              className="h-9 w-32 animate-pulse rounded-full border border-border/60 bg-muted/70"
                            />
                          ),
                        )
                      : programValues?.map(({ title, total }) => {
                          const isActive = isFilterActive("related_program", title);
                          return (
                            <button
                              type="button"
                              key={`related_program-${title}`}
                              onClick={() =>
                                handleFilterSelect("related_program", title)
                              }
                              className={`rounded-full border px-3 py-1.5 text-sm font-medium tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
                                isActive
                                  ? "border-primary bg-linear-to-r from-primary/95 to-primary text-primary-foreground"
                                  : "border-border bg-background text-foreground/90 hover:border-primary/50 hover:text-foreground hover:bg-linear-to-r hover:from-primary/10 hover:to-transparent"
                              }`}
                            >
                              <span>{title}</span>
                              <span
                                className={`ml-2 rounded-full px-2 py-0.5 text-[11px] ${
                                  isActive
                                    ? "bg-white/20 text-primary-foreground"
                                    : "bg-primary/10 text-primary"
                                }`}
                              >
                                {total}
                              </span>
                            </button>
                          );
                        })}
                  </div>
                </div>
              </div>

              {selectedProgram && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground/80">
                    Specialization
                  </p>
                  <div className="overflow-x-auto whitespace-nowrap pb-1 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [scrollbar-height:none] [&::-webkit-scrollbar]:hidden">
                    <div className="inline-flex items-center gap-2">
                      {specializationValues?.map(({ title, total }) => {
                        const isActive = isFilterActive("program", title);
                        return (
                          <button
                            type="button"
                            key={`program-${title}`}
                            onClick={() => handleFilterSelect("program", title)}
                            className={`rounded-full border px-3 py-1.5 text-sm font-medium tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
                              isActive
                                ? "border-primary bg-linear-to-r from-primary/95 to-primary text-primary-foreground"
                                : "border-border bg-background text-foreground/90 hover:border-primary/50 hover:text-foreground hover:bg-linear-to-r hover:from-primary/10 hover:to-transparent"
                            }`}
                          >
                            <span>{title}</span>
                            <span
                              className={`ml-2 rounded-full px-2 py-0.5 text-[11px] ${
                                isActive
                                  ? "bg-white/20 text-primary-foreground"
                                  : "bg-primary/10 text-primary"
                              }`}
                            >
                              {total}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-dashed border-primary/30 bg-card/60 p-3 flex items-center justify-between"
            {...blockReveal(5)}
          >
            <span className="font-medium">
              {isUniversitySearchLoading ? (
                <span className="inline-flex h-5 w-44 animate-pulse rounded bg-muted/70" />
              ) : (
                `${totalUniversities} Universities`
              )}
            </span>
            <button
              type="button"
              onClick={clearAllFilters}
              disabled={!hasActiveFilters}
              className={`inline-flex w-auto items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                hasActiveFilters
                  ? "bg-linear-to-r from-primary to-primary/85 text-primary-foreground"
                  : "cursor-not-allowed bg-muted text-muted-foreground"
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          </motion.div>

          {/* UNIVERSITY CARDs */}
          <motion.div className="space-y-3" {...blockReveal(6)}>
            <motion.div
              className="flex items-center justify-between gap-2"
              {...blockReveal(6.2)}
            >
              {!isUniversitySearchLoading && !university?.length && (
                <span className="text-sm text-muted-foreground">
                  No universities found
                </span>
              )}
            </motion.div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {isUniversitySearchLoading ? (
                <>
                  {skeletonCards.map((index) => (
                    <motion.div
                      key={`university-skeleton-${index}`}
                      className="rounded-[28px] border border-border/60 bg-card/60 p-1 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.35)]"
                    >
                      <div className="pointer-events-none relative overflow-hidden rounded-[24px]">
                        <div className="h-52 w-full animate-pulse bg-muted/70" />
                        <div className="absolute left-3 top-3 flex gap-2">
                          <span className="h-6 w-20 rounded-full bg-background/55" />
                          <span className="h-6 w-16 rounded-full bg-background/55" />
                        </div>
                      </div>
                      <div className="space-y-3 p-3">
                        <div className="space-y-2">
                          <span className="h-3 w-24 rounded bg-muted/70" />
                          <span className="block h-5 w-5/6 rounded bg-muted/80" />
                          <span className="block h-4 w-4/6 rounded bg-muted/60" />
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {Array.from({ length: 4 }, (_, cellIndex) => cellIndex).map(
                            (cellIndex) => (
                              <div
                                key={`university-card-skeleton-stat-${cellIndex}`}
                                className="rounded-xl border border-border/40 bg-background/55 p-3"
                              >
                                <span className="mb-2 block h-3 w-16 rounded bg-muted/70" />
                                <span className="block h-4 w-24 rounded bg-muted/80" />
                              </div>
                            ),
                          )}
                        </div>
                        <div className="h-9 rounded-xl border border-border/40 bg-background/55" />
                      </div>
                    </motion.div>
                  ))}
                </>
              ) : (
                university?.map((u, index) => (
                  <motion.div
                    key={u.universitiesid}
                    {...blockReveal(6.4 + index * 0.04)}
                  >
                    <UniversityCard university={u} />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </GradientContainer>

      {/* Mobile floating actions */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-40 px-2 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-1.5 md:hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="mx-auto w-full max-w-5xl rounded-[1.35rem] border border-primary/30 bg-linear-to-r from-primary/18 via-background/90 to-primary/8 px-2 py-1.5 shadow-[0_16px_30px_-24px_rgba(59,130,246,0.8)] backdrop-blur-sm">
          {/* <div className="mx-auto mb-1 h-1 w-10 rounded-full bg-primary/40"></div> */}
          <div className="grid grid-cols-5 gap-1.5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-border/55 bg-background/90 p-1.5 text-foreground/65 transition-all duration-200 hover:border-primary/55 hover:bg-primary/10 hover:text-foreground"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveDrawer("programs")}
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-primary/45 bg-primary/12 text-foreground transition-all duration-200 hover:bg-primary/25"
              aria-label="Open programs"
            >
              <GraduationCap className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveDrawer("specializations")}
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-accent/45 bg-accent/12 text-foreground transition-all duration-200 hover:bg-accent/25"
              aria-label="Open specializations"
            >
              <Layers className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-secondary/35 bg-secondary/8 text-foreground/65 transition-all duration-200 hover:border-secondary/60 hover:bg-secondary/20 hover:text-foreground"
              aria-label="Sort options"
            >
              <ArrowUpDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-muted/50 bg-muted/12 text-muted-foreground transition-all duration-200 hover:border-primary/35 hover:bg-muted/25 hover:text-foreground"
              aria-label="Filter options"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile drawer for Programs */}
      <Sheet
        open={activeDrawer === "programs"}
        onOpenChange={(open) => {
          if (!open) {
            closeDrawer();
          }
        }}
      >
        <SheetContent side="bottom" className="max-h-[80vh] px-4 py-4">
          <SheetHeader>
            <SheetTitle className="text-base">Programs</SheetTitle>
          </SheetHeader>

          <div className="space-y-3">
            {programValues?.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No programs available.
              </p>
            ) : (
              <div className="max-h-[65vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-1 gap-2">
                  {programValues?.map(({ title, total }) => {
                    const isActive = isFilterActive("related_program", title);
                    return (
                      <button
                        key={`drawer-program-${title}`}
                        type="button"
                        onClick={() =>
                          handleFilterSelect("related_program", title)
                        }
                        className={`group flex items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-all ${
                          isActive
                            ? "border-primary bg-linear-to-r from-primary/95 to-primary text-primary-foreground"
                            : "border-border bg-background text-foreground/90"
                        }`}
                      >
                        <span>{title}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] ${
                            isActive
                              ? "bg-white/20 text-primary-foreground"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {total}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile drawer for Specializations */}
      <Sheet
        open={activeDrawer === "specializations"}
        onOpenChange={(open) => {
          if (!open) {
            closeDrawer();
          }
        }}
      >
        <SheetContent side="bottom" className="max-h-[80vh] px-4 py-4">
          <SheetHeader>
            <SheetTitle className="text-base">Specializations</SheetTitle>
          </SheetHeader>

          <div className="space-y-3">
            {!selectedProgram ? (
              <p className="text-sm text-muted-foreground">
                Select a program first to see specializations.
              </p>
            ) : specializationValues.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No specializations found.
              </p>
            ) : (
              <div className="max-h-[65vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-1 gap-2">
                  {specializationValues.map(({ title, total }) => {
                    const isActive = isFilterActive("program", title);
                    return (
                      <button
                        key={`drawer-specialization-${title}`}
                        type="button"
                        onClick={() => handleFilterSelect("program", title)}
                        className={`group flex items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-all ${
                          isActive
                            ? "border-primary bg-linear-to-r from-primary/95 to-primary text-primary-foreground"
                            : "border-border bg-background text-foreground/90"
                        }`}
                      >
                        <span>{title}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] ${
                            isActive
                              ? "bg-white/20 text-primary-foreground"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {total}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}
