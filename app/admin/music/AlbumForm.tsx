"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import SingleImageUpload from "../SingleImageUpload";

interface AlbumFormProps {
  initial?: {
    id: string;
    title: string;
    release_date: string | null;
    cover_image: string | null;
    description: string | null;
    streaming_links: { spotify?: string; apple_music?: string; youtube_music?: string } | null;
    tracks: { title: string; duration: string | null }[];
  };
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

export default function AlbumForm({ initial }: AlbumFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cover, setCover] = useState(initial?.cover_image || "");
  const [tracks, setTracks] = useState<{ title: string; duration: string }[]>(
    initial?.tracks.map((t) => ({ title: t.title, duration: t.duration ?? "" })) || [
      { title: "", duration: "" },
    ]
  );

  function updateTrack(idx: number, field: "title" | "duration", value: string) {
    setTracks((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, [field]: value } : t))
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      title: form.get("title") as string,
      release_date: (form.get("release_date") as string) || null,
      description: (form.get("description") as string) || null,
      cover_image: cover || null,
      streaming_links: {
        spotify: (form.get("spotify") as string) || "",
        apple_music: (form.get("apple_music") as string) || "",
        youtube_music: (form.get("youtube_music") as string) || "",
      },
    };

    const validTracks = tracks.filter((t) => t.title.trim());

    let albumId = initial?.id;

    if (initial) {
      await supabase.from("albums").update(data).eq("id", initial.id);
      await supabase.from("tracks").delete().eq("album_id", initial.id);
    } else {
      const { data: band } = await supabase
        .from("bands")
        .select("id")
        .limit(1)
        .single();
      const { data: inserted } = await supabase
        .from("albums")
        .insert({ ...data, band_id: band?.id })
        .select("id")
        .single();
      albumId = inserted?.id;
    }

    if (albumId && validTracks.length) {
      await supabase.from("tracks").insert(
        validTracks.map((t, i) => ({
          album_id: albumId,
          title: t.title.trim(),
          track_number: i + 1,
          duration: t.duration.trim() || null,
        }))
      );
    }

    router.push("/admin/music");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          앨범명 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          required
          defaultValue={initial?.title}
          placeholder="예: 첫 번째 EP 〈교정〉"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          발매일
        </label>
        <input
          type="date"
          name="release_date"
          defaultValue={initial?.release_date ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          앨범 소개
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initial?.description ?? ""}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          앨범 커버
        </label>
        <SingleImageUpload image={cover} setImage={setCover} aspect="aspect-square" />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          스트리밍 링크
        </label>
        <input
          type="url"
          name="spotify"
          defaultValue={initial?.streaming_links?.spotify ?? ""}
          placeholder="Spotify URL"
          className={inputClass}
        />
        <input
          type="url"
          name="apple_music"
          defaultValue={initial?.streaming_links?.apple_music ?? ""}
          placeholder="Apple Music URL"
          className={inputClass}
        />
        <input
          type="url"
          name="youtube_music"
          defaultValue={initial?.streaming_links?.youtube_music ?? ""}
          placeholder="YouTube Music URL"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          수록곡
        </label>
        <div className="space-y-2">
          {tracks.map((track, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-8 shrink-0 text-sm text-gray-400 text-center">
                {i + 1}
              </span>
              <input
                type="text"
                value={track.title}
                onChange={(e) => updateTrack(i, "title", e.target.value)}
                placeholder="곡 제목"
                className={inputClass}
              />
              <input
                type="text"
                value={track.duration}
                onChange={(e) => updateTrack(i, "duration", e.target.value)}
                placeholder="3:42"
                className="w-24 shrink-0 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setTracks((prev) => prev.filter((_, idx) => idx !== i))}
                className="shrink-0 p-2 text-gray-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setTracks((prev) => [...prev, { title: "", duration: "" }])}
          className="mt-3 flex items-center gap-1 text-sm text-primary font-medium"
        >
          <Plus size={14} />
          트랙 추가
        </button>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "저장 중..." : initial ? "수정 완료" : "등록하기"}
        </button>
        <a
          href="/admin/music"
          className="px-6 py-3 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors text-center"
        >
          취소
        </a>
      </div>
    </form>
  );
}
