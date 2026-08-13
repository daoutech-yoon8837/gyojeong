import AlbumForm from "../AlbumForm";

export default function NewAlbumPage() {
  return (
    <section className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">새 앨범 등록</h1>
      <div className="max-w-2xl bg-white rounded-xl border border-gray-100 p-6 md:p-8">
        <AlbumForm />
      </div>
    </section>
  );
}
