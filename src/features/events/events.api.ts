import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { EventResponse } from "./events.types";

export async function getEvent(payload: FormData) {
  const res = await api.post<EventResponse>(endpoints.events.getEvent, payload);
  return res.data;
}
