import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { AllPrograms, LandingContentResponse } from "./lading.types";

export async function getLandingPageCategoriesData(payload: FormData) {
  const res = await api.post<LandingContentResponse>(
    endpoints.landing.getProgramCount,
    payload,
  );
  return res.data;
}

export async function getPrograms(payload: FormData) {
  const res = await api.post<AllPrograms>(
    endpoints.landing.getAllPrograms,
    payload,
  );
  return res.data;
}
