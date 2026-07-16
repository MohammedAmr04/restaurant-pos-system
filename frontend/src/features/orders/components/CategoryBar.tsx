"use client";

import { useTranslations } from "next-intl";

interface Category {
  id: number;
  name: string;
}

interface CategoryBarProps {
  categories: Category[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}

export function CategoryBar({
  categories,
  selected,
  onSelect,
}: CategoryBarProps) {
  const t = useTranslations("orders");

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
          selected === null
            ? "bg-indigo-600 text-white shadow-sm"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {t("allCategories")}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            selected === cat.id
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
