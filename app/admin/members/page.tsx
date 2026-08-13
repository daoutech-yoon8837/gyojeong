"use client";

import { useEffect, useState, DragEvent } from "react";
import { Plus, Trash2, Loader2, GripVertical, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabase";
import SingleImageUpload from "../SingleImageUpload";

interface Member {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo: string | null;
  sort_order: number;
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

interface Draft {
  name: string;
  role: string;
  bio: string;
  photo: string;
}

function MemberFields({
  draft,
  setDraft,
}: {
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            placeholder="예: 김교정"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            포지션 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={draft.role}
            onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
            placeholder="예: 보컬 / 기타"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          소개
        </label>
        <textarea
          value={draft.bio}
          onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          사진
        </label>
        <SingleImageUpload
          image={draft.photo}
          setImage={(url) => setDraft((d) => ({ ...d, photo: url }))}
        />
      </div>
    </div>
  );
}

const EMPTY_DRAFT: Draft = { name: "", role: "", bio: "", photo: "" };

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("members")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setMembers(data ?? []);
        setLoading(false);
      });
  }, []);

  function startAdd() {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setAdding(true);
  }

  function startEdit(member: Member) {
    setAdding(false);
    setEditingId(member.id);
    setDraft({
      name: member.name,
      role: member.role,
      bio: member.bio ?? "",
      photo: member.photo ?? "",
    });
  }

  function cancel() {
    setAdding(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  }

  async function handleSave() {
    if (!draft.name.trim() || !draft.role.trim()) {
      alert("이름과 포지션을 입력해주세요.");
      return;
    }
    setSaving(true);

    const payload = {
      name: draft.name.trim(),
      role: draft.role.trim(),
      bio: draft.bio.trim() || null,
      photo: draft.photo || null,
    };

    if (editingId) {
      await supabase.from("members").update(payload).eq("id", editingId);
      setMembers((prev) =>
        prev.map((m) => (m.id === editingId ? { ...m, ...payload } : m))
      );
    } else {
      const { data: band } = await supabase
        .from("bands")
        .select("id")
        .limit(1)
        .single();
      const { data: inserted } = await supabase
        .from("members")
        .insert({
          ...payload,
          band_id: band?.id,
          sort_order: members.length,
        })
        .select("*")
        .single();
      if (inserted) setMembers((prev) => [...prev, inserted]);
    }

    setSaving(false);
    cancel();
  }

  async function handleDelete(id: string) {
    if (!confirm("이 멤버를 삭제하시겠습니까?")) return;
    await supabase.from("members").delete().eq("id", id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (editingId === id) cancel();
  }

  async function handleReorderDrop(e: DragEvent, targetIdx: number) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === targetIdx) return;

    const next = [...members];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, moved);
    setMembers(next);
    setDragIdx(null);

    await Promise.all(
      next.map((m, i) =>
        supabase.from("members").update({ sort_order: i }).eq("id", m.id)
      )
    );
  }

  return (
    <section className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">멤버 관리</h1>
        {!adding && (
          <button
            onClick={startAdd}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={16} />
            멤버 추가
          </button>
        )}
      </div>

      {adding && (
        <div className="max-w-2xl bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold mb-4">새 멤버</h2>
          <MemberFields draft={draft} setDraft={setDraft} />
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? "저장 중..." : "등록하기"}
            </button>
            <button
              onClick={cancel}
              className="px-6 py-3 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : members.length === 0 ? (
        <p className="bg-white rounded-xl border border-gray-100 py-16 text-center text-sm text-gray-400">
          등록된 멤버가 없습니다.
        </p>
      ) : (
        <>
          {members.length > 1 && (
            <p className="text-xs text-gray-400 mb-2">
              드래그하여 순서 변경 (공개 페이지 표시 순서)
            </p>
          )}
          <div className="max-w-2xl space-y-3">
            {members.map((member, i) =>
              editingId === member.id ? (
                <div
                  key={member.id}
                  className="bg-white rounded-xl border border-primary/40 p-6"
                >
                  <h2 className="font-bold mb-4">멤버 수정</h2>
                  <MemberFields draft={draft} setDraft={setDraft} />
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? "저장 중..." : "수정 완료"}
                    </button>
                    <button
                      onClick={cancel}
                      className="px-6 py-3 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={member.id}
                  draggable
                  onDragStart={(e) => {
                    setDragIdx(i);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleReorderDrop(e, i)}
                  onDragEnd={() => setDragIdx(null)}
                  className={`flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4 transition-opacity ${
                    dragIdx === i ? "opacity-40" : ""
                  }`}
                >
                  <GripVertical
                    size={16}
                    className="shrink-0 text-gray-300 cursor-grab active:cursor-grabbing"
                  />
                  <div className="w-14 h-14 shrink-0 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserRound size={20} className="text-gray-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{member.name}</p>
                    <p className="text-sm text-primary">{member.role}</p>
                    {member.bio && (
                      <p className="text-sm text-gray-500 truncate">{member.bio}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => startEdit(member)}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </>
      )}
    </section>
  );
}
