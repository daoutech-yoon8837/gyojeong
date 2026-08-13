import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import AlbumForm from "../../AlbumForm";

export default async function EditAlbumPage(
  props: PageProps<"/admin/music/[id]/edit">
) {
  const { id } = await props.params;
  const supabase = await createSupabaseServer();

  const { data: album } = await supabase
    .from("albums")
    .select("*, tracks(title, duration, track_number)")
    .eq("id", id)
    .single();

  if (!album) notFound();

  const tracks = [...(album.tracks ?? [])].sort(
    (a, b) => a.track_number - b.track_number
  );

  return (
    <section className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">앨범 수정</h1>
      <div className="max-w-2xl bg-white rounded-xl border border-gray-100 p-6 md:p-8">
        <AlbumForm initial={{ ...album, tracks }} />
      </div>
    </section>
  );
}
