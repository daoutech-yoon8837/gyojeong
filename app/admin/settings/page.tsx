"use client";

import { useEffect, useState, FormEvent } from "react";
import { Loader2, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

const FIELDS = [
  { name: "band_name", label: "밴드명", type: "text", placeholder: "교정" },
  {
    name: "contact_email",
    label: "연락 이메일",
    type: "email",
    placeholder: "booking@example.com",
  },
  {
    name: "instagram_url",
    label: "인스타그램 링크",
    type: "url",
    placeholder: "https://instagram.com/",
  },
  {
    name: "youtube_url",
    label: "유튜브 링크",
    type: "url",
    placeholder: "https://youtube.com/",
  },
  {
    name: "soundcloud_url",
    label: "사운드클라우드 링크",
    type: "url",
    placeholder: "https://soundcloud.com/",
  },
] as const;

type Settings = Record<(typeof FIELDS)[number]["name"], string>;

const EMPTY: Settings = {
  band_name: "",
  contact_email: "",
  instagram_url: "",
  youtube_url: "",
  soundcloud_url: "",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) setSettings({ ...EMPTY, ...data });
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("site_settings").update(settings).eq("id", 1);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <section className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">사이트 설정</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-xl bg-white rounded-xl border border-gray-100 p-6 md:p-8 space-y-5"
        >
          {FIELDS.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                value={settings[field.name]}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, [field.name]: e.target.value }))
                }
                placeholder={field.placeholder}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          ))}

          <p className="text-xs text-gray-400">
            SNS 링크를 비워두면 공개 페이지에서 해당 버튼이 숨겨집니다.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </form>
      )}

      {saved && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-lg">
          <Check size={16} className="text-green-400" />
          저장 완료
        </div>
      )}
    </section>
  );
}
