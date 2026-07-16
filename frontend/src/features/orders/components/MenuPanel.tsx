"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/lib/components/ui/input";
import { EmptyState } from "@/lib/components/ui/empty-state";
import { CategoryBar } from "./CategoryBar";
import { MenuItemCard } from "./MenuItemCard";
import type { MenuItem } from "@/features/menu-items/hooks";

interface Category {
  id: number;
  name: string;
}

interface MenuPanelProps {
  categories: Category[];
  filteredItems: MenuItem[];
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: number | null;
  onCategoryChange: (id: number | null) => void;
  onAddItem: (id: number, name: string, price: number) => void;
  isAddingItem?: boolean;
}

export function MenuPanel({
  categories,
  filteredItems,
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  onAddItem,
  isAddingItem,
}: MenuPanelProps) {
  const t = useTranslations("orders");

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 space-y-3 bg-white border-b shrink-0">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder={t("searchMenu")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10 h-12 text-base rounded-xl"
          />
        </div>
        <CategoryBar
          categories={categories}
          selected={categoryFilter}
          onSelect={onCategoryChange}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredItems.length === 0 ? (
          <EmptyState
            title={t("noMenuItems")}
            description={t("noMenuItemsAvailable")}
          />
        ) : (
          <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAdd={onAddItem}
                disabled={isAddingItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
