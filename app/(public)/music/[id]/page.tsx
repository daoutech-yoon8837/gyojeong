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
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link
        href="/music"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Discography
      </Link>

      <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,260px)_1fr]">
        <div className="aspect-square overflow-hidden bg-surface">
          {album.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={album.cover_image}
              alt={album.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted/30">
              <Disc3 size={48} />
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {album.title}
          </h1>
          {album.release_date && (
            <p className="mt-1 text-sm text-muted">
              {formatDate(album.release_date)}
            </p>
          )}
          {album.description && (
            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-muted">
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
                  className="inline-flex items-center gap-1.5 text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
                >
                  <Icon size={14} />
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {tracks && tracks.length > 0 && (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="text-xs font-medium tracking-[0.2em] text-muted uppercase">Tracklist</h2>
          <ul className="mt-4 divide-y divide-border">
            {tracks.map((track) => (
              <li key={track.id} className="flex items-center gap-4 py-3">
                <span className="w-6 shrink-0 text-sm text-muted">
                  {track.track_number}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {track.title}
                </span>
                {track.duration && (
                  <span className="shrink-0 text-xs text-muted">{track.duration}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
