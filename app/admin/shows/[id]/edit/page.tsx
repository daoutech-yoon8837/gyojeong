import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import ShowForm from "../../ShowForm";

export default async function EditShowPage(
  props: PageProps<"/admin/shows/[id]/edit">
) {
  const { id } = await props.params;
  const supabase = await createSupabaseServer();

  const { data: show } = await supabase
    .from("shows")
    .select("*")
    .eq("id", id)
    .single();

  if (!show) notFound();

  return (
    <section className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">공연 수정</h1>
      <div className="max-w-2xl bg-white rounded-xl border border-gray-100 p-6 md:p-8">
        <ShowForm initial={show} />
      </div>
    </section>
  );
}
