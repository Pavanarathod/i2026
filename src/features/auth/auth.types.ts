import type { ApiResponse } from "@/lib/api/types";
import type { UserData, UserType } from "./types";

export type CheckUserPayload = {
  mobile: string;
};

export type VerifyOtpPayload = {
  mobile: string;
  otp: string;
};

export type SignupPayload = VerifyOtpPayload & {
  firstname?: string;
  lastname?: string;
  email?: string;
};

export type CheckUserResponse = {
  data: {
    message: string;
    type: "login" | "signup";
  };
  success: boolean;
};

export type AuthResponse = {
  success: boolean;
  token: string;
  user_contact_type: UserType;
  data: {
    data: UserData;
  };
};

export type ProfileResponse = ApiResponse<UserData>;
