import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { queryKeys } from "@/lib/api/queryKeys";
import { getSearchResults } from "./search.api";
import type { SearchFilterParams } from "./search.types";
import { offersData } from "@/lib/utils";

function buildFilters(params: URLSearchParams): SearchFilterParams {
  const allAddOns = params.getAll("addon");
  const allUniversities = params.getAll("university");

  console.log("allUniversities", allUniversities);

  let addOns: Record<string, boolean> = {};

  offersData?.forEach((i) => {
    if (allAddOns.includes(i)) {
      addOns[i] = true;
    } else {
      addOns[i] = false;
    }
  });

  const payload = {
    operation: "search_university",
    related_programs: params.get("related_program") ?? "",
    program: params.get("program") ?? "",

    degree_type: params.get("degree_type") ?? "Masters",
    degreeType: params.get("degreeType") ?? params.get("degree_type") ?? "",
    university:
      allUniversities.length > 0 ? JSON.stringify(allUniversities) : "",
    country: params.get("country") ?? "",
    year: params.get("year") ?? "",
    semester: params.get("semester") ?? "",
    page: 1,
    per_page: 50,
    addonConditionType: JSON.stringify(addOns),
  };

  return payload;
}

export function useGetSearchResults() {
  const [searchParams] = useSearchParams();
  const filters = buildFilters(searchParams);

  return useQuery({
    queryKey: queryKeys.search.results(searchParams.toString()),
    queryFn: () => getSearchResults(filters),
  });
}
