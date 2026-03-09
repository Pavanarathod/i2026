import type { ApiResponse } from "@/lib/api/types";

export type LandingHero = {
  title: string;
  subtitle: string;
  cta_label: string;
};

export type LandingStat = {
  label: string;
  value: string;
};

export type LandingContent = {
  hero: LandingHero;
  stats: LandingStat[];
};

export type LandingContentResponse = ApiResponse<LandingContent>;

export type AllPrograms = {
  success: true;
  data: {
    data: {
      related_programs: string;
      count: number;
    }[];
  };
};
