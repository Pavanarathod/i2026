import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAuthModalStore } from "@/features/auth/authModalStore";
import { useAuthStore } from "@/features/auth/store";
import { useCheckUser, useSignin, useSignup } from "@/features/auth/auth.hooks";

function digitsOnly(v: string) {
  return v.replace(/\D/g, "");
}
function isValidPhone(phone: string) {
  return digitsOnly(phone).length === 10;
}
function isValidOtp(otp: string) {
  return /^\d{4,6}$/.test(otp);
}

export function OtpDialog() {
  const nav = useNavigate();
  const { isOpen, close } = useAuthModalStore();
  const setAuth = useAuthStore((s) => s.setAuth);

  const checkUserMut = useCheckUser();
  const signinMut = useSignin();
  const signupMut = useSignup();

  // login | signup is decided by checkUser
  const [flow, setFlow] = React.useState<"login" | "signup" | null>(null);

  const [step, setStep] = React.useState<"phone" | "otp">("phone");
  const [phone, setPhone] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);

  const loading =
    checkUserMut.isPending || signinMut.isPending || signupMut.isPending;

  React.useEffect(() => {
    if (!isOpen) {
      setStep("phone");
      setPhone("");
      setOtp("");
      setFlow(null);
      setErr(null);
      checkUserMut.reset();
      signinMut.reset();
      signupMut.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function getErrorMessage(e: unknown) {
    // axios error safety without importing axios types here
    if (typeof e === "object" && e && "response" in e) {
      const anyErr = e as any;
      return (
        anyErr?.response?.data?.message ||
        anyErr?.response?.data?.error ||
        "Request failed."
      );
    }
    if (e instanceof Error) return e.message;
    return "Something went wrong.";
  }

  async function onSendOtp() {
    setErr(null);

    const normalizedPhone = digitsOnly(phone);
    if (!isValidPhone(normalizedPhone)) {
      return setErr("Enter a valid 10-digit phone number.");
    }

    try {
      // 1) Check user (backend decides login/signup)
      const res = await checkUserMut.mutateAsync({ mobile: normalizedPhone });
      setFlow(res.data?.type);

      // 2) Now move to OTP step
      setStep("otp");

      // NOTE:
      // You said "checkUser will send type login / signup"
      // If your backend ALSO triggers OTP sending in checkUser, we're done here.
      // If OTP sending is a separate endpoint, tell me and I'll wire it.
    } catch (e) {
      setErr(getErrorMessage(e));
    }
  }

  async function onVerifyOtp() {
    setErr(null);

    const normalizedPhone = digitsOnly(phone);
    if (!isValidOtp(otp)) {
      return setErr("Enter a valid OTP (4–6 digits).");
    }

    try {
      if (!flow) {
        // Safety: if user refreshed or modal reopened weirdly
        return setErr("Please enter phone number again.");
      }

      if (flow === "login") {
        const res = await signinMut.mutateAsync({ mobile: normalizedPhone, otp });
        const sessionData = {
          token: res.token,
          user: {
            userId: res?.data?.data?.contactid,
            userType: res.user_contact_type,
            isAuthenticated: true,
            userData: res?.data?.data,
          },
          status: "authenticated",
        };

        setAuth(sessionData);
      } else {
        const res = await signupMut.mutateAsync({ mobile: normalizedPhone, otp });
        const sessionData = {
          token: res.token,
          user: {
            userId: res?.data?.data?.contactid,
            userType: res.user_contact_type,
            isAuthenticated: true,
            userData: res?.data?.data,
          },
        };

        setAuth(sessionData);
      }

      close();
      nav("/dashboard", { replace: true });
    } catch (e) {
      setErr(getErrorMessage(e));
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === "phone"
              ? "Login / Signup"
              : flow === "signup"
                ? "Verify OTP (Signup)"
                : "Verify OTP"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {step === "phone" ? (
            <>
              <Input
                placeholder="Phone number"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              {err && <p className="text-sm text-destructive">{err}</p>}

              <Button className="w-full" onClick={onSendOtp} disabled={loading}>
                {loading ? "Checking..." : "Continue"}
              </Button>

              <p className="text-xs text-muted-foreground">
                We’ll verify if you’re an existing user, then ask OTP.
              </p>
            </>
          ) : (
            <>
              <Input
                placeholder="OTP"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              {err && <p className="text-sm text-destructive">{err}</p>}

              <Button
                className="w-full"
                onClick={onVerifyOtp}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setFlow(null);
                  setErr(null);
                }}
                disabled={loading}
              >
                Change phone
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
