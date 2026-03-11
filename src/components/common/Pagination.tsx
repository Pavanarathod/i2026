import * as React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
};

function clampPage(page: number, min: number, max: number) {
  if (!Number.isFinite(page)) return min;
  if (page < min) return min;
  if (page > max) return max;
  return Math.floor(page);
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  const safeCurrent = clampPage(currentPage, 1, Math.max(1, totalPages));
  const safeTotal = Math.max(1, totalPages);

  const pages = React.useMemo(() => {
    if (safeTotal <= 7) {
      return Array.from({ length: safeTotal }, (_, idx) => idx + 1);
    }

    const start = Math.max(1, safeCurrent - 2);
    const end = Math.min(safeTotal, safeCurrent + 2);
    const middle = Array.from({ length: end - start + 1 }, (_, idx) => start + idx);

    const result: number[] = [];
    if (middle[0] > 2) {
      result.push(1, 2, -1);
    } else {
      for (let i = 1; i < start; i += 1) result.push(i);
    }

    middle.forEach((page) => {
      if (!result.includes(page) && page >= 1 && page <= safeTotal) result.push(page);
    });

    if (middle[middle.length - 1] < safeTotal - 1) {
      result.push(-2, safeTotal - 1, safeTotal);
    } else {
      for (let i = end + 1; i <= safeTotal; i += 1) result.push(i);
    }

    return Array.from(new Set(result)).filter(
      (value) => value >= 1 && value <= safeTotal,
    );
  }, [safeCurrent, safeTotal]);

  if (safeTotal === 1) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={safeCurrent <= 1 || isLoading}
        onClick={() => onPageChange(safeCurrent - 1)}
        className="rounded-xl border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>

      {pages.map((page) => {
        if (page < 0) {
          return (
            <span
              key={`ellipsis-${page}-${safeCurrent}`}
              className="px-2 text-muted-foreground"
            >
              ...
            </span>
          );
        }

        const isActive = page === safeCurrent;
        return (
          <button
            type="button"
            key={page}
            onClick={() => onPageChange(page)}
            disabled={isLoading}
            className={`h-9 min-w-9 rounded-lg border px-3 text-sm transition ${
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-secondary"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        disabled={safeCurrent >= safeTotal || isLoading}
        onClick={() => onPageChange(safeCurrent + 1)}
        className="rounded-xl border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
