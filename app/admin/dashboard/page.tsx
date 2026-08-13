"use client";

import { useEffect, useState } from "react";
import { Calendar, Image as ImageIcon, Disc3, Users, Loader2 } from "lucide-react";
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

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    upcomingShows: 0,
    gallery: 0,
    albums: 0,
    members: 0,
  });
  const [upcoming, setUpcoming] = useState<Show[]>([]);

  useEffect(() => {
    async function load() {
      const now = new Date().toISOString();

      const [shows, gallery, albums, members, upcomingList] = await Promise.all([
        supabase
          .from("shows")
          .select("id", { count: "exact", head: true })
          .gte("show_date", now),
        supabase.from("gallery").select("id", { count: "exact", head: true }),
        supabase.from("albums").select("id", { count: "exact", head: true }),
        supabase.from("members").select("id", { count: "exact", head: true }),
        supabase
          .from("shows")
          .select("id, title, venue, show_date, is_published")
          .gte("show_date", now)
          .order("show_date", { ascending: true })
          .limit(5),
      ]);

      setCounts({
        upcomingShows: shows.count ?? 0,
        gallery: gallery.count ?? 0,
        albums: albums.count ?? 0,
        members: members.count ?? 0,
      });
      setUpcoming(upcomingList.data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    {
      label: "다가오는 공연",
      value: counts.upcomingShows,
      icon: Calendar,
      href: "/admin/shows",
    },
    {
      label: "갤러리",
      value: counts.gallery,
      icon: ImageIcon,
      href: "/admin/gallery",
    },
    { label: "앨범", value: counts.albums, icon: Disc3, href: "/admin/music" },
    { label: "멤버", value: counts.members, icon: Users, href: "/admin/members" },
  ];

  return (
    <section className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card) => (
              <a
                key={card.label}
                href={card.href}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">{card.label}</span>
                  <card.icon size={18} className="text-primary" />
                </div>
                <p className="text-3xl font-bold">{card.value}</p>
              </a>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold">다가오는 공연</h2>
              <a href="/admin/shows" className="text-sm text-primary">
                전체보기
              </a>
            </div>
            {upcoming.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-gray-400">
                예정된 공연이 없습니다.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {upcoming.map((show) => (
                  <li key={show.id}>
                    <a
                      href={`/admin/shows/${show.id}/edit`}
                      className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-medium truncate">{show.title}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {show.venue} · {formatDate(show.show_date)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-xs px-2 py-1 rounded-full ${
                          show.is_published
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {show.is_published ? "공개" : "비공개"}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  );
}
