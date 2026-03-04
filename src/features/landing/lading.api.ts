import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { LandingContentResponse } from "./lading.types";

export async function getLandingContent() {
  const res = await api.get<LandingContentResponse>(endpoints.landing.content);
  return res.data;
}
