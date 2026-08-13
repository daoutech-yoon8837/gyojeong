"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Disc3 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Album {
  id: string;
  title: string;
  release_date: string | null;
  cover_image: string | null;
  tracks: { id: string }[];
}

export default function AdminMusicPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("albums")
      .select("id, title, release_date, cover_image, tracks(id)")
      .order("release_date", { ascending: false })
      .then(({ data }) => {
        setAlbums((data as Album[]) ?? []);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("이 앨범을 삭제하시겠습니까? 수록곡도 함께 삭제됩니다.")) return;
    await supabase.from("albums").delete().eq("id", id);
    setAlbums((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <section className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">음악 관리</h1>
        <a
          href="/admin/music/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          새 앨범 등록
        </a>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : albums.length === 0 ? (
        <p className="bg-white rounded-xl border border-gray-100 py-16 text-center text-sm text-gray-400">
          등록된 앨범이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <a
                href={`/admin/music/${album.id}/edit`}
                className="block aspect-square bg-gray-100"
              >
                {album.cover_image ? (
                  <img
                    src={album.cover_image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Disc3 size={32} />
                  </div>
                )}
              </a>
              <div className="p-4">
                <p className="font-bold truncate">{album.title}</p>
                <p className="text-sm text-gray-500 mb-3">
                  {album.release_date ?? "발매일 미정"} · {album.tracks?.length ?? 0}곡
                </p>
                <div className="flex gap-2">
                  <a
                    href={`/admin/music/${album.id}/edit`}
                    className="flex-1 text-center text-sm border border-gray-200 rounded-lg py-2 text-gray-600 hover:bg-gray-50"
                  >
                    수정
                  </a>
                  <button
                    onClick={() => handleDelete(album.id)}
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
