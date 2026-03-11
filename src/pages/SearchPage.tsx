import GradientContainer from "@/components/common/GradientContainer";
import PublicHeader from "@/components/common/PublicHeader";
import SearchInput from "@/features/search/SearchInput";
import UniversityCard from "@/features/search/UniversityCard";
import { useGetPickListValues } from "@/features/picklist/picklist.hook";
import {
  ArrowUpDown,
  GraduationCap,
  Layers,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { useGetSearchResults } from "@/features/search/search.hooks";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function SearchPage() {
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
      ? [...relatedPrograms]
          .sort((a, b) => b.Total - a.Total)
          .map((r) => ({ title: r.program, total: r.Total }))
      : [];

  const totalUniversities = searchResults?.pagination?.total ?? 0;

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

  return (
    <main className="min-h-screen w-full bg-background text-foreground pb-24 md:pb-0">
      <PublicHeader />

      {/* MAIN Section */}
      <GradientContainer>
        <div className="md:hidden">
          <SearchInput />
        </div>

        {/* Main Content */}
        <div className="space-y-3">
          <section className="rounded-2xl border border-border/70 bg-card/70 p-4 backdrop-blur-md">
            <div className="space-y-3">
              {filterGroups.map((group) => (
                <div key={group.key} className="space-y-3">
                  <div
                    className={`overflow-x-auto whitespace-nowrap pb-1 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [scrollbar-height:none] [&::-webkit-scrollbar]:hidden ${
                      isPending ? "pointer-events-none opacity-80" : ""
                    }`}
                  >
                    <div className="inline-flex items-center gap-2">
                      {group.values.map((value) => {
                        const isActive = isFilterActive(group.key, value);
                        return (
                          <button
                            type="button"
                            key={`${group.key}-${value}`}
                            onClick={() => handleFilterSelect(group.key, value)}
                            className={`rounded-full border px-3 py-1.5 text-sm font-medium tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
                              isActive
                                ? "border-primary bg-gradient-to-r from-primary/95 to-primary text-primary-foreground"
                                : "border-border bg-background text-foreground/90 hover:border-primary/50 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent"
                            }`}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {pickListLoading && (
              <p className="mt-3 text-xs text-muted-foreground">Loading filters...</p>
            )}
          </section>

          {/* PROGRAMS AND SPECIFICATIONS */}
          <section className="hidden rounded-2xl border border-border/70 bg-card/70 p-4 backdrop-blur-md md:block">
            <div className="space-y-3">
              <div className="space-y-3">
                <div className="overflow-x-auto whitespace-nowrap pb-1 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [scrollbar-height:none] [&::-webkit-scrollbar]:hidden">
                  <div className="inline-flex items-center gap-2">
                    {programValues?.map(({ title, total }) => {
                      const isActive = isFilterActive("related_program", title);
                      return (
                        <button
                          type="button"
                          key={`related_program-${title}`}
                          onClick={() => handleFilterSelect("related_program", title)}
                          className={`rounded-full border px-3 py-1.5 text-sm font-medium tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
                            isActive
                              ? "border-primary bg-gradient-to-r from-primary/95 to-primary text-primary-foreground"
                              : "border-border bg-background text-foreground/90 hover:border-primary/50 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent"
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
                  <p className="text-sm font-medium text-foreground/80">Specialization</p>
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
                                ? "border-primary bg-gradient-to-r from-primary/95 to-primary text-primary-foreground"
                                : "border-border bg-background text-foreground/90 hover:border-primary/50 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent"
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
          </section>

          <div className="rounded-2xl border border-dashed border-primary/30 bg-card/60 p-3 flex items-center justify-between">
            <span className="font-medium">
              {isUniversitySearchLoading
                ? "Loading"
                : `${totalUniversities} Universities`}
            </span>
            <button
              type="button"
              onClick={clearAllFilters}
              disabled={!hasActiveFilters}
              className={`inline-flex w-auto items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                hasActiveFilters
                  ? "bg-gradient-to-r from-primary to-primary/85 text-primary-foreground"
                  : "cursor-not-allowed bg-muted text-muted-foreground"
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          </div>

          {/* UNIVERSITY CARDs */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              {!isUniversitySearchLoading && !university?.length && (
                <span className="text-sm text-muted-foreground">No universities found</span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {isUniversitySearchLoading ? (
                <div className="col-span-full rounded-2xl border border-border/50 bg-card/60 px-4 py-10 text-center text-sm text-muted-foreground">
                  Loading universities...
                </div>
              ) : (
                university?.map((u) => (
                  <UniversityCard university={u} key={u.universitiesid} />
                ))
              )}
            </div>
          </section>
        </div>
      </GradientContainer>

      {/* Mobile floating actions */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-5xl grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setActiveDrawer("programs")}
            className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card/70 px-2 py-2 text-xs font-semibold text-foreground/80 transition hover:bg-card"
          >
            <GraduationCap className="h-4 w-4" />
            <span>Programs</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveDrawer("specializations")}
            className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card/70 px-2 py-2 text-xs font-semibold text-foreground/80 transition hover:bg-card"
          >
            <Layers className="h-4 w-4" />
            <span>Specialization</span>
          </button>
          <button
            type="button"
            className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card/70 px-2 py-2 text-xs font-semibold text-foreground/60"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span>Sort</span>
          </button>
          <button
            type="button"
            className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card/70 px-2 py-2 text-xs font-semibold text-foreground/60"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

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
            {programValues.length === 0 ? (
              <p className="text-sm text-muted-foreground">No programs available.</p>
            ) : (
              <div className="max-h-[65vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-1 gap-2">
                  {programValues.map(({ title, total }) => {
                    const isActive = isFilterActive("related_program", title);
                    return (
                      <button
                        key={`drawer-program-${title}`}
                        type="button"
                        onClick={() => handleFilterSelect("related_program", title)}
                        className={`group flex items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-all ${
                          isActive
                            ? "border-primary bg-gradient-to-r from-primary/95 to-primary text-primary-foreground"
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
                            ? "border-primary bg-gradient-to-r from-primary/95 to-primary text-primary-foreground"
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
