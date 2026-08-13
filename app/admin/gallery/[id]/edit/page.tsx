import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import GalleryForm from "../../GalleryForm";

export default async function EditGalleryPage(
  props: PageProps<"/admin/gallery/[id]/edit">
) {
  const { id } = await props.params;
  const supabase = await createSupabaseServer();

  const { data: item } = await supabase
    .from("gallery")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) notFound();

  return (
    <section className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">갤러리 수정</h1>
      <div className="max-w-2xl bg-white rounded-xl border border-gray-100 p-6 md:p-8">
        <GalleryForm initial={item} />
      </div>
    </section>
  );
}
