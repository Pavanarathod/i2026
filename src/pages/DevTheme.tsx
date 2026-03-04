import * as React from "react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreVertical } from "lucide-react";

export default function DevTheme() {
  const [query, setQuery] = React.useState("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Fake App Shell */}
      <div className="flex min-h-screen">
        {/* Sidebar preview */}
        <aside className="hidden w-72 border-r bg-[var(--sidebar)] text-[var(--sidebar-foreground)] md:block">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium opacity-80">
                  Study Abroad
                </div>
                <div className="text-lg font-semibold">Dashboard</div>
              </div>
              <Badge className="bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] border border-[var(--sidebar-border)]">
                v2
              </Badge>
            </div>

            <Separator className="my-4 bg-[var(--sidebar-border)]" />

            <nav className="space-y-1">
              {[
                { label: "Overview", active: true },
                { label: "Leads" },
                { label: "Students" },
                { label: "Universities" },
                { label: "Applications" },
                { label: "Finance" },
                { label: "Settings" },
              ].map((item) => (
                <button
                  key={item.label}
                  className={[
                    "w-full rounded-lg px-3 py-2 text-left text-sm transition",
                    item.active
                      ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
                      : "hover:bg-[var(--sidebar-accent)]/60",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          {/* Topbar */}
          <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
              <div className="space-y-0.5">
                <h1 className="text-lg font-semibold">Theme Playground</h1>
                <p className="text-sm text-muted-foreground">
                  Check light/dark, sidebar, cards, buttons, inputs.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="More">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Notifications</DropdownMenuItem>
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-6xl space-y-6 p-4">
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Badge>Active</Badge>
                  <Badge variant="secondary">Pending</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search student..."
                  />
                  <Input placeholder="Email" />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Student Details</DialogTitle>
                      </DialogHeader>
                      <div className="text-sm text-muted-foreground">
                        This dialog checks popover + card styles + text
                        contrast.
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">Open Sheet</Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Quick Actions</SheetTitle>
                      </SheetHeader>
                      <div className="mt-4 space-y-3 text-sm">
                        <Button className="w-full">Create Lead</Button>
                        <Button variant="secondary" className="w-full">
                          Upload Docs
                        </Button>
                        <Button variant="outline" className="w-full">
                          Assign Counsellor
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </CardContent>
            </Card>

            {/* KPI row */}
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { label: "New Leads", value: "128", delta: "+12%" },
                { label: "Active Students", value: "56", delta: "+4%" },
                { label: "Applications", value: "23", delta: "+2" },
                { label: "Visa Approved", value: "9", delta: "+1" },
              ].map((k) => (
                <Card key={k.label}>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">
                      {k.label}
                    </div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <div className="text-2xl font-semibold">{k.value}</div>
                      <Badge variant="secondary">{k.delta}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tabs + Table preview */}
            <Card>
              <CardHeader>
                <CardTitle>Tabs & Table</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="leads">
                  <TabsList>
                    <TabsTrigger value="leads">Leads</TabsTrigger>
                    <TabsTrigger value="students">Students</TabsTrigger>
                  </TabsList>

                  <TabsContent value="leads" className="mt-4">
                    <div className="overflow-hidden rounded-xl border">
                      <div className="grid grid-cols-4 gap-2 bg-muted/40 p-3 text-xs font-medium text-muted-foreground">
                        <div>Name</div>
                        <div>Status</div>
                        <div>Country</div>
                        <div className="text-right">Actions</div>
                      </div>

                      {[
                        { name: "Arjun Kumar", status: "New", country: "UK" },
                        {
                          name: "Priya Sharma",
                          status: "Contacted",
                          country: "Canada",
                        },
                        {
                          name: "Rahul Verma",
                          status: "Docs Pending",
                          country: "USA",
                        },
                      ].map((r) => (
                        <div
                          key={r.name}
                          className="grid grid-cols-4 items-center gap-2 border-t p-3 text-sm"
                        >
                          <div className="font-medium">{r.name}</div>
                          <div>
                            <Badge
                              variant={
                                r.status === "New" ? "default" : "secondary"
                              }
                            >
                              {r.status}
                            </Badge>
                          </div>
                          <div className="text-muted-foreground">
                            {r.country}
                          </div>
                          <div className="text-right">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="students" className="mt-4">
                    <div className="rounded-xl border p-4 text-sm text-muted-foreground">
                      Add your real DataTable later — this is just a
                      placeholder.
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
