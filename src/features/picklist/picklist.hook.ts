import { useQuery } from "@tanstack/react-query";
import { getPickListValues } from "./picklist.api";
import { buildFormData } from "@/lib/utils";
import { queryKeys } from "@/lib/api/queryKeys";
import type { PickListInput } from "./picklist.types";

export function useGetPickListValues(pickList: string) {
  const payloadData: PickListInput = {
    operation: "fetchPicklist",
    name: pickList,
  };
  const payload = buildFormData(payloadData);

  const { data: pickListData, isPending: isGettingPickListValuesLoading } =
    useQuery({
      queryKey: queryKeys.pickList.values(pickList),
      queryFn: () => getPickListValues(payload),
      enabled: Boolean(pickList.trim()),
    });

  return {
    pickListData,
    isGettingPickListValuesLoading,
  };
}
