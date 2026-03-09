import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ApiPayload } from "@/lib/api/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildFormData(payload: ApiPayload) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (value instanceof Blob) {
      formData.append(key, value);
      continue;
    }

    formData.append(key, String(value));
  }
  return formData;
}

export const offersData = [
  // 🎓 Ranking & Recommendations
  "Top Rank",
  "Recommend",
  "Possible options",
  "Dream",
  "Moderate",
  "Reach",
  "Safe",

  // 💰 Fees & Discounts
  "Application Fee Waiver",
  "75% Application Fee Discount",
  "50% Application Fee Discount",
  "Low Tuition Fee",
  "Zero Deposit",

  // 📅 Intakes / Seasons
  "Spring 2026",
  "Summer 2026",
  "Fall 2026",
  "Spring 2027",

  // 📜 Eligibility
  "15 Years Accepted",
  "Duolingo Accepted",
  "Backlogs Accepted",

  // ⏰ Deadlines
  "Deadline in 7 Days",
  "Deadline in 15 Days",
  "Deadline in 30 Days",
  "Deadline in 45 Days",
  "Deadline in 60 Days",

  // 🧑‍💼 Opportunities
  "Placement",
  "Co-Op",
  "Internship",
  "STEM",
  "WES Required",

  // 🧠 Exams & Waivers
  "GRE Waiver",
  "SAT/ACT Waiver",
  "GMAT Waiver",
  "MOI Accepted",
  "Tuition Fee/Yr <$10,000",
  "Tuition Fee/Yr $10K-20K",
  "Tuition Fee/Yr $20K-30K",
  "Tuition Fee/Yr $30K-40K",
  "Tuition Fee/Yr $40K-50K",
];
