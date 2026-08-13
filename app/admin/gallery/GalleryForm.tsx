"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ImageGrid from "../ImageGrid";

interface GalleryFormProps {
  initial?: {
    id: string;
    title: string;
    description: string | null;
    images: string[];
  };
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

export default function GalleryForm({ initial }: GalleryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(initial?.images || []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      title: form.get("title") as string,
      description: (form.get("description") as string) || null,
      images,
    };

    if (initial) {
      await supabase.from("gallery").update(data).eq("id", initial.id);
    } else {
      const { data: band } = await supabase
        .from("bands")
        .select("id")
        .limit(1)
        .single();
      await supabase.from("gallery").insert({ ...data, band_id: band?.id });
    }

    router.push("/admin/gallery");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          required
          defaultValue={initial?.title}
          placeholder="예: 2026 롤링홀 단독공연 현장"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          설명
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initial?.description ?? ""}
          placeholder="공연 날짜, 장소 등을 적어주세요"
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          사진
        </label>
        <ImageGrid
          images={images}
          setImages={setImages}
          uploading={uploading}
          setUploading={setUploading}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "저장 중..." : initial ? "수정 완료" : "등록하기"}
        </button>
        <a
          href="/admin/gallery"
          className="px-6 py-3 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors text-center"
        >
          취소
        </a>
      </div>
    </form>
  );
}
