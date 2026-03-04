import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthModalStore } from "@/features/auth/authModalStore";
import { OtpDialog } from "@/features/auth/components/OtpDialog";

export default function PublicHome() {
  const open = useAuthModalStore((s) => s.open);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <OtpDialog />

      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">i2026</h1>
          <p className="text-sm text-muted-foreground">
            Public page (Landing/Search later). Login modal should open from
            here.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Try Auth Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={open}>Open Login (OTP)</Button>
            <p className="text-sm text-muted-foreground">
              After OTP verify, you’ll be routed to the private dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
