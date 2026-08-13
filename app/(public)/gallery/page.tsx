import type { Metadata } from "next";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
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
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">갤러리</h1>

      {items.length === 0 ? (
        <p className="mt-10 rounded-xl border border-border bg-surface px-6 py-20 text-center text-muted">
          등록된 갤러리가 없습니다
        </p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/gallery/${item.id}`}
              className="group overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-primary"
            >
              <div className="relative aspect-[4/3] bg-surface-light">
                {item.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-border">
                    <ImageIcon size={40} />
                  </div>
                )}
                {item.images?.length > 0 && (
                  <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold text-white">
                    {item.images.length}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted">{item.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
