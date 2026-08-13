import Link from "next/link";
import { notFound } from "next/navigation";
import { Apple, ArrowLeft, Disc3, Music2, Video } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase-server";
import { formatDate } from "@/lib/format";

const STREAMING = [
  { key: "spotify", label: "Spotify", Icon: Music2 },
  { key: "apple_music", label: "Apple Music", Icon: Apple },
  { key: "youtube_music", label: "YouTube Music", Icon: Video },
] as const;

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const { data: album } = await supabase
    .from("albums")
    .select("id, title, release_date, cover_image, description, streaming_links")
    .eq("id", id)
    .maybeSingle();

  if (!album) notFound();

  const { data: tracks } = await supabase
    .from("tracks")
    .select("id, title, track_number, duration")
    .eq("album_id", album.id)
    .order("track_number", { ascending: true });

  const links: Record<string, string> = album.streaming_links ?? {};
  const available = STREAMING.filter((item) => links[item.key]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <Link
        href="/music"
        className="inline-flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} />
        음악 목록
      </Link>

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,300px)_1fr]">
        <div className="aspect-square overflow-hidden rounded-xl border border-border bg-surface-light">
          {album.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={album.cover_image}
              alt={album.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-border">
              <Disc3 size={64} />
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
            {album.title}
          </h1>
          {album.release_date && (
            <p className="mt-2 text-sm font-bold text-accent">
              {formatDate(album.release_date)} 발매
            </p>
          )}
          {album.description && (
            <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-muted">
              {album.description}
            </p>
          )}

          {available.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {available.map(({ key, label, Icon }) => (
                <a
                  key={key}
                  href={links[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon size={16} />
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-black text-foreground">트랙 리스트</h2>
        {!tracks || tracks.length === 0 ? (
          <p className="mt-6 rounded-xl border border-border bg-surface px-6 py-14 text-center text-muted">
            등록된 트랙이 없습니다
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {tracks.map((track) => (
              <li key={track.id} className="flex items-center gap-4 px-5 py-4">
                <span className="w-6 shrink-0 text-sm font-bold text-muted">
                  {track.track_number}
                </span>
                <span className="min-w-0 flex-1 truncate text-base font-medium text-foreground">
                  {track.title}
                </span>
                {track.duration && (
                  <span className="shrink-0 text-sm text-muted">{track.duration}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
