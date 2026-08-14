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
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Gallery
      </Link>

      <h1 className="mt-8 text-2xl font-bold text-foreground">
        {item.title}
      </h1>
      <p className="mt-1 text-xs text-muted">{formatDate(item.created_at)}</p>
      {item.description && (
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">
          {item.description}
        </p>
      )}

      <div className="mt-8">
        {images.length === 0 ? (
          <p className="py-20 text-center text-muted">
            등록된 이미지가 없습니다
          </p>
        ) : (
          <GalleryViewer images={images} title={item.title} />
        )}
      </div>
    </div>
  );
}
