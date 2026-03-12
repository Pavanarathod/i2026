// @ts-nocheck
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Search, ArrowDownCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { offersData } from "@/lib/utils";
import { useGetProgramCategories, useGetProgramsList } from "./landing.hooks";

type QueryStep =
  | "programs"
  | "related"
  | "degree"
  | "country"
  | "year"
  | "semester"
  | "category";

type InternalStep =
  | "program"
  | "specialization"
  | "degree"
  | "country"
  | "year"
  | "semester"
  | "category";

type OptionItem = {
  label: string;
  count?: number;
};

type SearchSelections = {
  step: QueryStep;
  program: string;
  related: string;
  degree: string;
  country: string;
  year: string;
  semester: string;
  addon: string;
};

const STEP_FLOW: QueryStep[] = [
  "programs",
  "related",
  "degree",
  "country",
  "year",
  "semester",
  "category",
];

const BREADCRUMBS: Array<{ key: QueryStep; label: string }> = [
  { key: "programs", label: "Programs" },
  { key: "related", label: "Specialization" },
  { key: "degree", label: "Degree" },
  { key: "country", label: "Country" },
  { key: "year", label: "Year" },
  { key: "semester", label: "Semester" },
  { key: "category", label: "Category" },
];

const PLACEHOLDER_PREFIX: Record<InternalStep, string> = {
  program: "Search program: ",
  specialization: "Search specialization: ",
  degree: "Search degree: ",
  country: "Search country: ",
  year: "Search year: ",
  semester: "Search semester: ",
  category: "Search category: ",
};

const PLACEHOLDER_EXAMPLES: Record<InternalStep, string[]> = {
  program: [
    "Computer Science",
    "Data Science",
    "Psychology",
    "Mechanical",
    "Economics",
  ],
  specialization: [
    "Artificial Intelligence",
    "Digital Marketing",
    "Software Engineering",
    "Finance Analytics",
  ],
  degree: ["Bachelors", "Masters", "MBA", "PhD", "M.Tech"],
  country: ["USA", "Canada", "UK", "Australia", "Germany", "Ireland"],
  year: ["2024", "2025", "2026", "2027", "2028"],
  semester: ["Fall", "Spring", "Summer", "Winter"],
  category: [
    "Top Rank",
    "Recommend",
    "Possible options",
    "Dream",
    "Moderate",
    "Reach",
    "Safe",
  ],
};

const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"];

const slideAnimation = {
  enter: { x: 18, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -18, opacity: 0 },
};

const SEARCH_RESULT_PATH = "/search";

function parseStepFromQuery(raw: string | null): QueryStep {
  if (
    raw === "programs" ||
    raw === "related" ||
    raw === "degree" ||
    raw === "country" ||
    raw === "year" ||
    raw === "semester" ||
    raw === "category"
  ) {
    return raw;
  }

  return "programs";
}

function toInternalStep(step: QueryStep): InternalStep {
  if (step === "programs") return "program";
  if (step === "related") return "specialization";
  return step;
}

function toQueryStep(step: InternalStep): QueryStep {
  if (step === "program") return "programs";
  if (step === "specialization") return "related";
  return step;
}

