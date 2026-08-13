import type { Metadata } from "next";
import Link from "next/link";
import { Disc3 } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase-server";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "음악",
  description: "밴드 교정의 앨범 및 디스코그래피",
};

export default async function MusicPage() {
  const supabase = await createSupabaseServer();

  const { data } = await supabase
    .from("albums")
    .select("id, title, release_date, cover_image")
    .order("release_date", { ascending: false });

  const albums = data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">음악</h1>

      {albums.length === 0 ? (
        <p className="mt-10 rounded-xl border border-border bg-surface px-6 py-20 text-center text-muted">
          등록된 앨범이 없습니다
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {albums.map((album) => (
            <Link key={album.id} href={`/music/${album.id}`} className="group">
              <div className="aspect-square overflow-hidden rounded-xl border border-border bg-surface-light transition-colors group-hover:border-primary">
                {album.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={album.cover_image}
                    alt={album.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-border">
                    <Disc3 size={48} />
                  </div>
                )}
              </div>
              <h3 className="mt-3 truncate text-base font-bold text-foreground group-hover:text-primary">
                {album.title}
              </h3>
              {album.release_date && (
                <p className="mt-0.5 text-sm text-muted">{formatDate(album.release_date)}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
