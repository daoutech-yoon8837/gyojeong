import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "갤러리",
  description: "밴드 교정의 공연 사진 갤러리",
};

export default async function GalleryPage() {
  const supabase = await createSupabaseServer();

  const { data } = await supabase
    .from("gallery")
    .select("id, title, description, images")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const items = data ?? [];

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="text-xs font-medium tracking-[0.2em] text-muted uppercase">Gallery</h1>

      {items.length === 0 ? (
        <p className="mt-10 py-20 text-center text-muted">
          등록된 갤러리가 없습니다
        </p>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/gallery/${item.id}`}
              className="group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                {item.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted">
                    {item.title}
                  </div>
                )}
                {item.images?.length > 1 && (
                  <span className="absolute right-3 top-3 text-xs text-white/80">
                    +{item.images.length - 1}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <h3 className="text-sm font-medium text-foreground">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted">{item.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
