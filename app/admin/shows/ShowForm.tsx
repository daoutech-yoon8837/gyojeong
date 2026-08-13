"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SingleImageUpload from "../SingleImageUpload";

interface ShowFormProps {
  initial?: {
    id: string;
    title: string;
    venue: string;
    address: string | null;
    show_date: string;
    description: string | null;
    poster_image: string | null;
    ticket_url: string | null;
    ticket_price: string | null;
  };
}

function toDateTimeInput(value: string) {
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

export default function ShowForm({ initial }: ShowFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [poster, setPoster] = useState(initial?.poster_image || "");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      title: form.get("title") as string,
      venue: form.get("venue") as string,
      address: (form.get("address") as string) || null,
      show_date: new Date(form.get("show_date") as string).toISOString(),
      description: (form.get("description") as string) || null,
      poster_image: poster || null,
      ticket_url: (form.get("ticket_url") as string) || null,
      ticket_price: (form.get("ticket_price") as string) || null,
    };

    if (initial) {
      await supabase.from("shows").update(data).eq("id", initial.id);
    } else {
      const { data: band } = await supabase
        .from("bands")
        .select("id")
        .limit(1)
        .single();
      await supabase.from("shows").insert({ ...data, band_id: band?.id });
    }

    router.push("/admin/shows");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          공연명 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          required
          defaultValue={initial?.title}
          placeholder="예: 교정 단독공연 〈소음의 밤〉"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            공연 장소 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="venue"
            required
            defaultValue={initial?.venue}
            placeholder="예: 홍대 롤링홀"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            공연 일시 <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="show_date"
            required
            defaultValue={
              initial ? toDateTimeInput(initial.show_date) : undefined
            }
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          주소
        </label>
        <input
          type="text"
          name="address"
          defaultValue={initial?.address ?? ""}
          placeholder="예: 서울 마포구 어울마당로 35"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          공연 소개
        </label>
        <textarea
          name="description"
          rows={5}
          defaultValue={initial?.description ?? ""}
          placeholder="공연 라인업, 관람 안내 등을 적어주세요"
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            티켓 링크
          </label>
          <input
            type="url"
            name="ticket_url"
            defaultValue={initial?.ticket_url ?? ""}
            placeholder="https://"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            티켓 가격
          </label>
          <input
            type="text"
            name="ticket_price"
            defaultValue={initial?.ticket_price ?? ""}
            placeholder="예: 25,000원"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          공연 포스터
        </label>
        <SingleImageUpload image={poster} setImage={setPoster} />
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
          href="/admin/shows"
          className="px-6 py-3 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors text-center"
        >
          취소
        </a>
      </div>
    </form>
  );
}
