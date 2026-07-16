"use client";

import { Plus } from "lucide-react";
import type { MenuItem } from "@/features/menu-items/hooks";

interface MenuItemCardProps {
  item: MenuItem;
  onAdd: (id: number, name: string, price: number) => void;
  disabled?: boolean;
}

export function MenuItemCard({ item, onAdd, disabled }: MenuItemCardProps) {
  return (
    <button
      onClick={() => onAdd(item.id, item.name, item.price)}
      disabled={disabled}
      className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-indigo-400 hover:shadow-md transition-all duration-150 flex flex-col text-right disabled:opacity-50"
    >
      {item.image ? (
        <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
          <span className="text-3xl font-bold text-indigo-200">
            {item.name.charAt(0)}
          </span>
        </div>
      )}

      <div className="p-3 flex-1 flex flex-col justify-between">
        <p className="font-semibold text-sm text-gray-900 line-clamp-2 leading-tight">
          {item.name}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-indigo-600 font-bold text-sm">
            {item.price.toFixed(2)}
          </span>
          <span className="bg-indigo-600 text-white rounded-full w-7 h-7 flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" />
          </span>
        </div>
      </div>
    </button>
  );
}
