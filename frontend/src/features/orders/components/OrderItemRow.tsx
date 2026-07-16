"use client";

import { Minus, Plus, Trash2, StickyNote } from "lucide-react";

interface OrderItemRowProps {
  name: string;
  unitPrice: number;
  quantity: number;
  total: number;
  notes?: string | null;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  onNotes?: () => void;
  disabled?: boolean;
}

export function OrderItemRow({
  name,
  unitPrice,
  quantity,
  total,
  notes,
  onIncrease,
  onDecrease,
  onRemove,
  onNotes,
  disabled,
}: OrderItemRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 min-h-[56px] border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onDecrease}
          disabled={disabled}
          className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-100 hover:text-red-600 active:scale-95 transition-all disabled:opacity-40"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-bold text-sm">{quantity}</span>
        <button
          onClick={onIncrease}
          disabled={disabled}
          className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-600 active:scale-95 transition-all disabled:opacity-40"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900 truncate">{name}</p>
        {notes && (
          <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
            <StickyNote className="w-3 h-3" />
            {notes}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-0.5">
          {unitPrice.toFixed(2)} × {quantity}
        </p>
      </div>

      <span className="font-bold text-sm text-gray-900 shrink-0 w-16 text-left">
        {total.toFixed(2)}
      </span>

      <div className="flex items-center gap-1 shrink-0">
        {onNotes && (
          <button
            onClick={onNotes}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <StickyNote className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={onRemove}
          disabled={disabled}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
