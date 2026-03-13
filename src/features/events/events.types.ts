import type { ApiResponse } from "@/lib/api/types";

export type Event = {
  campaign_no: string;
  campaignname: string;
  campaigntype: string;
  campaignstatus: string;
  expectedrevenue: string;
  budgetcost: string;
  actualcost: string;
  expectedresponse: string;
  numsent: string;
  product_id: number;
  sponsor: string;
  targetaudience: string;
  targetsize: number;
  expectedresponsecount: number;
  expectedsalescount: number;
  expectedroi: string;
  actualresponsecount: number;
  actualsalescount: number;
  actualroi: string;
  campaignid: number;
  closingdate: string;
  tags: string;
  event_date: string;
  uni_representative: string;
  country: string;
  camp_sub_type: string;
  uni_names: string | null;
  whatsapp_group_name: string;
  zoom_link: string;
  google_meet: string;
  jio_meet: string;
  camp_time: string;
  venue: string;
  bachelors_college_name: string;
  semester_looking_for: string;
  year_looking_for: string;
  camp_population: string;
  camp_uni_id: string;
  whtsapp_grp_link: string;
  related_programs: string;
  meeting_id: string;
  passcode: string;
  scanned_number: string;
  campaign_owner: string;
  group_link_status: string;
  sync_start_time: string | null;
  sync_end_time: string | null;
  contact_created: number;
  contact_linked: number;
  whatsapp_group_id: string;
  telegram_group_id: string;
  host_image: string;
  university: string;
  storedname: string;
  attachmentsid: number;
  path: string;
  campaign_join_count: number;
  joined: string;
};

export type eventType =
  | "Whatsapp Group"
  | "Telegram Group"
  | "Facebook Group"
  | "Spot Admissions";

export type EventResponse = ApiResponse<{
  data: Event;
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  universities: {
    university: string;
  };
}>;
