"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryViewer({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);

  const go = (delta: number) => setIndex((prev) => (prev + delta + images.length) % images.length);

  return (
    <div>
      <div className="relative overflow-hidden bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={`${title} ${index + 1}`}
          className="mx-auto max-h-[70vh] w-full object-contain"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="이전 이미지"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-foreground backdrop-blur-sm hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="다음 이미지"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-foreground backdrop-blur-sm hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-3 right-3 text-xs text-muted">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-6 md:grid-cols-8">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}번째 이미지 보기`}
              className={`aspect-square overflow-hidden transition-opacity ${
                i === index ? "opacity-100" : "opacity-40 hover:opacity-70"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${title} 썸네일 ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
