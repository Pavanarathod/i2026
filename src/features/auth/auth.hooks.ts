import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import { checkUser, getProfile, signin, signup } from "./auth.api";
import type {
  CheckUserPayload,
  SignupPayload,
  VerifyOtpPayload,
} from "./auth.types";

export function useCheckUser() {
  return useMutation({
    mutationFn: (payload: CheckUserPayload) => checkUser(payload),
  });
}

export function useSignin() {
  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => signin(payload),
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => signup(payload),
  });
}

export function useGetProfile(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: () => getProfile(),
    enabled,
  });
}
