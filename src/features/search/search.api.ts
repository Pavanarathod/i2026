import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { buildFormData } from "@/lib/utils";
import type { SearchFilterParams, SearchResultsResponse } from "./search.types";

export async function getSearchResults(payload: SearchFilterParams) {
  console.log("final payload", payload);
  const formData = buildFormData(payload);

  const res = await api.post<SearchResultsResponse>(
    endpoints.search.results,
    formData,
  );
  return res.data;
}
