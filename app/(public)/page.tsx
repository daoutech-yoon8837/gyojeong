import Link from "next/link";
import { Calendar, ImageIcon, MapPin } from "lucide-react";
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
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-b from-black via-surface to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(220,38,38,0.22),transparent_60%)]" />
        <div className="relative z-10 flex flex-col items-center gap-6 px-5 text-center">
          <h1 className="text-6xl font-black tracking-tighter text-foreground sm:text-8xl md:text-9xl">
            교정
          </h1>
          <p className="text-lg font-bold tracking-[0.3em] text-primary sm:text-xl">
            {band?.genre ?? "록/인디록"}
          </p>
          <Link
            href="/shows"
            className="mt-4 rounded-full bg-primary px-8 py-4 text-base font-bold text-white transition-colors hover:bg-primary-dark"
          >
            공연 일정 보기
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            다가오는 공연
          </h2>
          <Link
            href="/shows"
            className="text-sm font-bold text-muted transition-colors hover:text-primary"
          >
            전체 보기
          </Link>
        </div>

        {shows.length === 0 ? (
          <p className="rounded-xl border border-border bg-surface px-6 py-16 text-center text-muted">
            예정된 공연이 없습니다
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shows.map((show) => (
              <Link
                key={show.id}
                href={`/shows/${show.id}`}
                className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-primary"
              >
                <p className="flex items-center gap-2 text-sm font-bold text-accent">
                  <Calendar size={16} />
                  {formatShortDate(show.show_date)}
                </p>
                <h3 className="mt-3 text-xl font-bold text-foreground group-hover:text-primary">
                  {show.title}
                </h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                  <MapPin size={14} />
                  {show.venue}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            갤러리
          </h2>
          <Link
            href="/gallery"
            className="text-sm font-bold text-muted transition-colors hover:text-primary"
          >
            전체 보기
          </Link>
        </div>

        {gallery.length === 0 ? (
          <p className="rounded-xl border border-border bg-surface px-6 py-16 text-center text-muted">
            등록된 갤러리가 없습니다
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.map((item) => (
              <Link
                key={item.id}
                href={`/gallery/${item.id}`}
                className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-surface"
              >
                {item.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted">
                    <ImageIcon size={28} />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="truncate text-sm font-bold text-white">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            ABOUT
          </h2>
          <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-muted">
            {band?.description ?? "밴드 교정입니다."}
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block rounded-full border border-border px-7 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            더 알아보기
          </Link>
        </div>
      </section>
    </>
  );
}
