import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase-server";
import { formatDate } from "@/lib/format";
import GalleryViewer from "./GalleryViewer";

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const { data: item } = await supabase
    .from("gallery")
    .select("id, title, description, images, created_at")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (!item) notFound();

  const images: string[] = item.images ?? [];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <Link
        href="/gallery"
        className="inline-flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} />
        갤러리 목록
      </Link>

      <h1 className="mt-8 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
        {item.title}
      </h1>
      <p className="mt-2 text-sm text-muted">{formatDate(item.created_at)}</p>
      {item.description && (
        <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted">
          {item.description}
        </p>
      )}

      <div className="mt-8">
        {images.length === 0 ? (
          <p className="rounded-xl border border-border bg-surface px-6 py-20 text-center text-muted">
            등록된 이미지가 없습니다
          </p>
        ) : (
          <GalleryViewer images={images} title={item.title} />
        )}
      </div>
    </div>
  );
}
