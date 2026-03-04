export type ApiPrimitive = string | number | boolean | Blob | File;

export type ApiPayloadValue = ApiPrimitive | null | undefined;

export type ApiPayload = Record<string, ApiPayloadValue>;

export type ApiResponse<TData> = {
  success: boolean;
  message?: string;
  data: TData;
};

export type ApiListResponse<TItem> = ApiResponse<TItem[]>;
