// ─────────────────────────────────────────────────────────────────────────────
// src/components/ProductCard.tsx
// Reusable product card. Used on Home (featured grid) and Shop (product grid).
// Supports image hover swap, New/Sale badges, wishlist heart.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, JSX, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps): JSX.Element {
  const [hovered, setHovered] = useState(false);
  const [wished, setWished] = useState(false);

  const mainImage = product.images[0] ?? '/placeholder.jpg';
  const hoverImage = product.images[1] ?? mainImage;
  const isOutOfStock = product.stock === 0;

  return (
    <Link
      to={`/product/${product.slug}`}
      className={cn('group block', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image container ── */}
      <div className="relative overflow-hidden bg-neutral-100 aspect-[3/4]">

        {/* Product image with hover swap */}
        <img
          src={hovered ? hoverImage : mainImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
        />

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-[10px] font-bold tracking-widest uppercase text-black">
              Sold Out
            </span>
          </div>
        )}

        {/* ── Badges (top left) ── */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.is_new && (
            <Badge className="bg-white text-black rounded-none text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
              New
            </Badge>
          )}
          {product.is_sale && (
            <Badge className="bg-black text-white rounded-none text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
              Sale
            </Badge>
          )}
        </div>

        {/* ── Wishlist (top right, appears on hover) ── */}
        <button
          onClick={(e: MouseEvent) => {
            e.preventDefault(); // Don't navigate to product
            setWished(prev => !prev);
          }}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Heart
            size={13}
            className={cn(
              'transition-colors',
              wished ? 'fill-black text-black' : 'text-neutral-500'
            )}
          />
        </button>

        {/* ── Quick view bar (slides up on hover) ── */}
        <div
          aria-hidden
          className="absolute bottom-0 inset-x-0 bg-black/90 text-white text-center py-2.5 text-[9px] font-bold tracking-[0.25em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          Quick View
        </div>
      </div>

      {/* ── Product info ── */}
      <div className="mt-3">
        <p className="text-[10px] text-neutral-400 tracking-widest uppercase mb-0.5">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold tracking-wide text-black truncate">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-black">
            {formatPrice(product.price)}
          </span>
          {product.compare_price && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}