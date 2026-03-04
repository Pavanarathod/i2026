import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { buildFormData } from "@/lib/utils";
import type {
  AuthResponse,
  CheckUserPayload,
  CheckUserResponse,
  ProfileResponse,
  SignupPayload,
  VerifyOtpPayload,
} from "./auth.types";

export async function checkUser(payload: CheckUserPayload) {
  const res = await api.post<CheckUserResponse>(
    endpoints.auth.checkUser,
    buildFormData(payload),
  );
  return res.data;
}

export async function signin(payload: VerifyOtpPayload) {
  const res = await api.post<AuthResponse>(
    endpoints.auth.signin,
    buildFormData(payload),
  );
  return res.data;
}

export async function signup(payload: SignupPayload) {
  const res = await api.post<AuthResponse>(
    endpoints.auth.signup,
    buildFormData(payload),
  );
  return res.data;
}

export async function getProfile() {
  const res = await api.get<ProfileResponse>(endpoints.auth.me);
  return res.data;
}
