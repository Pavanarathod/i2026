// @ts-nocheck
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  CalendarDays,
  Clock3,
  Globe2,
  Search,
  Users,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useGetEvent } from "../events/events.hooks";
import type { Event } from "../events/events.types";

const sectionReveal = (dir: number) => ({
  hidden: { opacity: 0, x: dir * 48, scale: 0.98 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
});

type Props = {
  index: number;
};

const EVENT_PREVIEW_LIMIT = 8;

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Date TBA";

  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function getEventDateTime(eventItem: Event) {
  const parsed = new Date(eventItem.event_date);
  if (Number.isNaN(parsed.getTime())) return null;

  if (!eventItem.camp_time) return parsed;

  const match = eventItem.camp_time.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return parsed;

  const parsedWithTime = new Date(parsed);
  parsedWithTime.setHours(
    Number.parseInt(match[1] ?? "0", 10),
    Number.parseInt(match[2] ?? "0", 10),
    Number.parseInt(match[3] ?? "0", 10),
  );

  return parsedWithTime;
}

function getCountdownText(eventItem: Event) {
  const target = getEventDateTime(eventItem);
  if (!target) return "Date TBA";

  const diffMs = target.getTime() - Date.now();
  if (diffMs <= 0) return "Starting now";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  const dayLabel = days > 0 ? `${days} day${days === 1 ? "" : "s"}` : "";
  const hourLabel = hours > 0 ? `${hours} hour${hours === 1 ? "" : "s"}` : "";
  const minuteLabel = `${minutes} min`;

  return `Starts in ${[dayLabel, hourLabel, minuteLabel]
    .filter(Boolean)
    .join(" ")}`;
}

function getVisualTone(eventItem: Event) {
  const target = getEventDateTime(eventItem);
  const now = Date.now();
  const diffMs = target ? target.getTime() - now : Number.NaN;

  if (!Number.isNaN(diffMs) && diffMs >= 0 && diffMs <= 6 * 60 * 60 * 1000) {
    return {
      card: "from-primary/20 via-secondary/15 to-card/85",
      accent: "bg-primary/70",
      status: "border-primary/45 bg-primary/12 text-primary",
      button:
        "border-primary/45 bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground",
    };
  }

  return {
    card: "from-primary/12 via-secondary/8 to-card/85",
    accent: "bg-secondary/55",
    status: "border-secondary/45 bg-secondary/12 text-secondary",
    button:
      "border-primary/45 bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground",
  };
}

function toArray(value: Event | Event[] | undefined | null): Event[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getMeetingLink(item: Event) {
  return (
    item.zoom_link ||
    item.google_meet ||
    item.jio_meet ||
    item.whtsapp_grp_link ||
    ""
  );
}

function getUniversityLogoUrl(university?: string | null) {
  if (!university) return "";
  return `https://backup.ishvi.com/mapp/ishvi/img/UNIVERSITYimagess/${encodeURIComponent(university)}.png`;
}

export default function EventsSection({ index }: Props) {
  const [searchText, setSearchText] = useState("");
  const [showAll, setShowAll] = useState(false);

  const { data, isPending } = useGetEvent("Spot Admissions");
  const eventData = toArray(data?.data?.data);

  const { filteredEvents, visibleEvents } = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const list = eventData
      .filter((item) => {
        const eventTime = new Date(item.event_date);
        if (Number.isNaN(eventTime.getTime())) return false;
        if (eventTime < startOfToday) return false;

        if (!query) return true;
        const searchSource = [
          item.campaignname,
          item.university,
          item.venue,
          item.related_programs,
          item.camp_sub_type,
          item.country,
          item.targetaudience,
          item.year_looking_for,
          item.semester_looking_for,
          String(item.targetsize ?? ""),
        ]
          .join(" ")
          .toLowerCase();

        return searchSource.includes(query);
      })
      .sort((a, b) => {
        const dateA = new Date(a.event_date).getTime();
        const dateB = new Date(b.event_date).getTime();
        return dateA - dateB;
      });

    const visible = showAll ? list : list.slice(0, EVENT_PREVIEW_LIMIT);
    return { filteredEvents: list, visibleEvents: visible };
  }, [eventData, searchText, showAll]);

  const canShowMore = filteredEvents.length > EVENT_PREVIEW_LIMIT;
  const sectionDirection = index % 2 === 0 ? -1 : 1;

  if (isPending) {
    return <div className="min-h-[100vh]">Loading</div>;
  }

  return (
    <motion.section
      id="events"
      variants={sectionReveal(sectionDirection)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={clsx(
        " border-b border-border/70",
        "relative overflow-hidden",
        "[background:linear-gradient(180deg,color-mix(in_oklab,var(--background)_72%,white)_0%,color-mix(in_oklab,var(--secondary)_70%,white)_52%,var(--background)_100%)]",
        "dark:[background:linear-gradient(180deg,color-mix(in_oklab,var(--background)_92%,black)_0%,color-mix(in_oklab,var(--secondary)_58%,var(--background))_48%,color-mix(in_oklab,var(--accent)_30%,var(--background))_100%)]",
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/18 blur-3xl dark:bg-primary/14" />
        <div className="absolute top-32 -right-17.5 h-80 w-80 rounded-full bg-secondary/12 blur-3xl dark:bg-secondary/10" />
        <div className="absolute -bottom-22.5 -left-15 h-80 w-80 rounded-full bg-primary/10 blur-3xl dark:bg-primary/8" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent dark:via-primary/20" />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-380 px-4 py-14 lg:px-8">
        <div className="w-full space-y-7">
          <motion.div
            variants={sectionReveal(sectionDirection)}
            className="space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
                  Events
                </h2>
                <p className="mt-3 max-w-3xl text-base text-muted-foreground md:text-lg">
                  Explore live sessions, admissions fairs, and community
                  meetups.
                </p>
              </div>
              <span className="rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-medium text-muted-foreground">
                {filteredEvents.length} event
                {filteredEvents.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="max-w-xl">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={searchText}
                  onChange={(event) => {
                    setSearchText(event.target.value);
                    setShowAll(false);
                  }}
                  type="text"
                  placeholder="Search event, place, university, program..."
                  className="w-full rounded-full border border-border bg-card/80 py-2.5 pl-10 pr-4 text-sm text-foreground shadow-sm outline-none ring-0 backdrop-blur transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2">
            {visibleEvents.map((eventItem) => {
              const meetingLink = getMeetingLink(eventItem);
              const visualTone = getVisualTone(eventItem);

              return (
                <motion.article
                  key={`${eventItem.campaignid}-${eventItem.campaign_no}`}
                  whileHover={{
                    y: -4,
                    boxShadow:
                      "0 20px 40px -30px color-mix(in_srgb,var(--foreground) 14%, transparent)",
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className={clsx(
                    "group relative cursor-pointer overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br p-5 backdrop-blur transition hover:border-primary/70 hover:bg-card/85",
                    visualTone.card,
                  )}
                >
                  <span
                    className={clsx(
                      "absolute left-0 right-0 top-0 h-1",
                      visualTone.accent,
                    )}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={clsx(
                        "relative inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                        visualTone.status,
                      )}
                    >
                      <Clock3 className="h-3.5 w-3.5" />
                      {eventItem.campaignstatus || "Status pending"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border/80 bg-card/70">
                      {eventItem.university ? (
                        <img
                          src={getUniversityLogoUrl(eventItem.university)}
                          alt={`${eventItem.university} logo`}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                          className="h-full w-full rounded-md object-contain p-1"
                        />
                      ) : (
                        <Users className="h-5 w-5 text-muted-foreground" />
                      )}
                    </span>
                    <h3 className="text-xl font-semibold leading-snug text-foreground">
                      {eventItem.campaignname}
                    </h3>
                  </div>

                  <div className="mt-2.5 space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2 leading-5">
                      <CalendarDays className="mt-0.5 h-4 w-4" />
                      <span>
                        {formatDate(eventItem.event_date)}
                        {eventItem.camp_time ? ` • ${eventItem.camp_time}` : ""}
                      </span>
                    </p>

                    {eventItem.university ? (
                      <p className="flex items-start gap-2 leading-5">
                        <Users className="mt-0.5 h-4 w-4" />
                        <span>{eventItem.university}</span>
                      </p>
                    ) : null}

                    {eventItem.uni_representative ? (
                      <p className="flex items-start gap-2 leading-5">
                        <Users className="mt-0.5 h-4 w-4" />
                        <span>{eventItem.uni_representative}</span>
                      </p>
                    ) : null}

                    {eventItem.country ? (
                      <p className="flex items-start gap-2 leading-5">
                        <Globe2 className="mt-0.5 h-4 w-4" />
                        <span>{eventItem.country}</span>
                      </p>
                    ) : null}

                    {eventItem.related_programs ? (
                      <p className="inline-flex rounded-full border border-border/60 bg-background px-2.5 py-1 text-xs">
                        {eventItem.related_programs}
                      </p>
                    ) : null}

                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-2.5 py-1 text-xs leading-5">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-primary">
                          Starts in
                        </span>
                      </span>
                      <span className="rounded-full border border-primary/25 bg-card/70 px-2 py-0.5">
                        {getCountdownText(eventItem)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!meetingLink) return;
                      window.open(meetingLink, "_blank", "noopener,noreferrer");
                    }}
                    disabled={!meetingLink}
                    className={clsx(
                      "mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium text-primary transition hover:gap-3 border-primary/40 bg-primary/15 hover:bg-primary",
                      visualTone.button,
                      !meetingLink &&
                        "cursor-not-allowed border-muted/40 bg-muted/40 text-muted-foreground hover:bg-muted/40 hover:text-muted-foreground hover:gap-2",
                    )}
                  >
                    {meetingLink ? "Join event" : "Link unavailable"}
                    <Video className="h-4 w-4 transition-transform group-hover:scale-110" />
                  </button>
                </motion.article>
              );
            })}

            {visibleEvents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/70 bg-card/55 py-10 text-center text-sm text-muted-foreground md:col-span-2">
                No events found for this search.
              </div>
            ) : null}
          </div>

          {canShowMore ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                className="rounded-full border border-border/80 bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-card/80"
              >
                {showAll ? "Show fewer events" : "Show all events"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}
