"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, ImageOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface GalleryItem {
  id: string;
  title: string;
  images: string[];
  is_published: boolean;
  created_at: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("gallery")
      .select("id, title, images, is_published, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, []);

  async function togglePublished(item: GalleryItem) {
    const next = !item.is_published;
    setItems((prev) =>
      prev.map((g) => (g.id === item.id ? { ...g, is_published: next } : g))
    );
    await supabase.from("gallery").update({ is_published: next }).eq("id", item.id);
  }

  async function handleDelete(id: string) {
    if (!confirm("이 갤러리를 삭제하시겠습니까?")) return;
    await supabase.from("gallery").delete().eq("id", id);
    setItems((prev) => prev.filter((g) => g.id !== id));
  }

  return (
    <section className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">갤러리 관리</h1>
        <a
          href="/admin/gallery/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          새 갤러리 등록
        </a>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : items.length === 0 ? (
        <p className="bg-white rounded-xl border border-gray-100 py-16 text-center text-sm text-gray-400">
          등록된 갤러리가 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <a
                href={`/admin/gallery/${item.id}/edit`}
                className="block aspect-[4/3] bg-gray-100"
              >
                {item.images?.[0] ? (
                  <img
                    src={item.images[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageOff size={28} />
                  </div>
                )}
              </a>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-bold truncate">{item.title}</p>
                  <button
                    onClick={() => togglePublished(item)}
                    className={`shrink-0 text-xs px-2 py-1 rounded-full transition-colors ${
                      item.is_published
                        ? "bg-green-50 text-green-600 hover:bg-green-100"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {item.is_published ? "공개" : "비공개"}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  사진 {item.images?.length ?? 0}장
                </p>
                <div className="flex gap-2">
                  <a
                    href={`/admin/gallery/${item.id}/edit`}
                    className="flex-1 text-center text-sm border border-gray-200 rounded-lg py-2 text-gray-600 hover:bg-gray-50"
                  >
                    수정
                  </a>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 text-sm border border-gray-200 rounded-lg py-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
