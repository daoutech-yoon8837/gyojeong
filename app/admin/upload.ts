import { supabase } from "@/lib/supabase";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/heic",
  "image/heif",
];

const MAX_WIDTH = 1920;
const QUALITY = 0.8;

function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob!), "image/webp", QUALITY);
    };
    img.src = URL.createObjectURL(file);
  });
}

export function filterImageFiles(files: FileList | null): File[] {
  if (!files) return [];
  return Array.from(files).filter(
    (f) => f.type.startsWith("image/") || ALLOWED_TYPES.includes(f.type)
  );
}

export async function uploadFiles(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const compressed = await compressImage(file);
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
    const { error } = await supabase.storage
      .from("band-images")
      .upload(path, compressed, { contentType: "image/webp" });
    if (!error) {
      const { data } = supabase.storage.from("band-images").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
  }
  return urls;
}
