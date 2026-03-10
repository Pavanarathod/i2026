import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { PickListValuesData } from "./picklist.types";

export async function getPickListValues(payload: FormData) {
  const res = await api.post<PickListValuesData>(
    endpoints.pickList.getPickListValues,
    payload,
  );
  return res.data;
}
