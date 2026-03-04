import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store";
import { useGetProfile } from "@/features/auth/auth.hooks";

export default function Dashboard() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const profileQuery = useGetProfile(Boolean(token));

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Private route (token required)
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Info (fetched using token)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profileQuery.isLoading && (
              <p className="text-sm text-muted-foreground">Loading user…</p>
            )}
            {profileQuery.isError && (
              <p className="text-sm text-destructive">
                Failed to fetch user profile.
              </p>
            )}

            <pre className="overflow-auto rounded-xl border bg-muted/30 p-4 text-xs">
              {JSON.stringify(
                { token, user, profile: profileQuery.data?.data },
                null,
                2,
              )}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
