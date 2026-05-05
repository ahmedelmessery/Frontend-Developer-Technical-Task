import { getProduct, getProducts } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p._id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    return { title: `${product.title} — ShopNext` };
  } catch {
    return { title: "Product — ShopNext" };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  let product;
  try {
    product = await getProduct(id);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Image */}
          <div className="relative h-72 md:h-auto min-h-72 bg-gray-50">
            <Image
              src={product.imageCover}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-8"
              priority
            />
          </div>

          {/* Details */}
          <div className="p-8 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-gray-100">

            {/* Category */}
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              {product.category?.name}
            </p>

            {/* Title */}
            <h1 className="text-xl font-semibold text-gray-900 leading-snug">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <Star className="w-4 h-4 fill-gray-400 text-gray-400" />
              <span>{product.ratingsAverage?.toFixed(1)}</span>
              <span>·</span>
              <span>{product.ratingsQuantity} reviews</span>
            </div>

            {/* Price */}
            <div>
              {product.priceAfterDiscount ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    EGP {product.priceAfterDiscount.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    EGP {product.price.toLocaleString()}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  EGP {product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Brand */}
            {product.brand && (
              <p className="text-sm text-gray-500">
                Brand: <span className="text-gray-700 font-medium">{product.brand.name}</span>
              </p>
            )}

            {/* Stock */}
            <p className="text-sm">
              {product.quantity > 0 ? (
                <span className="text-green-600">In stock ({product.quantity})</span>
              ) : (
                <span className="text-red-400">Out of stock</span>
              )}
            </p>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
              {product.description}
            </p>

            {/* CTA */}
            <button
              disabled={product.quantity === 0}
              className="mt-auto w-full py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Extra images */}
        {product.images?.length > 0 && (
          <div className="p-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">More images</p>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 flex-shrink-0 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${i + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
