import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import { getLandingContent } from "./lading.api";

export function useLandingContent() {
  return useQuery({
    queryKey: queryKeys.landing.content,
    queryFn: () => getLandingContent(),
  });
}
