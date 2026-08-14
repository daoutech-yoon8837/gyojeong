import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link
        href="/shows"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Tour
      </Link>

      <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,300px)_1fr]">
        {show.poster_image && (
          <div className="aspect-[3/4] overflow-hidden bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={show.poster_image}
              alt={show.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {show.title}
          </h1>

          <dl className="mt-6 space-y-3 text-sm">
            <div>
              <dt className="text-xs text-muted">일시</dt>
              <dd className="mt-0.5 text-foreground">{formatDateTime(show.show_date)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">장소</dt>
              <dd className="mt-0.5 text-foreground">{show.venue}</dd>
              {show.address && <dd className="text-muted">{show.address}</dd>}
            </div>
            {show.ticket_price && (
              <div>
                <dt className="text-xs text-muted">티켓</dt>
                <dd className="mt-0.5 text-foreground">{show.ticket_price}</dd>
              </div>
            )}
          </dl>

          {show.ticket_url && (
            <a
              href={show.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block border-b border-foreground pb-0.5 text-sm text-foreground hover:opacity-60"
            >
              예매하기 →
            </a>
          )}

          {show.description && (
            <p className="mt-8 whitespace-pre-line text-sm leading-relaxed text-muted">
              {show.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
