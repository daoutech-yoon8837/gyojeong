import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getSiteSettings } from "@/lib/settings";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <Header bandName={settings.band_name} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
