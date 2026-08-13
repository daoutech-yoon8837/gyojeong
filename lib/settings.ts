import { createSupabaseServer } from "./supabase-server";

export interface SiteSettings {
  band_name: string;
  contact_email: string;
  instagram_url: string;
  youtube_url: string;
  soundcloud_url: string;
}

const DEFAULTS: SiteSettings = {
  band_name: "교정",
  contact_email: "",
  instagram_url: "",
  youtube_url: "",
  soundcloud_url: "",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createSupabaseServer();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();
    return data ? { ...DEFAULTS, ...data } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}
