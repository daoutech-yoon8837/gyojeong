import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase-server";
import { formatShortDate } from "@/lib/format";

export default async function HomePage() {
  const supabase = await createSupabaseServer();

  const [bandRes, showsRes, galleryRes] = await Promise.all([
    supabase.from("bands").select("name, description, genre").limit(1).maybeSingle(),
    supabase
      .from("shows")
      .select("id, title, venue, show_date")
      .eq("is_published", true)
      .gte("show_date", new Date().toISOString())
      .order("show_date", { ascending: true })
      .limit(3),
    supabase
      .from("gallery")
      .select("id, title, images")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const band = bandRes.data;
  const shows = showsRes.data ?? [];
  const gallery = galleryRes.data ?? [];

  return (
    <>
      <section className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 px-5 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl md:text-8xl">
            교정
          </h1>
          <p className="text-sm tracking-[0.3em] text-muted uppercase">
            {band?.genre ?? "인디팝/로파이"}
          </p>
        </div>
      </section>

      {shows.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-4xl px-5 py-16">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
                Tour
              </h2>
              <Link
                href="/shows"
                className="text-xs tracking-wide text-muted underline-offset-4 hover:underline"
              >
                전체 보기
              </Link>
            </div>
            <div className="divide-y divide-border">
              {shows.map((show) => (
                <Link
                  key={show.id}
                  href={`/shows/${show.id}`}
                  className="group flex items-center justify-between py-5 transition-opacity hover:opacity-60"
                >
                  <div>
                    <p className="text-lg font-medium text-foreground">
                      {show.title}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                      <MapPin size={13} />
                      {show.venue}
                    </p>
                  </div>
                  <p className="text-sm text-muted">
                    {formatShortDate(show.show_date)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-5xl px-5 py-16">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
                Gallery
              </h2>
              <Link
                href="/gallery"
                className="text-xs tracking-wide text-muted underline-offset-4 hover:underline"
              >
                전체 보기
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {gallery.map((item) => (
                <Link
                  key={item.id}
                  href={`/gallery/${item.id}`}
                  className="group relative aspect-square overflow-hidden bg-surface"
                >
                  {item.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted text-xs">
                      {item.title}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-border">
        <div className="mx-auto max-w-2xl px-5 py-20 text-center">
          <p className="text-base leading-relaxed text-muted">
            {band?.description ?? "밴드 교정입니다."}
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block text-sm text-foreground underline underline-offset-4 hover:opacity-60"
          >
            더 알아보기
          </Link>
        </div>
      </section>
    </>
  );
}
