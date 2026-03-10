import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useGetSearchResults } from "@/features/search/search.hooks";
import { useGetPickListValues } from "@/features/picklist/picklist.hook";

const sectionAnim = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

function DebugFilterRows() {
  const [searchParams] = useSearchParams();

  if (searchParams.toString().trim().length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No filters provided in query yet.
      </p>
    );
  }

  const rows = Object.entries(
    Object.fromEntries(searchParams.entries()),
  ).filter(([, value]) => value.trim() !== "");

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No valid filters found in query.
      </p>
    );
  }

  return (
    <div className="space-y-1 rounded-lg border border-border bg-muted/60 p-4">
      {rows.map(([key, value]) => (
        <div key={key} className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{key}:</span> {value}
        </div>
      ))}
    </div>
  );
}

export default function SearchPage() {
  const { data, isLoading, isError, error } = useGetSearchResults();
  const {} = useGetPickListValues("semester");
  const {} = useGetPickListValues("country");
  const {} = useGetPickListValues("year");
  const {} = useGetPickListValues("degree_type");

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={sectionAnim}
      className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl px-4 py-10"
    >
      <section className="w-full rounded-3xl border border-border bg-card/80 p-6 shadow-lg shadow-black/10">
        <h1 className="text-2xl font-semibold">Search Results</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This page is scaffolded and ready for your live search rendering.
        </p>

        <div className="mt-6 space-y-4">
          <DebugFilterRows />

          {isLoading && (
            <div className="rounded-lg border border-dashed border-border/80 bg-muted/40 p-4 text-sm text-muted-foreground">
              loading results…
            </div>
          )}

          {!isLoading && isError && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              Failed to load search data.
              <pre className="mt-2 text-xs opacity-90">{String(error)}</pre>
            </div>
          )}

          {!isLoading && !isError ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Total results:{" "}
                <span className="font-medium text-foreground">
                  {data?.data?.data?.pagination?.total ?? 0}
                </span>
              </p>
              <div className="rounded-lg border border-border bg-background p-4">
                <pre className="max-h-80 overflow-auto text-xs leading-6">
                  {JSON.stringify(data?.data?.data ?? [], null, 2)}
                </pre>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </motion.main>
  );
}
