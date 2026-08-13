"use client";

import { useRef, useState, DragEvent } from "react";
import { Upload, X } from "lucide-react";
import { filterImageFiles, uploadFiles } from "./upload";

export default function SingleImageUpload({
  image,
  setImage,
  aspect = "aspect-[3/4]",
}: {
  image: string;
  setImage: (url: string) => void;
  aspect?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [draggingOver, setDraggingOver] = useState(false);

  async function handleUpload(files: FileList | null) {
    const imageFiles = filterImageFiles(files);
    if (!imageFiles.length) return;
    setUploading(true);
    const urls = await uploadFiles([imageFiles[0]]);
    if (urls[0]) setImage(urls[0]);
    setUploading(false);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDraggingOver(false);
    handleUpload(e.dataTransfer.files);
  }

  return (
    <div>
      {image ? (
        <div className={`relative w-40 ${aspect} rounded-lg overflow-hidden group`}>
          <img src={image} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => setImage("")}
            className="absolute top-1 right-1 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDraggingOver(true);
          }}
          onDragLeave={() => setDraggingOver(false)}
          onDrop={handleDrop}
          disabled={uploading}
          className={`w-40 ${aspect} border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
            draggingOver
              ? "border-primary bg-primary/5 text-primary"
              : "border-gray-300 text-gray-400 hover:border-primary hover:text-primary"
          }`}
        >
          <Upload size={20} />
          <span className="text-xs mt-1">
            {uploading ? "업로드 중..." : "이미지 선택"}
          </span>
        </button>
      )}
      <p className="text-xs text-gray-400 mt-2">
        클릭 또는 드래그앤드롭으로 업로드
      </p>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleUpload(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
