"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { Star } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product._id}`}
      className="group flex flex-col bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-50">
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 group-hover:scale-[1.03] transition-transform duration-200"
        />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <p className="text-xs text-gray-400 uppercase tracking-wide">
          {product.category?.name}
        </p>

        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug flex-1">
          {product.title}
        </h3>

        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
          <Star className="w-3 h-3 fill-gray-400 text-gray-400" />
          <span>{product.ratingsAverage?.toFixed(1)}</span>
          <span className="text-gray-300">·</span>
          <span>{product.ratingsQuantity} reviews</span>
        </div>

        <div className="mt-1">
          {product.priceAfterDiscount ? (
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold text-gray-900">
                EGP {product.priceAfterDiscount.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 line-through">
                EGP {product.price.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-base font-semibold text-gray-900">
              EGP {product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
