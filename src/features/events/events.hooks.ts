import { useQuery } from "@tanstack/react-query";
import { getEvent } from "./events.api";
import type { eventType } from "./events.types";
import { buildFormData } from "@/lib/utils";

export function useGetEvent(eventType: eventType) {
  const payloadData = {
    campaigntype: eventType,
    contactId: "",
    campaignId: "",
    page: 1,
    per_page: 50,
    semester: "",
    owner: "",
    population: "",
    change_agent: "",
    year: "",
    country: "",
    university: "",
  };
  const payload = buildFormData(payloadData);

  return useQuery({
    queryKey: ["eventsAPI", payloadData],
    queryFn: () => getEvent(payload),
  });
}
