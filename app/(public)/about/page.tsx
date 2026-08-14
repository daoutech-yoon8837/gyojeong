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
    <div className="mx-auto max-w-4xl px-5 py-16">
      <section className="grid gap-10 md:grid-cols-[280px_1fr]">
        <div className="aspect-square overflow-hidden bg-surface">
          {band?.profile_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={band.profile_image}
              alt={band.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface text-4xl font-bold text-muted/30">
              {band?.name ?? "교정"}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-foreground">{band?.name ?? "교정"}</h1>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted">
            {band?.genre && <span>{band.genre}</span>}
            {band?.formed_year && <span>{band.formed_year}년 결성</span>}
          </div>
          <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-muted">
            {band?.description ?? "밴드 소개가 준비 중입니다."}
          </p>
        </div>
      </section>

      {members.length > 0 && (
        <section className="mt-20 border-t border-border pt-16">
          <h2 className="text-xs font-medium tracking-[0.2em] text-muted uppercase">Members</h2>

          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <div key={member.id}>
                <div className="aspect-[4/5] overflow-hidden bg-surface">
                  {member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted/30">
                      <User size={48} />
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="text-base font-medium text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted">{member.role}</p>
                  {member.bio && (
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
