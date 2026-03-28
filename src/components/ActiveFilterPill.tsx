import { X } from "lucide-react";
import { JSX } from "react";

interface ActiveFilterPillProps {
  label: string;
  onRemove: () => void;
}

export function ActiveFilterPill({ label, onRemove }: ActiveFilterPillProps): JSX.Element {
  return (
    <div className="flex items-center gap-1.5 bg-neutral-100 px-3 py-1.5 text-xs font-medium">
      <span>{label}</span>
      <button onClick={onRemove} className="text-neutral-400 hover:text-black transition-colors">
        <X size={11} />
      </button>
    </div>
  );
}
