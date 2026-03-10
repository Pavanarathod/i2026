import type { ApiResponse } from "@/lib/api/types";

export type PickListValuesData = ApiResponse<{
  data: string[];
}>;

export type PickListInput = {
  operation: "fetchPicklist";
  name: string;
};
