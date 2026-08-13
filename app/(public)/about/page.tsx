import type { Metadata } from "next";
import { User } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "소개",
  description: "밴드 교정 소개 및 멤버 정보",
};

export default async function AboutPage() {
  const supabase = await createSupabaseServer();

  const [bandRes, membersRes] = await Promise.all([
    supabase
      .from("bands")
      .select("name, description, genre, formed_year, profile_image")
      .limit(1)
      .maybeSingle(),
    supabase
      .from("members")
      .select("id, name, role, bio, photo")
      .order("sort_order", { ascending: true }),
  ]);

  const band = bandRes.data;
  const members = membersRes.data ?? [];

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">소개</h1>

      <section className="mt-10 grid gap-8 md:grid-cols-[280px_1fr]">
        <div className="aspect-square overflow-hidden rounded-xl border border-border bg-surface">
          {band?.profile_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={band.profile_image}
              alt={band.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-light to-black text-5xl font-black text-border">
              {band?.name ?? "교정"}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-3xl font-black text-foreground">{band?.name ?? "교정"}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {band?.genre && (
              <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                {band.genre}
              </span>
            )}
            {band?.formed_year && (
              <span className="rounded-full bg-surface-light px-3 py-1 text-xs font-bold text-muted">
                {band.formed_year}년 결성
              </span>
            )}
          </div>
          <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-muted">
            {band?.description ?? "밴드 소개가 준비 중입니다."}
          </p>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-3xl font-black tracking-tight text-foreground">멤버</h2>

        {members.length === 0 ? (
          <p className="mt-8 rounded-xl border border-border bg-surface px-6 py-16 text-center text-muted">
            등록된 멤버가 없습니다
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="overflow-hidden rounded-xl border border-border bg-surface"
              >
                <div className="aspect-[4/5] bg-surface-light">
                  {member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-border">
                      <User size={56} />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold tracking-widest text-accent">{member.role}</p>
                  <h3 className="mt-1 text-xl font-bold text-foreground">{member.name}</h3>
                  {member.bio && (
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
