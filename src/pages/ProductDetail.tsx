// src/pages/ProductDetail.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Full product detail page. Fetches by slug from the URL param.
// Wired to the existing AppContext for cart and Supabase service layer.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, JSX } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Minus, Plus, ShoppingBag, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProductBySlug, fetchProducts } from "@/services/productServices";
import { useApp } from "@/context/AppContext";
import type { Product } from "@/types";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatPrice(pence: number): string {
  return `$${(pence / 100).toFixed(2)}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

/** Breadcrumb trail: Home → Shop → Category → Product */
function Breadcrumb({ category, name }: { category: string | null; name: string }) {
  return (
    <nav className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-neutral-400 mb-8">
      <Link to="/" className="hover:text-black transition-colors">Home</Link>
      <ChevronRight size={10} />
      <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
      {category && (
        <>
          <ChevronRight size={10} />
          <Link
            to={`/shop?category=${category}`}
            className="hover:text-black transition-colors capitalize"
          >
            {category}
          </Link>
        </>
      )}
      <ChevronRight size={10} />
      <span className="text-black truncate max-w-[160px]">{name}</span>
    </nav>
  );
}

/** Image gallery — main image + thumbnail row */
function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  // Reset when product changes
  useEffect(() => setActive(0), [images]);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="aspect-[3/4] bg-neutral-50 overflow-hidden">
        <img
          key={active}
          src={images[active]}
          alt={name}
          className="w-full h-full object-cover animate-fadeIn"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800";
          }}
        />
      </div>

      {/* Thumbnails — only show if multiple images */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-16 aspect-square bg-neutral-50 overflow-hidden border-2 transition-colors ${
                active === i ? "border-black" : "border-transparent hover:border-neutral-300"
              }`}
            >
              <img src={src} alt={`${name} view ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Size selector grid */
function SizeSelector({
  sizes,
  selected,
  onSelect,
  stock,
}: {
  sizes: string[];
  selected: string | null;
  onSelect: (size: string) => void;
  stock: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold tracking-widest uppercase">Select Size</span>
        <button className="text-[11px] tracking-widest uppercase text-neutral-400 underline underline-offset-2 hover:text-black transition-colors">
          Size Guide
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const outOfStock = stock === 0;
          return (
            <button
              key={size}
              disabled={outOfStock}
              onClick={() => onSelect(size)}
              className={`
                h-10 min-w-[44px] px-3 border text-xs font-medium tracking-wider uppercase transition-all
                ${outOfStock
                  ? "border-neutral-200 text-neutral-300 cursor-not-allowed line-through"
                  : selected === size
                  ? "border-black bg-black text-white"
                  : "border-neutral-300 text-black hover:border-black"
                }
              `}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Quantity stepper */
function QuantityStepper({
  quantity,
  onChange,
  max,
}: {
  quantity: number;
  onChange: (q: number) => void;
  max: number;
}) {
  return (
    <div className="flex items-center border border-neutral-300 w-fit">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="w-10 h-10 flex items-center justify-center hover:bg-neutral-50 transition-colors disabled:opacity-30"
        disabled={quantity <= 1}
      >
        <Minus size={13} />
      </button>
      <span className="w-10 h-10 flex items-center justify-center text-sm font-medium border-x border-neutral-300">
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className="w-10 h-10 flex items-center justify-center hover:bg-neutral-50 transition-colors disabled:opacity-30"
        disabled={quantity >= max}
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

/** Related products row */
function RelatedProducts({ currentId, category }: { currentId: string; category: string | null }) {
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    if (!category) return;
    fetchProducts({ category }).then(({ data }) => {
      if (data) {
        setRelated(data.filter((p) => p.id !== currentId).slice(0, 4));
      }
    });
  }, [currentId, category]);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-neutral-100 pt-16 mt-16">
      <h2 className="text-xs font-bold tracking-[0.25em] uppercase mb-8">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.slug ?? product.id}`}
            className="group block"
          >
            <div className="aspect-[3/4] bg-neutral-50 overflow-hidden mb-3">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800";
                }}
              />
            </div>
            <p className="text-xs font-medium tracking-wide truncate">{product.name}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{formatPrice(product.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────────
export default function ProductDetail(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  // ── Fetch product ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    setSelectedSize(null);
    setQuantity(1);

    fetchProductBySlug(slug).then(({ data, error }) => {
      if (error || !data) {
        setError("Product not found.");
      } else {
        setProduct(data);
        // Auto-select size if only one option
        if (data.sizes.length === 1) setSelectedSize(data.sizes[0]);
      }
      setLoading(false);
    });
  }, [slug]);

  // ── Add to cart ─────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }

    addToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // ── Loading state ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white px-6 md:px-10 py-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="h-4 w-48 bg-neutral-100 animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-neutral-100 animate-pulse" />
            <div className="space-y-4 pt-4">
              <div className="h-8 w-3/4 bg-neutral-100 animate-pulse" />
              <div className="h-5 w-1/4 bg-neutral-100 animate-pulse" />
              <div className="h-24 w-full bg-neutral-100 animate-pulse mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error / not found state ─────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-neutral-500">Product not found.</p>
        <Button
          variant="outline"
          className="rounded-none border-black text-xs tracking-widest uppercase"
          onClick={() => navigate("/shop")}
        >
          Back to Shop
        </Button>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const onSale = product.is_sale && product.compare_price !== null;

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-10">

        {/* Breadcrumb */}
        <Breadcrumb category={product.category} name={product.name} />

        {/* Back button — mobile */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-neutral-400 hover:text-black transition-colors mb-6 md:hidden"
        >
          <ArrowLeft size={12} />
          Back
        </button>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">

          {/* ── Left: Images ── */}
          <ImageGallery images={product.images} name={product.name} />

          {/* ── Right: Product info ── */}
          <div className="flex flex-col gap-6 md:pt-4">

            {/* Badges */}
            <div className="flex gap-2">
              {product.is_new && (
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase bg-black text-white px-2 py-1">
                  New
                </span>
              )}
              {onSale && (
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase bg-red-600 text-white px-2 py-1">
                  Sale
                </span>
              )}
              {isOutOfStock && (
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase bg-neutral-200 text-neutral-500 px-2 py-1">
                  Sold Out
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="font-bebas text-4xl md:text-5xl leading-none tracking-wide">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className={`text-xl font-semibold ${onSale ? "text-red-600" : "text-black"}`}>
                {formatPrice(product.price)}
              </span>
              {onSale && product.compare_price && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatPrice(product.compare_price)}
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-100" />

            {/* Description */}
            {product.description && (
              <p className="text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Size selector */}
            {product.sizes.length > 0 && (
              <div>
                <SizeSelector
                  sizes={product.sizes}
                  selected={selectedSize}
                  onSelect={(s) => {
                    setSelectedSize(s);
                    setSizeError(false);
                  }}
                  stock={product.stock}
                />
                {sizeError && (
                  <p className="text-red-500 text-xs mt-2 tracking-wide">
                    Please select a size before adding to cart.
                  </p>
                )}
              </div>
            )}

            {/* Quantity + Add to cart */}
            {!isOutOfStock && (
              <div className="flex gap-3 items-center">
                <QuantityStepper
                  quantity={quantity}
                  onChange={setQuantity}
                  max={product.stock}
                />
                <Button
                  onClick={handleAddToCart}
                  className={`flex-1 h-10 rounded-none text-xs font-bold tracking-widest uppercase transition-all ${
                    added
                      ? "bg-green-600 hover:bg-green-600"
                      : "bg-black hover:bg-neutral-800"
                  }`}
                >
                  {added ? (
                    <span className="flex items-center gap-2">
                      <Check size={14} /> Added to Cart
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShoppingBag size={14} /> Add to Cart
                    </span>
                  )}
                </Button>
              </div>
            )}

            {/* Sold out CTA */}
            {isOutOfStock && (
              <Button
                disabled
                className="w-full h-10 rounded-none text-xs font-bold tracking-widest uppercase bg-neutral-100 text-neutral-400 cursor-not-allowed"
              >
                Sold Out
              </Button>
            )}

            {/* Divider */}
            <div className="border-t border-neutral-100" />

            {/* Meta info */}
            <div className="space-y-2 text-xs text-neutral-500">
              {product.category && (
                <div className="flex justify-between">
                  <span className="tracking-widest uppercase">Category</span>
                  <span className="capitalize">{product.category}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="tracking-widest uppercase">Availability</span>
                <span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>
              {product.slug && (
                <div className="flex justify-between">
                  <span className="tracking-widest uppercase">SKU</span>
                  <span>{product.slug}</span>
                </div>
              )}
            </div>

            {/* Shipping note */}
            <p className="text-[11px] text-neutral-400 tracking-wide border-t border-neutral-100 pt-4">
              Free shipping on orders over $100 · Easy 30-day returns
            </p>
          </div>
        </div>

        {/* Related products */}
        <RelatedProducts currentId={product.id} category={product.category} />
      </div>
    </div>
  );
}