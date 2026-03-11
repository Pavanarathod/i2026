import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Search, X } from "lucide-react";

import searchData from "../../data/uniSearchData.json";

const placeholderText =
  "Search program, university, country, semester, or add-on";

const dedupe = (items: string[]) => Array.from(new Set(items.map((item) => item.trim())));

function SearchInput() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [programFlag, setProgramFlag] = useState("");
  const [countryFlag, setCountryFlag] = useState("");
  const [addonFlag, setAddonFlag] = useState("");
  const [semesterFlag, setSemesterFlag] = useState("");
  const [uniFlag, setUniFlag] = useState("");

  const [searchKey, setSearchKey] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  const dataIndex = useMemo(
    () => ({
      programs: new Set(searchData.programs),
      universities: new Set(searchData.universityVersion2),
      countries: new Set(searchData.country),
      addons: new Set(searchData.addonCondition),
      semesters: new Set(searchData.semester),
    }),
    [],
  );

  const hasStructuredFilter =
    Boolean(programFlag || uniFlag || countryFlag || addonFlag || semesterFlag);

  const buildParamsFromFlags = (extraQuery?: string) => {
    const params = new URLSearchParams();

    if (programFlag) params.set("program", programFlag);
    if (uniFlag) params.set("university", uniFlag);
    if (countryFlag) params.set("country", countryFlag);
    if (addonFlag) params.set("addon", addonFlag);
    if (semesterFlag) params.set("semester", semesterFlag);

    if (
      !hasStructuredFilter &&
      extraQuery &&
      extraQuery.trim().length > 0
    ) {
      params.set("q", extraQuery);
    }

    return params.toString();
  };

  const normalize = (value: string) => value.trim().toLowerCase();

  const handleInputChange = (key: string) => {
    setSearchKey(key);
    setHighlightIndex(-1);

    if (!key) {
      setProgramFlag("");
      setCountryFlag("");
      setAddonFlag("");
      setSemesterFlag("");
      setUniFlag("");
      setSuggestions([]);
      return;
    }

    const normalizedKey = normalize(key);
    let resultData: string[] = [];

    if (hasStructuredFilter) {
      const activeFilters = [
        programFlag,
        semesterFlag,
        uniFlag,
        addonFlag,
        countryFlag,
      ].filter(Boolean);

      const fallbackNeedle = normalize(activeFilters.join(" "));

      if (activeFilters.length) {
        const remaining = normalize(
          activeFilters.reduce((acc, filter) => acc.replace(filter.toLowerCase(), ""), key),
        );

        resultData = dedupe([
          ...searchData.programs,
          ...searchData.universityVersion2,
          ...searchData.country,
          ...searchData.addonCondition,
          ...searchData.semester,
        ]).filter((item) => {
          const value = normalize(item);
          return (
            value.includes(normalizedKey) ||
            value.includes(remaining) ||
            value.includes(fallbackNeedle)
          );
        });
      }
    } else {
      resultData = dedupe([
        ...searchData.programs.filter((o) => normalize(o).includes(normalizedKey)),
        ...searchData.universityVersion2.filter((o) => normalize(o).includes(normalizedKey)),
        ...searchData.country.filter((o) => normalize(o).includes(normalizedKey)),
        ...searchData.addonCondition.filter((o) => normalize(o).includes(normalizedKey)),
        ...searchData.semester.filter((o) => normalize(o).includes(normalizedKey)),
      ]);
    }

    setSuggestions(resultData);
  };

  const handleSuggestionClick = (value: string) => {
    let paramName = "q";
    if (dataIndex.programs.has(value)) {
      setProgramFlag(value);
      paramName = "program";
    } else if (dataIndex.universities.has(value)) {
      setUniFlag(value);
      paramName = "university";
    } else if (dataIndex.countries.has(value)) {
      setCountryFlag(value);
      paramName = "country";
    } else if (dataIndex.addons.has(value)) {
      setAddonFlag(value);
      paramName = "addon";
    } else if (dataIndex.semesters.has(value)) {
      setSemesterFlag(value);
      paramName = "semester";
    }

    setSearchKey(value);
    setSuggestions([]);
    setHighlightIndex(-1);
    setIsFocused(false);

    const params = new URLSearchParams();
    params.set(paramName, value);
    navigate(`/search?${params.toString()}`);
  };

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setSuggestions([]);
    setIsFocused(false);

    if (hasStructuredFilter) {
      const query = buildParamsFromFlags();
      navigate(`/search?${query}`);
      return;
    }

    const trimmedSearch = searchKey.trim();
    if (!trimmedSearch) {
      return alert("Please enter the search query");
    }
    navigate(`/search?q=${encodeURIComponent(trimmedSearch)}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
      return;
    }

    if (event.key === "Escape") {
      setSuggestions([]);
      setHighlightIndex(-1);
      setIsFocused(false);
      return;
    }

    if (event.key === "Enter") {
      if (highlightIndex >= 0 && suggestions[highlightIndex]) {
        event.preventDefault();
        handleSuggestionClick(suggestions[highlightIndex]);
      }
    }
  };

  const handleClear = () => {
    setSearchKey("");
    setSuggestions([]);
    setHighlightIndex(-1);
    setProgramFlag("");
    setCountryFlag("");
    setAddonFlag("");
    setSemesterFlag("");
    setUniFlag("");
  };

  useEffect(() => {
    const nextSearch =
      searchParams.get("q") ??
      searchParams.get("program") ??
      searchParams.get("university") ??
      searchParams.get("country") ??
      searchParams.get("addon") ??
      searchParams.get("semester") ??
      "";

    setProgramFlag(searchParams.get("program") ?? "");
    setUniFlag(searchParams.get("university") ?? "");
    setCountryFlag(searchParams.get("country") ?? "");
    setAddonFlag(searchParams.get("addon") ?? "");
    setSemesterFlag(searchParams.get("semester") ?? "");
    setSearchKey(nextSearch);
    setSuggestions([]);
  }, [searchParams]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.35 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className={clsx(
            "relative flex items-stretch overflow-hidden rounded-2xl border border-border/70 bg-card/90",
            "focus-within:border-primary/70 focus-within:ring-4 focus-within:ring-primary/20",
            "shadow-sm transition",
          )}
        >
          <div className="grid w-12 place-items-center text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>

          <input
            aria-label="Search programs or universities"
            value={searchKey}
            onChange={(event) => handleInputChange(event.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (searchKey) handleInputChange(searchKey);
            }}
            onBlur={() => {
              window.setTimeout(() => {
                setIsFocused(false);
              }, 120);
            }}
            onKeyDown={handleKeyDown}
            className="h-12 flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
            placeholder={placeholderText}
          />

          <div className="mr-2 my-1 flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className={clsx(
                "grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition",
                !searchKey && "pointer-events-none opacity-0",
              )}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>

            <button
              type="submit"
              className="inline-flex h-10 items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/90"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>

      {isFocused && suggestions.length > 0 ? (
        <ul
          role="listbox"
          className="mt-2 flex max-h-80 flex-col overflow-y-auto rounded-xl border border-border/80 bg-card/95 shadow-lg backdrop-blur"
        >
          {suggestions.map((item, index) => (
            <li
              key={item}
              role="option"
              aria-selected={highlightIndex === index}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSuggestionClick(item)}
              className={clsx(
                "cursor-pointer px-4 py-2.5 text-sm text-foreground transition",
                highlightIndex === index
                  ? "bg-primary/90 text-primary-foreground"
                  : "hover:bg-muted/80",
              )}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </motion.div>
  );
}

export default SearchInput;
