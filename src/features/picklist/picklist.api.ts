import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export async function getPickListValues(payload: FormData) {
  const res = await api.post<{
    data: string[];
  }>(endpoints.pickList.getPickListValues, payload);
  return res.data;
}
