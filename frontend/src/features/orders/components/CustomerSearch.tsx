"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Search, X, UserPlus } from "lucide-react";
import { useCustomerSearch, Customer } from "@/features/customers/hooks";

interface CustomerSearchProps {
  selectedCustomerId: number | null;
  customers: Customer[] | undefined;
  onCustomerChange: (id: number | null) => void;
  onOpenAddCustomer: () => void;
  required?: boolean;
}

export function CustomerSearch({
  selectedCustomerId,
  customers,
  onCustomerChange,
  onOpenAddCustomer,
  required,
}: CustomerSearchProps) {
  const t = useTranslations("orders");
  const tCommon = useTranslations("common");
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isLoading } = useCustomerSearch(query);

  const selectedCustomer = customers?.find((c) => c.id === selectedCustomerId);

  const displayResults = query.length >= 2 ? searchResults : customers;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (customer: Customer) => {
    onCustomerChange(customer.id);
    setQuery("");
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCustomerChange(null);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      {selectedCustomer ? (
        <div className="flex items-center h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm">
          <span className="flex-1 truncate">
            {selectedCustomer.name} - {selectedCustomer.phone}
          </span>
          <button
            onClick={handleClear}
            className="ml-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={t("searchCustomerPhone")}
            className="flex h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm"
          />
        </div>
      )}

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-white shadow-lg max-h-60 overflow-y-auto">
          {isLoading && query.length >= 2 && (
            <div className="px-3 py-2 text-sm text-gray-500">{tCommon("loading")}</div>
          )}

          {!isLoading && displayResults && displayResults.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">{t("noCustomersFound")}</div>
          )}

          {displayResults?.map((customer) => (
            <button
              key={customer.id}
              onClick={() => handleSelect(customer)}
              className="w-full px-3 py-2 text-right text-sm hover:bg-gray-50 flex items-center justify-between"
            >
              <span className="font-medium">{customer.name}</span>
              <span className="text-gray-500">{customer.phone}</span>
            </button>
          ))}

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenAddCustomer();
            }}
            className="w-full px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 border-t"
          >
            <UserPlus className="w-4 h-4" />
            {t("addNewCustomer")}
          </button>
        </div>
      )}
    </div>
  );
}
