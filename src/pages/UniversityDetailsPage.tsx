import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import {
  BookOpen,
  CalendarDays,
  CircleDollarSign,
  Globe,
  GraduationCap,
  MapPin,
  Send,
  Sparkles,
  Wallet,
  Share2,
  Eye,
  Heart,
  ArrowUpRight,
  Home,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PublicHeader from "@/components/common/PublicHeader";
import { useGetUniversityDetails } from "@/features/search/university-details.hook";
import type { University } from "@/features/search/search.types";

const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
      staggerChildren: 0.06,
    },
  },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

function Value({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  const displayValue =
    value === null || value === undefined || value === ""
      ? "Not available"
      : `${value}`;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-medium text-foreground">{displayValue}</p>
    </div>
  );
}

function InfoPill({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/55 px-3 py-2 text-xs font-semibold text-muted-foreground">
      {icon}
      {text}
    </span>
  );
}

export default function UniversityDetailsPage() {
  const params = useParams<{ universitiesid: string }>();
  const navigate = useNavigate();

  const universityId = params.universitiesid ?? "";
  const FALLBACK_IMAGE =
    "https://www.oxfordscholastica.com/wp-content/uploads/2023/07/cambridge-college.jpg";

  const { data, isPending, isError } = useGetUniversityDetails(universityId);
  const university: University | undefined = data?.data?.data;

  const imageName = encodeURIComponent(university?.university || "").trim();
  const imageUrl = imageName
    ? `https://ishvi.com/uniImage/university/USA/${imageName}.png`
    : FALLBACK_IMAGE;

  const deadlineText = university?.inter_adm_deadline
    ? new Date(university.inter_adm_deadline).toLocaleDateString("en-GB")
    : "Not specified";
  const deadlinePassed =
    !!university?.inter_adm_deadline &&
    new Date(university.inter_adm_deadline).getTime() < Date.now();

  const tags = [
    university?.country || "Unknown country",
    university?.semester || "Semester",
    university?.university_type || "University",
    university?.degree_type || "Program",
  ].filter(Boolean);

  const feeMain =
    university?.international_tuition_fee_yr ||
    university?.domestic_tuition_fee_yr;
  const location = [
    university?.city,
    university?.state_province,
    university?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const shortMetrics = [
    {
      icon: <Eye className="h-3.5 w-3.5" />,
      label: "Views",
      value: university?.total_view ?? 0,
    },
    {
      icon: <Heart className="h-3.5 w-3.5" />,
      label: "Shortlisted",
      value: university?.total_shortlisted ?? 0,
    },
    {
      icon: <GraduationCap className="h-3.5 w-3.5" />,
      label: "Applied",
      value: university?.total_applied ?? 0,
    },
    {
      icon: <BookOpen className="h-3.5 w-3.5" />,
      label: "Admitted",
      value: university?.total_admitted ?? 0,
    },
    {
      icon: <CircleDollarSign className="h-3.5 w-3.5" />,
      label: "Enrolled",
      value: university?.total_enrolled ?? 0,
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicHeader />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--primary)_20%,transparent),transparent_46%),radial-gradient(circle_at_bottom_right,color-mix(in_oklab,var(--accent)_15%,transparent),transparent_48%),var(--background)]" />
        <div className="relative mx-auto w-full max-w-380 px-4 py-8 lg:px-8">
          <motion.div
            initial="hidden"
            animate="show"
            variants={sectionReveal}
            className="space-y-4"
          >
            {isPending ? (
              <div className="min-h-[42vh] rounded-3xl border border-border/50 bg-card/60 p-8">
                <p className="text-sm text-muted-foreground">
                  Loading university...
                </p>
              </div>
            ) : isError || !university ? (
              <div className="min-h-[42vh] rounded-3xl border border-border/50 bg-card/60 p-8">
                <p className="text-sm text-muted-foreground">
                  University details are not available right now.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/search")}
                  className="mt-4 inline-flex items-center rounded-xl border border-border/70 bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary"
                >
                  Return to search
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-5 md:grid-cols-[1.25fr_1fr]">
                  <motion.div
                    variants={cardReveal}
                    className="overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-5 md:p-6 lg:p-8 backdrop-blur"
                  >
                    <p className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {university.degree_type || "University"}
                    </p>

                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div>
                        <h1 className="max-w-4xl text-3xl font-black tracking-tight md:text-4xl xl:text-5xl">
                          {university.university}
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {university.program || "Program details not provided"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!university) return;
                          const text = `${university.university} - ${university.program || ""}\nFees: ${feeMain || "N/A"}\nDeadline: ${deadlineText}`;
                          window.open(
                            `https://wa.me/?text=${encodeURIComponent(text)}`,
                            "_blank",
                          );
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-secondary"
                      >
                        <Share2 className="h-4 w-4" />
                        Share
                      </button>
                    </div>

                    <p className="mt-6 max-w-4xl text-base leading-relaxed text-muted-foreground">
                      {university.why_this_university ||
                        university.depart_description ||
                        "Program description not available."}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <InfoPill
                          key={tag}
                          icon={<MapPin className="h-3.5 w-3.5" />}
                          text={tag}
                        />
                      ))}
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <Value label="Country" value={university.country} />
                      <Value label="City" value={university.city} />
                      <Value
                        label="Department"
                        value={
                          university.department || university.specialisation
                        }
                      />
                      <Value
                        label="Acceptance Rate"
                        value={university.acceptance_rate}
                      />
                      <Value
                        label="Program Rank"
                        value={university.program_rank}
                      />
                      <Value
                        label="Course mode"
                        value={
                          university.university_application_online || "N/A"
                        }
                      />
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Deadline
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-foreground">
                          <CalendarDays className="h-4 w-4" />
                          {deadlineText}
                        </p>
                        <p
                          className={`mt-2 text-xs ${deadlinePassed ? "text-destructive" : "text-emerald-500"}`}
                        >
                          {university.inter_adm_deadline
                            ? deadlinePassed
                              ? "Deadline passed"
                              : "Applications are open"
                            : "No deadline shared"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Location
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-foreground">
                          {location || "Location details unavailable."}
                        </p>
                        <a
                          href={
                            university.uni_address
                              ? `https://maps.google.com/?q=${encodeURIComponent(university.uni_address)}`
                              : "#"
                          }
                          target={university.uni_address ? "_blank" : "_self"}
                          rel={
                            university.uni_address ? "noreferrer" : undefined
                          }
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
                          onClick={(event) => {
                            if (!university.uni_address) {
                              event.preventDefault();
                            }
                          }}
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          Open in maps
                        </a>
                      </div>

                      <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Rankings
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          National{" "}
                          <span className="font-medium text-foreground">
                            {university.uni_rank || "N/A"}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          QS{" "}
                          <span className="font-medium text-foreground">
                            {university.qs_world_univ_rankings || "N/A"}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          US News{" "}
                          <span className="font-medium text-foreground">
                            {university.us_news_rankings || "N/A"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={cardReveal} className="space-y-4">
                    <div className="rounded-3xl border border-border/60 bg-card/60 p-5 backdrop-blur">
                      <h2 className="text-lg font-bold">University preview</h2>
                      <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-background/50">
                        <img
                          src={imageUrl}
                          alt={university.university || "University"}
                          className="h-56 w-full object-cover sm:h-64"
                          onError={(event) => {
                            event.currentTarget.src = FALLBACK_IMAGE;
                          }}
                        />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <a
                          href={university.uni_website || "#"}
                          target={university.uni_website ? "_blank" : "_self"}
                          rel={
                            university.uni_website ? "noreferrer" : undefined
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-background px-3 py-2 text-sm font-semibold transition hover:bg-secondary"
                          onClick={(event) => {
                            if (!university.uni_website) {
                              event.preventDefault();
                            }
                          }}
                        >
                          <Globe className="h-4 w-4" />
                          Visit website
                        </a>
                        <a
                          href={university.application_link || "#"}
                          target={
                            university.application_link ? "_blank" : "_self"
                          }
                          rel={
                            university.application_link
                              ? "noreferrer"
                              : undefined
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:opacity-95"
                          onClick={(event) => {
                            if (!university.application_link) {
                              event.preventDefault();
                            }
                          }}
                        >
                          <Send className="h-4 w-4" />
                          Apply now
                        </a>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-border/60 bg-card/60 p-5 backdrop-blur">
                      <h2 className="text-lg font-bold">Quick actions</h2>
                      <div className="mt-4 grid gap-2 text-sm">
                        {shortMetrics.map((metric) => (
                          <div
                            key={metric.label}
                            className="flex items-center justify-between rounded-xl border border-border/50 bg-background/50 px-3 py-2"
                          >
                            <span className="inline-flex items-center gap-2 text-muted-foreground">
                              {metric.icon}
                              {metric.label}
                            </span>
                            <span className="font-semibold">
                              {metric.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-border/60 bg-card/60 p-5 backdrop-blur">
                      <h2 className="text-lg font-bold">Important links</h2>
                      <div className="mt-4 space-y-2 text-sm">
                        <a
                          href={university.application_deadline_link || "#"}
                          target={
                            university.application_deadline_link
                              ? "_blank"
                              : "_self"
                          }
                          rel={
                            university.application_deadline_link
                              ? "noreferrer"
                              : undefined
                          }
                          className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-muted-foreground hover:text-foreground"
                          onClick={(event) => {
                            if (!university.application_deadline_link) {
                              event.preventDefault();
                            }
                          }}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                          Application deadline details
                        </a>
                        <a
                          href={university.international_app_fee_link || "#"}
                          target={
                            university.international_app_fee_link
                              ? "_blank"
                              : "_self"
                          }
                          rel={
                            university.international_app_fee_link
                              ? "noreferrer"
                              : undefined
                          }
                          className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-muted-foreground hover:text-foreground"
                          onClick={(event) => {
                            if (!university.international_app_fee_link) {
                              event.preventDefault();
                            }
                          }}
                        >
                          <Wallet className="h-4 w-4" />
                          International application fee
                        </a>
                        <a
                          href={university.how_to_apply || "#"}
                          target={university.how_to_apply ? "_blank" : "_self"}
                          rel={
                            university.how_to_apply ? "noreferrer" : undefined
                          }
                          className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-muted-foreground hover:text-foreground"
                          onClick={(event) => {
                            if (!university.how_to_apply) {
                              event.preventDefault();
                            }
                          }}
                        >
                          <GraduationCap className="h-4 w-4" />
                          How to apply
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  variants={cardReveal}
                  className="grid gap-4 rounded-3xl border border-border/60 bg-card/60 p-6 md:grid-cols-2"
                >
                  <article className="rounded-2xl border border-border/50 bg-background/50 p-4">
                    <h3 className="mb-2 flex items-center gap-2 text-base font-semibold">
                      <BookOpen className="h-4 w-4" />
                      Admission requirements
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {university.program_requirements ||
                        "Admission requirements are not available yet."}
                    </p>
                  </article>

                  <article className="rounded-2xl border border-border/50 bg-background/50 p-4">
                    <h3 className="mb-2 flex items-center gap-2 text-base font-semibold">
                      <CircleDollarSign className="h-4 w-4" />
                      Fees & finance
                    </h3>
                    <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      <p>
                        International Tuition:
                        <span className="ml-1 font-medium text-foreground">
                          {feeMain || "N/A"}
                        </span>
                      </p>
                      <p>
                        University deposit:
                        <span className="ml-1 font-medium text-foreground">
                          {university.uni_tuition_deposit ||
                            university.program_tuition_deposit ||
                            "N/A"}
                        </span>
                      </p>
                      <p>
                        Application fee:
                        <span className="ml-1 font-medium text-foreground">
                          {university.international_app_fee || "N/A"}
                        </span>
                      </p>
                      <p>
                        Deposit deadline:
                        <span className="ml-1 font-medium text-foreground">
                          {university.uni_deposit_deadline || "N/A"}
                        </span>
                      </p>
                      <p>
                        Scholarship:
                        <span className="ml-1 font-medium text-foreground">
                          {university.total_scholarshipsamount || "N/A"}
                        </span>
                      </p>
                      <p>
                        Fee waiver:
                        <span className="ml-1 font-medium text-foreground">
                          {university.app_fee_waiver || "No"}
                        </span>
                      </p>
                    </div>
                  </article>

                  <article className="rounded-2xl border border-border/50 bg-background/50 p-4 md:col-span-2">
                    <h3 className="mb-2 flex items-center gap-2 text-base font-semibold">
                      <Sparkles className="h-4 w-4" />
                      Why this university
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {university.why_this_university ||
                        "No highlights available."}
                    </p>
                  </article>

                  <article className="rounded-2xl border border-border/50 bg-background/50 p-4 md:col-span-2">
                    <h3 className="mb-2 flex items-center gap-2 text-base font-semibold">
                      <Home className="h-4 w-4" />
                      Visa & documents
                    </h3>
                    <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      <p>
                        Academic requirements GPA:{" "}
                        {university.academic_requirements_gpa || "N/A"}
                      </p>
                      <p>Backlogs allowed: {university.num_backlogs}</p>
                      <p>IELTS: {university.ielts || "N/A"}</p>
                      <p>PTE: {university.pte || "N/A"}</p>
                      <p>GRE: {university.gre_total || "N/A"}</p>
                      <p>GMAT: {university.gmat_total || "N/A"}</p>
                    </div>
                  </article>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
