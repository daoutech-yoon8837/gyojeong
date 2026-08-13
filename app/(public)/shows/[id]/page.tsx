import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Ticket } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase-server";
import { formatDateTime } from "@/lib/format";

export default async function ShowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const { data: show } = await supabase
    .from("shows")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (!show) notFound();

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <Link
        href="/shows"
        className="inline-flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} />
        공연 목록
      </Link>

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,340px)_1fr]">
        <div className="aspect-[3/4] overflow-hidden rounded-xl border border-border">
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
        </div>

        <div>
          <h1 className="text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
            {show.title}
          </h1>

          <dl className="mt-6 flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
            <div className="flex items-start gap-3">
              <Calendar size={18} className="mt-0.5 shrink-0 text-accent" />
              <div>
                <dt className="text-xs font-bold text-muted">일시</dt>
                <dd className="mt-0.5 text-sm font-bold text-foreground">
                  {formatDateTime(show.show_date)}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-accent" />
              <div>
                <dt className="text-xs font-bold text-muted">장소</dt>
                <dd className="mt-0.5 text-sm font-bold text-foreground">{show.venue}</dd>
                {show.address && (
                  <dd className="mt-0.5 text-sm text-muted">{show.address}</dd>
                )}
              </div>
            </div>
            {show.ticket_price && (
              <div className="flex items-start gap-3">
                <Ticket size={18} className="mt-0.5 shrink-0 text-accent" />
                <div>
                  <dt className="text-xs font-bold text-muted">티켓</dt>
                  <dd className="mt-0.5 text-sm font-bold text-foreground">
                    {show.ticket_price}
                  </dd>
                </div>
              </div>
            )}
          </dl>

          {show.ticket_url && (
            <a
              href={show.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-bold text-white transition-colors hover:bg-primary-dark sm:w-auto"
            >
              <Ticket size={18} />
              예매하기
            </a>
          )}

          {show.description && (
            <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-muted">
              {show.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