function parseCount(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function normalizeOptionLabel(
  value: unknown,
  step: InternalStep,
): OptionItem | null {
  if (typeof value === "string") {
    const label = value.trim();
    return label
      ? { label, ...(step === "year" || step === "semester" ? {} : {}) }
      : null;
  }

  if (!value || typeof value !== "object") return null;

  const source = value as Record<string, unknown>;
  const label =
    source.related_programs ??
    source.specialization ??
    source.program ??
    source.degree_type ??
    source.degree ??
    source.country ??
    source.year ??
    source.semester ??
    source.label ??
    source.name ??
    source.title;

  if (typeof label !== "string") return null;
  const normalizedLabel = label.trim();
  if (!normalizedLabel) return null;

  const hasCount =
    step === "program" ||
    step === "specialization" ||
    step === "degree" ||
    step === "country" ||
    step === "semester";

  return {
    label: normalizedLabel,
    ...(hasCount
      ? { count: parseCount(source.count ?? source.total ?? source.value) }
      : {}),
  };
}

function extractApiRows(payload: unknown): unknown[] {
  if (!payload || typeof payload !== "object") return [];

  const root = payload as Record<string, unknown>;
  const nested = root.data;

  if (Array.isArray(nested)) {
    return nested;
  }

  if (!nested || typeof nested !== "object") return [];
  const nestedRows = (nested as Record<string, unknown>).data;

  return Array.isArray(nestedRows) ? nestedRows : [];
}

function buildOptions(
  payload: unknown,
  step: InternalStep,
  fallback: string[] = [],
): OptionItem[] {
  const base = extractApiRows(payload).map((row) =>
    normalizeOptionLabel(row, step),
  );
  const normalized = base.filter((item): item is OptionItem => Boolean(item));

  const deduped = new Map<string, number | undefined>();
  for (const item of normalized) {
    const existing = deduped.get(item.label);
    if (
      existing === undefined ||
      (typeof item.count === "number" && item.count > existing)
    ) {
      deduped.set(item.label, item.count);
    }
  }

  for (const label of fallback) {
    if (!deduped.has(label)) deduped.set(label, undefined);
  }

  return Array.from(deduped.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((first, second) => {
      const firstCount = typeof first.count === "number" ? first.count : -1;
      const secondCount = typeof second.count === "number" ? second.count : -1;
      if (secondCount !== firstCount) return secondCount - firstCount;
      return first.label.localeCompare(second.label);
    });
}

function formatOptionText(option: OptionItem) {
  return typeof option.count === "number"
    ? `${option.label} (${option.count})`
    : option.label;
}

function buildSearchSelections(params: URLSearchParams): SearchSelections {
  return {
    step: parseStepFromQuery(params.get("step")),
    program: params.get("program") ?? "",
    related: params.get("related") ?? params.get("specialization") ?? "",
    degree: params.get("degree_type") ?? params.get("degreeType") ?? "",
    country: params.get("country") ?? "",
    year: params.get("year") ?? "",
    semester: params.get("semester") ?? "",
    addon: params.get("addon") ?? "",
  };
}

function createNextSearchParams(
  selections: SearchSelections,
  step: QueryStep,
  patch: Partial<
    Record<
      | "program"
      | "related"
      | "degree_type"
      | "country"
      | "year"
      | "semester"
      | "addon",
      string
    >
  > = {},
) {
  return {
    step,
    program: patch.program ?? selections.program,
    related: patch.related ?? selections.related,
    degree_type: patch.degree_type ?? selections.degree,
    country: patch.country ?? selections.country,
    year: patch.year ?? selections.year,
    semester: patch.semester ?? selections.semester,
    addon: patch.addon ?? selections.addon,
  };
}

function buildSearchPageQuery(selections: SearchSelections, addon: string) {
  const query = new URLSearchParams();
  query.set("related_programs", selections.program);
  query.set("program", selections.related);
  query.set("degreeType", selections.degree);
  query.set("semester", selections.semester);
  query.set("year", selections.year);
  query.set("country", selections.country);
  query.set("addon", addon);
  return `${SEARCH_RESULT_PATH}?${query.toString()}`;
}

export default function LandingPageRightSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [animatedPlaceholder, setAnimatedPlaceholder] = React.useState("");

  const selections = React.useMemo(
    () => buildSearchSelections(searchParams),
    [searchParams],
  );

  const currentStep = STEP_FLOW.includes(selections.step)
    ? selections.step
    : "programs";
  const currentStepIndex = STEP_FLOW.indexOf(currentStep);
  const internalStep = toInternalStep(currentStep);

  const [searchText, setSearchText] = React.useState<
    Record<InternalStep, string>
  >({
    program: "",
    specialization: "",
    degree: "",
    country: "",
    year: "",
    semester: "",
    category: "",
  });

  React.useEffect(() => {
    const suggestions = PLACEHOLDER_EXAMPLES[internalStep] ?? [];
    if (suggestions.length === 0) {
      setAnimatedPlaceholder("");
      return;
    }

    let suggestionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const animate = () => {
      const currentText = suggestions[suggestionIndex] ?? "";

      if (!isDeleting) {
        if (charIndex < currentText.length) {
          charIndex += 1;
          setAnimatedPlaceholder(currentText.slice(0, charIndex));
          timer = setTimeout(animate, 55);
          return;
        }

        timer = setTimeout(() => {
          isDeleting = true;
          animate();
        }, 650);
        return;
      }

      if (charIndex > 0) {
        charIndex -= 1;
        setAnimatedPlaceholder(currentText.slice(0, charIndex));
        timer = setTimeout(animate, 35);
        return;
      }

      suggestionIndex = (suggestionIndex + 1) % suggestions.length;
      isDeleting = false;
      timer = setTimeout(animate, 250);
    };

    setAnimatedPlaceholder("");
    timer = setTimeout(animate, 120);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [internalStep]);

  const { programs, isGettingProgramsLoading } = useGetProgramsList();
  const relatedApi = useGetProgramCategories("Related Programs");
  const degreeApi = useGetProgramCategories("Degree");
  const countryApi = useGetProgramCategories("Country");
  const semesterApi = useGetProgramCategories("Semester");

  const options: Record<InternalStep, OptionItem[]> = {
    program: React.useMemo(
      () =>
        buildOptions(
          (programs as { data?: unknown } | undefined)?.data,
          "program",
          [],
        ),
      [programs],
    ),
    specialization: React.useMemo(
      () => buildOptions(relatedApi.relatedProgramData, "specialization"),
      [relatedApi.relatedProgramData],
    ),
    degree: React.useMemo(
      () =>
        buildOptions(degreeApi.relatedProgramData, "degree", [
          "Bachelors",
          "Masters",
          "MBA",
          "PhD",
          "MSc",
          "M.Tech",
        ]),
      [degreeApi.relatedProgramData],
    ),
    country: React.useMemo(
      () =>
        buildOptions(countryApi.relatedProgramData, "country", [
          "USA",
          "Canada",
          "UK",
          "Australia",
          "Germany",
          "Ireland",
        ]),
      [countryApi.relatedProgramData],
    ),
    year: YEAR_OPTIONS.map((year) => ({ label: year })),
    semester: React.useMemo(
      () =>
        buildOptions(semesterApi.relatedProgramData, "semester", [
          "Fall",
          "Spring",
          "Summer",
          "Winter",
        ]),
      [semesterApi.relatedProgramData],
    ),
    category: [...new Set(offersData)].map((label) => ({ label })),
  };

  const loadingByStep: Record<
    Exclude<InternalStep, "program" | "year" | "category">,
    boolean
  > = {
    specialization: relatedApi.isGettingRelatedProgramLoading,
    degree: degreeApi.isGettingRelatedProgramLoading,
    country: countryApi.isGettingRelatedProgramLoading,
    semester: semesterApi.isGettingRelatedProgramLoading,
    program: false,
    year: false,
    category: false,
  };

  const visibleOptions = React.useMemo(() => {
    const term = searchText[internalStep].trim().toLowerCase();
    if (!term) return options[internalStep];
    return options[internalStep].filter((option) =>
      option.label.toLowerCase().includes(term),
    );
  }, [options, internalStep, searchText]);

  const canGoBack = currentStepIndex > 0;
  const canGoNext = React.useMemo(() => {
    if (currentStep === "category") return false;
    if (currentStep === "programs") return Boolean(selections.program);
    if (currentStep === "related") return Boolean(selections.related);
    if (currentStep === "degree") return Boolean(selections.degree);
    if (currentStep === "country") return Boolean(selections.country);
    if (currentStep === "year") return Boolean(selections.year);
    if (currentStep === "semester") return Boolean(selections.semester);
    return false;
  }, [currentStep, selections]);

  const setStep = (
    step: QueryStep,
    patch: Partial<
      Record<
        | "program"
        | "related"
        | "degree_type"
        | "country"
        | "year"
        | "semester"
        | "addon",
        string
      >
    > = {},
  ) => {
    setSearchParams(createNextSearchParams(selections, step, patch));
  };

  const jumpToStep = (targetStep: QueryStep) => {
    if (!STEP_FLOW.includes(targetStep)) return;
    const targetIndex = STEP_FLOW.indexOf(targetStep);
    if (targetIndex > currentStepIndex) return;
    setStep(targetStep);
  };

  const onOptionSelect = (value: string) => {
    if (!value) return;

    if (currentStep === "programs") {
      setStep("related", {
        program: value,
        related: "",
        degree_type: "",
        country: "",
        year: "",
        semester: "",
      });
      return;
    }

    if (currentStep === "related") {
      setStep("degree", {
        related: value,
        degree_type: "",
        country: "",
        year: "",
        semester: "",
      });
      return;
    }

    if (currentStep === "degree") {
      setStep("country", {
        degree_type: value,
        country: "",
        year: "",
        semester: "",
      });
      return;
    }

    if (currentStep === "country") {
      setStep("year", {
        country: value,
        year: "",
        semester: "",
      });
      return;
    }

    if (currentStep === "year") {
      setStep("semester", {
        year: value,
        semester: "",
      });
      return;
    }

    if (currentStep === "semester") {
      setStep("category", {
        semester: value,
      });
      return;
    }

    if (currentStep === "category") {
      navigate(buildSearchPageQuery(selections, value));
    }
  };

  const goNext = () => {
    const next = STEP_FLOW[currentStepIndex + 1];
    if (!next) return;
    setStep(next);
  };

  const goBack = () => {
    if (!canGoBack) return;
    const prev = STEP_FLOW[currentStepIndex - 1];
    if (!prev) return;
    setStep(prev);
  };

  const onSearchResultSelect = (value: string) => {
    if (currentStep === "category") {
      navigate(buildSearchPageQuery(selections, value));
      return;
    }
    onOptionSelect(value);
  };

  const onClear = () => {
    setSearchParams({});
    setSearchText({
      program: "",
      specialization: "",
      degree: "",
      country: "",
      year: "",
      semester: "",
      category: "",
    });
  };

  const selectedPills = [
    selections.program
      ? { key: "program", label: "Program", value: selections.program }
      : null,
    selections.related
      ? { key: "related", label: "Specialization", value: selections.related }
      : null,
    selections.degree
      ? { key: "degree", label: "Degree", value: selections.degree }
      : null,
    selections.country
      ? { key: "country", label: "Country", value: selections.country }
      : null,
    selections.year
      ? { key: "year", label: "Year", value: selections.year }
      : null,
    selections.semester
      ? { key: "semester", label: "Semester", value: selections.semester }
      : null,
  ].filter(
    (pill): pill is { key: string; label: string; value: string } =>
      pill !== null,
  );

  if (isGettingProgramsLoading) {
    return (
      <section className="rounded-3xl border border-border/80 bg-card/85 p-4 shadow-lg shadow-black/10">
        <div className="flex h-36 items-center justify-center text-sm text-muted-foreground">
          loading programs…
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-border/80 bg-card/85 p-4 shadow-lg shadow-black/10">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {BREADCRUMBS.map((crumb, index) => {
          const isCurrent = crumb.key === currentStep;
          const isPast = index < currentStepIndex;
          const isLocked = index > currentStepIndex;
          return (
            <React.Fragment key={crumb.key}>
              <button
                type="button"
                disabled={isLocked}
                onClick={() => jumpToStep(crumb.key)}
                className={`font-medium ${
                  isCurrent
                    ? "text-primary"
                    : isPast
                      ? "text-foreground hover:text-primary"
                      : "text-muted-foreground"
                } ${isLocked ? "cursor-not-allowed" : ""}`}
              >
                {crumb.label}
              </button>
              {index < BREADCRUMBS.length - 1 ? (
                <span className="text-muted-foreground">/</span>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {selectedPills.length === 0 ? (
          <></>
        ) : (
          selectedPills.map((pill) => (
            <span
              key={pill.key}
              className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {pill.label}: {pill.value}
            </span>
          ))
        )}
      </div>

      {/* <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Step {currentStepIndex + 1} of {STEP_FLOW.length}
        </span>
        <button
          type="button"
          onClick={onClear}
          className="font-medium text-primary"
        >
          Clear all
        </button>
      </div> */}

      <div className="mb-3 text-sm text-muted-foreground">
        {BREADCRUMBS[currentStepIndex]?.label}
      </div>

      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={searchText[internalStep]}
          onChange={(event) =>
            setSearchText((prev) => ({
              ...prev,
              [internalStep]: event.target.value,
            }))
          }
          placeholder={`${PLACEHOLDER_PREFIX[internalStep]}${animatedPlaceholder}`}
          className="h-11 w-full rounded-xl border border-border bg-background px-9 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial="enter"
          animate="center"
          exit="exit"
          variants={slideAnimation}
          transition={{ duration: 0.2 }}
          className="max-h-88 space-y-2 overflow-auto rounded-xl border border-border bg-background p-2"
        >
          {loadingByStep[internalStep] ? (
            <div className="flex h-24 items-center justify-center text-xs text-muted-foreground">
              loading…
            </div>
          ) : (
            <div className="grid gap-2">
              {visibleOptions.length === 0 ? (
                <div className="px-2 py-6 text-center text-xs text-muted-foreground">
                  No options found
                </div>
              ) : (
                visibleOptions.map((option) => {
                  const selectedValue =
                    currentStep === "programs"
                      ? selections.program
                      : currentStep === "related"
                        ? selections.related
                        : currentStep === "degree"
                          ? selections.degree
                          : currentStep === "country"
                            ? selections.country
                            : currentStep === "year"
                              ? selections.year
                              : currentStep === "semester"
                                ? selections.semester
                                : "";
                  const isSelected = selectedValue === option.label;

                  return (
                    <button
                      type="button"
                      key={option.label}
                      onClick={() => onSearchResultSelect(option.label)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      {formatOptionText(option)}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={goBack}
          disabled={!canGoBack}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        {currentStep !== "category" ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ArrowDownCircle className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </section>
  );
}
