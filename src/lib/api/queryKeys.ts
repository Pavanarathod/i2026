export const queryKeys = {
  auth: {
    profile: ["auth", "profile"] as const,
  },
  search: {
    results: (query: string) => ["search", "results", query] as const,
  },
  pickList: {
    values: (pickList: string) => ["pickList", "values", pickList] as const,
  },
  landing: {
    content: ["landing", "content"] as const,
  },
} as const;
