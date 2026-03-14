// ─────────────────────────────────────────────────────────────────────────────
// src/components/SizeSelector.tsx
// Controlled size picker. Highlights selected, disables out-of-stock sizes.
// Used on ProductDetail page.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from '@/lib/utils';

interface SizeSelectorProps {
  sizes: string[];
  selected: string | null;
  onSelect: (size: string) => void;
  outOfStockSizes?: string[];   // These sizes render as disabled
  className?: string;
}

export default function SizeSelector({
  sizes,
  selected,
  onSelect,
  outOfStockSizes = [],
  className,
}: SizeSelectorProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500">
          Size
        </span>
        {/* Size guide link — wire to a modal/sheet in future */}
        <button className="text-[10px] tracking-widest uppercase text-neutral-400 hover:text-black underline-offset-2 hover:underline transition-colors">
          Size Guide
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map(size => {
          const isOos = outOfStockSizes.includes(size);
          const isSelected = selected === size;

          return (
            <button
              key={size}
              onClick={() => !isOos && onSelect(size)}
              disabled={isOos}
              aria-pressed={isSelected}
              aria-label={`Size ${size}${isOos ? ' — out of stock' : ''}`}
              className={cn(
                'min-w-[3rem] h-10 px-3 text-xs font-semibold tracking-widest uppercase',
                'border transition-all duration-150',
                isSelected
                  ? 'border-black bg-black text-white'
                  : isOos
                    ? 'border-neutral-200 text-neutral-300 cursor-not-allowed line-through'
                    : 'border-neutral-300 text-black hover:border-black'
              )}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* Prompt if nothing selected yet */}
      {!selected && (
        <p className="text-[10px] text-neutral-400 tracking-wider">
          Please select a size to add to cart.
        </p>
      )}
    </div>
  );
}