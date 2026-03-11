import {
  ArrowRight,
  CircleDollarSign,
  Landmark,
  Bookmark,
  ReceiptText,
  GraduationCap,
  Globe,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { University } from "./search.types";

type Props = {
  university: University;
  onShortlist?: () => void;
  onApply?: () => void;
};

const FALLBACK_IMAGE =
  "https://www.oxfordscholastica.com/wp-content/uploads/2023/07/cambridge-college.jpg";

  function UniversityCard({ university, onShortlist, onApply }: Props) {
  const {
    universitiesid,
    university: universityName,
    degree_type,
    country,
    program,
    semester,
    international_tuition_fee_yr,
    uni_tuition_deposit,
    acceptance_rate,
  } = university;

  const imageName = encodeURIComponent(universityName || "").trim();
  const imageUrl = imageName
    ? `https://ishvi.com/uniImage/university/USA/${imageName}.png`
    : FALLBACK_IMAGE;

  const tuition = international_tuition_fee_yr
    ? international_tuition_fee_yr
    : "N/A";
  const deposit = uni_tuition_deposit ? uni_tuition_deposit : "N/A";
  const countryLabel = country || "Unknown country";
  const degreeLabel = degree_type || "Program";
  const programLabel = program || universityName || "N/A";
  const semesterLabel = semester || "N/A";
  const acceptanceLabel = acceptance_rate || "N/A";

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-border/60 bg-card/60 p-1 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_34px_58px_-30px_rgba(0,0,0,0.45)] dark:shadow-[0_16px_40px_-28px_rgba(0,0,0,0.65)]">
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-[80px]" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-[80px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-background/10 to-transparent dark:via-background/5" />

      <Link
        to={`/university-details/${universitiesid}`}
        className="block rounded-[24px] overflow-hidden border border-border/50 bg-background/40"
      >
        <div className="relative aspect-[16/9]">
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3">
            <span className="rounded-full border border-border/35 bg-background/45 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
              {degreeLabel}
            </span>
            <span className="rounded-full border border-border/35 bg-background/45 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
              Sem: {semesterLabel}
            </span>
          </div>
          <img
            src={imageUrl}
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
            alt={universityName || "University"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/0 dark:from-black/75 dark:via-black/20" />
        </div>
      </Link>

      <div className="space-y-3 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {degreeLabel}
            </p>
            <h3 className="mt-1 line-clamp-2 text-base font-bold leading-tight text-foreground">
              {programLabel}
            </h3>
            <Link
              to={`/university-details/${universitiesid}`}
              className="mt-1 block line-clamp-1 text-sm font-medium text-foreground hover:text-primary hover:underline underline-offset-4"
            >
              {universityName}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-border/40 bg-background/50 px-3 py-2">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] uppercase text-muted-foreground">
              <Landmark className="h-3.5 w-3.5" />
              Country
            </div>
            <p className="font-medium">{countryLabel}</p>
          </div>
          <div className="rounded-xl border border-border/40 bg-background/50 px-3 py-2">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] uppercase text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              Semester
            </div>
            <p className="font-medium">{semesterLabel}</p>
          </div>
          <div className="rounded-xl border border-border/40 bg-background/50 px-3 py-2">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] uppercase text-muted-foreground">
              <ReceiptText className="h-3.5 w-3.5" />
              Deposit
            </div>
            <p className="font-medium">{deposit}</p>
          </div>
          <div className="rounded-xl border border-border/40 bg-background/50 px-3 py-2">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] uppercase text-muted-foreground">
              <CircleDollarSign className="h-3.5 w-3.5" />
              Tuition / Year
            </div>
            <p className="font-medium">{tuition}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-background/50 px-3 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Acceptance: {acceptanceLabel}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onShortlist}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-500/20 hover:text-amber-900 dark:border-amber-300/30 dark:text-amber-200 dark:hover:bg-amber-300/15 dark:hover:text-amber-100"
          >
            <Bookmark className="h-4 w-4" />
            Shortlist
          </button>
          <button
            type="button"
            onClick={onApply}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary/85 px-3 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:opacity-95 hover:shadow-lg hover:shadow-primary/30"
          >
            <Send className="h-4 w-4" />
            Apply
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default UniversityCard;
