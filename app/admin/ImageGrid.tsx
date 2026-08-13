"use client";

import { useRef, useState, DragEvent } from "react";
import { Upload, X, GripVertical } from "lucide-react";
import { filterImageFiles, uploadFiles } from "./upload";

export default function ImageGrid({
  images,
  setImages,
  uploading,
  setUploading,
}: {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [draggingOver, setDraggingOver] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const dragCounter = useRef(0);

  async function handleUpload(files: FileList | null) {
    const imageFiles = filterImageFiles(files);
    if (!imageFiles.length) return;
    setUploading(true);
    const urls = await uploadFiles(imageFiles);
    setImages((prev) => [...prev, ...urls]);
    setUploading(false);
  }

  function handleDropZoneDragEnter(e: DragEvent) {
    e.preventDefault();
    dragCounter.current++;
    setDraggingOver(true);
  }

  function handleDropZoneDragLeave(e: DragEvent) {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setDraggingOver(false);
  }

  function handleDropZoneDrop(e: DragEvent) {
    e.preventDefault();
    dragCounter.current = 0;
    setDraggingOver(false);
    if (dragIdx !== null) return;
    handleUpload(e.dataTransfer.files);
  }

  function handleReorderDrop(e: DragEvent, targetIdx: number) {
    e.preventDefault();
    e.stopPropagation();
    if (dragIdx === null || dragIdx === targetIdx) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
    setDragIdx(null);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-gray-400">
          {images.length > 0 && `${images.length}장 업로드됨`}
        </p>
        {images.length > 1 && (
          <p className="text-xs text-gray-400">드래그하여 순서 변경</p>
        )}
      </div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={handleDropZoneDragEnter}
        onDragLeave={handleDropZoneDragLeave}
        onDrop={handleDropZoneDrop}
        className={`grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3 p-2 rounded-lg border-2 border-dashed transition-colors ${
          draggingOver ? "border-primary bg-primary/5" : "border-transparent"
        }`}
      >
        {images.map((url, i) => (
          <div
            key={url}
            draggable
            onDragStart={(e) => {
              setDragIdx(i);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => handleReorderDrop(e, i)}
            onDragEnd={() => setDragIdx(null)}
            className={`relative aspect-square rounded-lg overflow-hidden group cursor-grab active:cursor-grabbing transition-opacity ${
              dragIdx === i ? "opacity-40" : ""
            }`}
          >
            <img src={url} alt="" className="w-full h-full object-cover" />
            <div className="absolute top-1 left-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {i + 1}
            </div>
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center">
                <GripVertical size={14} />
              </span>
              <button
                type="button"
                onClick={() =>
                  setImages((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"
        >
          <Upload size={20} />
          <span className="text-xs mt-1">{uploading ? "업로드 중..." : "추가"}</span>
        </button>
      </div>
      <p className="text-xs text-gray-400">
        이미지 파일만 업로드 가능 (JPG, PNG, GIF, WebP) — 드래그앤드롭 지원
      </p>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleUpload(e.target.files);
          e.target.value = "";
        }}
      />
    </>
  );
}
