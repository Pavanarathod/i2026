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
