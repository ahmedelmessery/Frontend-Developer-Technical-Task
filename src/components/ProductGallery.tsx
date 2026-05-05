"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  cover: string;
  images: string[];
  title: string;
}

export default function ProductGallery({ cover, images, title }: ProductGalleryProps) {
  // All available images: cover first, then the rest
  const all = [cover, ...images.filter((img) => img !== cover)];
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Main image */}
      <div className="relative h-72 md:h-96 bg-gray-50 rounded-lg overflow-hidden">
        <Image
          src={all[selected]}
          alt={`${title} — image ${selected + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-6 transition-opacity duration-200"
          priority={selected === 0}
        />
      </div>

      {/* Thumbnails — only show if there are multiple images */}
      {all.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {all.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative w-16 h-16 flex-shrink-0 rounded-lg border-2 bg-gray-50 overflow-hidden transition cursor-pointer ${
                selected === i
                  ? "border-gray-900"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
