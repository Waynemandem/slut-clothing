import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Badge } from "./ui/badge";

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [wished, setWished] = useState(false);

  const mainImage = product.images?.[0] || product.image_url || "/placeholder.jpg";
  const hoverImage = product.images?.[1] || mainImage;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden bg-neutral-100 aspect-[3/4]">
        {/* Image */}
        <img
          src={hovered ? hoverImage : mainImage}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.is_new && (
            <Badge className="bg-white text-black text-[9px] font-bold tracking-widest rounded-none px-2 py-0.5 uppercase">
              New
            </Badge>
          )}
          {product.is_sale && (
            <Badge className="bg-black text-white text-[9px] font-bold tracking-widest rounded-none px-2 py-0.5 uppercase">
              Sale
            </Badge>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setWished(!wished);
          }}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-1.5"
        >
          <Heart
            size={14}
            className={wished ? "fill-black text-black" : "text-black"}
          />
        </button>

        {/* Quick add overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 text-white text-center py-3 text-[10px] font-bold tracking-[0.2em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          Quick View
        </div>
      </div>

      <div className="mt-3 px-0.5">
        <p className="text-[11px] text-neutral-400 tracking-widest uppercase">{product.category || "Clothing"}</p>
        <h3 className="text-sm font-semibold mt-0.5 tracking-wide truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold">
            ${product.price?.toFixed(2)}
          </span>
          {product.compare_price && (
            <span className="text-xs text-neutral-400 line-through">
              ${product.compare_price?.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}