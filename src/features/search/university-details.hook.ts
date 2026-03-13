import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import type {
  UniversityDetailsResponse,
} from "./search.types";
import { getUniversityDetails } from "./search.api";

type UniversityDetailsResult = {
  data?: UniversityDetailsResponse;
  isPending: boolean;
  error: unknown;
  isError: boolean;
};

export function useGetUniversityDetails(
  universityId: string,
): UniversityDetailsResult {
  const normalizedUniversityId = universityId.trim();

  const {
    data: response,
    isPending,
    error,
    isError,
  } = useQuery({
    queryKey: queryKeys.search.university(normalizedUniversityId),
    queryFn: () => getUniversityDetails(normalizedUniversityId),
    enabled: Boolean(normalizedUniversityId),
    staleTime: 1000 * 60,
  });

  return {
    data: response,
    isPending,
    error,
    isError,
  };
}
