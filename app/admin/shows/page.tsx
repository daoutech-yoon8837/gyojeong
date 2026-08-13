"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Show {
  id: string;
  title: string;
  venue: string;
  show_date: string;
  is_published: boolean;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("shows")
      .select("id, title, venue, show_date, is_published")
      .order("show_date", { ascending: false })
      .then(({ data }) => {
        setShows(data ?? []);
        setLoading(false);
      });
  }, []);

  async function togglePublished(show: Show) {
    const next = !show.is_published;
    setShows((prev) =>
      prev.map((s) => (s.id === show.id ? { ...s, is_published: next } : s))
    );
    await supabase.from("shows").update({ is_published: next }).eq("id", show.id);
  }

  async function handleDelete(id: string) {
    if (!confirm("이 공연을 삭제하시겠습니까?")) return;
    await supabase.from("shows").delete().eq("id", id);
    setShows((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <section className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">공연 관리</h1>
        <a
          href="/admin/shows/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          새 공연 등록
        </a>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : shows.length === 0 ? (
        <p className="bg-white rounded-xl border border-gray-100 py-16 text-center text-sm text-gray-400">
          등록된 공연이 없습니다.
        </p>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">공연명</th>
                  <th className="text-left px-5 py-3 font-medium">장소</th>
                  <th className="text-left px-5 py-3 font-medium">일시</th>
                  <th className="text-left px-5 py-3 font-medium">공개</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shows.map((show) => (
                  <tr key={show.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium">{show.title}</td>
                    <td className="px-5 py-3 text-gray-500">{show.venue}</td>
                    <td className="px-5 py-3 text-gray-500">
                      {formatDate(show.show_date)}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => togglePublished(show)}
                        className={`text-xs px-2 py-1 rounded-full transition-colors ${
                          show.is_published
                            ? "bg-green-50 text-green-600 hover:bg-green-100"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {show.is_published ? "공개" : "비공개"}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/admin/shows/${show.id}/edit`}
                          className="p-2 text-gray-400 hover:text-primary"
                        >
                          <Pencil size={16} />
                        </a>
                        <button
                          onClick={() => handleDelete(show.id)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {shows.map((show) => (
              <div
                key={show.id}
                className="bg-white rounded-xl border border-gray-100 p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-bold">{show.title}</p>
                  <button
                    onClick={() => togglePublished(show)}
                    className={`shrink-0 text-xs px-2 py-1 rounded-full ${
                      show.is_published
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {show.is_published ? "공개" : "비공개"}
                  </button>
                </div>
                <p className="text-sm text-gray-500">{show.venue}</p>
                <p className="text-sm text-gray-500 mb-3">
                  {formatDate(show.show_date)}
                </p>
                <div className="flex gap-2">
                  <a
                    href={`/admin/shows/${show.id}/edit`}
                    className="flex-1 text-center text-sm border border-gray-200 rounded-lg py-2 text-gray-600"
                  >
                    수정
                  </a>
                  <button
                    onClick={() => handleDelete(show.id)}
                    className="px-4 text-sm border border-gray-200 rounded-lg py-2 text-red-500"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
