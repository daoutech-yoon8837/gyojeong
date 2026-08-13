import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase-server";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "공연",
  description: "밴드 교정의 공연 일정",
};

type Show = {
  id: string;
  title: string;
  venue: string;
  show_date: string;
  poster_image: string | null;
  ticket_url: string | null;
  ticket_price: string | null;
};

function ShowCard({ show }: { show: Show }) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary sm:gap-6 sm:p-5">
      <Link
        href={`/shows/${show.id}`}
        className="h-24 w-24 shrink-0 overflow-hidden rounded-lg sm:h-32 sm:w-32"
      >
        {show.poster_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={show.poster_image}
            alt={show.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/30 via-surface-light to-accent/20" />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold text-accent sm:text-sm">
            <Calendar size={14} />
            {formatDateTime(show.show_date)}
          </p>
          <Link href={`/shows/${show.id}`}>
            <h3 className="mt-2 text-lg font-bold text-foreground hover:text-primary sm:text-xl">
              {show.title}
            </h3>
          </Link>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted">
            <MapPin size={14} />
            <span className="truncate">{show.venue}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {show.ticket_price && (
            <span className="text-sm font-bold text-foreground">{show.ticket_price}</span>
          )}
          {show.ticket_url && (
            <a
              href={show.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-primary-dark"
            >
              <Ticket size={14} />
              예매하기
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function ShowsPage() {
  const supabase = await createSupabaseServer();

  const columns = "id, title, venue, show_date, poster_image, ticket_url, ticket_price";
  const now = new Date().toISOString();

  const [upcomingRes, pastRes] = await Promise.all([
    supabase
      .from("shows")
      .select(columns)
      .eq("is_published", true)
      .gte("show_date", now)
      .order("show_date", { ascending: true }),
    supabase
      .from("shows")
      .select(columns)
      .eq("is_published", true)
      .lt("show_date", now)
      .order("show_date", { ascending: false }),
  ]);

  const upcoming = (upcomingRes.data ?? []) as Show[];
  const past = (pastRes.data ?? []) as Show[];

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">공연</h1>

      <section className="mt-12">
        <h2 className="text-2xl font-black text-foreground">다가오는 공연</h2>
        {upcoming.length === 0 ? (
          <p className="mt-6 rounded-xl border border-border bg-surface px-6 py-14 text-center text-muted">
            예정된 공연이 없습니다
          </p>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {upcoming.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-black text-foreground">지난 공연</h2>
        {past.length === 0 ? (
          <p className="mt-6 rounded-xl border border-border bg-surface px-6 py-14 text-center text-muted">
            지난 공연이 없습니다
          </p>
        ) : (
          <div className="mt-6 flex flex-col gap-4 opacity-70">
            {past.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
