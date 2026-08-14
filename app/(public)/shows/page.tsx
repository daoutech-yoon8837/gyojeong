import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
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

function ShowCard({ show, past }: { show: Show; past?: boolean }) {
  return (
    <Link
      href={`/shows/${show.id}`}
      className={`group flex items-center justify-between border-b border-border py-5 transition-opacity hover:opacity-60 ${past ? "opacity-50" : ""}`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-lg font-medium text-foreground">{show.title}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
          <MapPin size={13} />
          <span className="truncate">{show.venue}</span>
        </p>
      </div>
      <div className="ml-4 shrink-0 text-right">
        <p className="text-sm text-muted">{formatDateTime(show.show_date)}</p>
        {show.ticket_url && !past && (
          <span className="mt-1 inline-block text-xs text-foreground underline underline-offset-2">
            예매
          </span>
        )}
      </div>
    </Link>
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
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-xs font-medium tracking-[0.2em] text-muted uppercase">Tour</h1>

      <section className="mt-10">
        {upcoming.length === 0 && past.length === 0 ? (
          <p className="py-20 text-center text-muted">
            등록된 공연이 없습니다
          </p>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div>
                <h2 className="mb-2 text-xs text-muted">Upcoming</h2>
                {upcoming.map((show) => (
                  <ShowCard key={show.id} show={show} />
                ))}
              </div>
            )}

            {past.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-2 text-xs text-muted">Past</h2>
                {past.map((show) => (
                  <ShowCard key={show.id} show={show} past />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
