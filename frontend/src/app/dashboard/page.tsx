"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/constants/routes";
import {
  ShoppingCart,
  Tag,
  UtensilsCrossed,
  Table2,
  Users,
  Bike,
  RotateCcw,
  Receipt,
  BarChart3,
  Settings,
  ClipboardList,
  LogOut,
} from "lucide-react";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const t = useTranslations("dashboard");
  const tNav = useTranslations("nav");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const modules = [
    { name: tNav("sales"), icon: ShoppingCart, route: ROUTES.POS },
    { name: tNav("categories"), icon: Tag, route: ROUTES.CATEGORIES },
    { name: tNav("menuItems"), icon: UtensilsCrossed, route: ROUTES.MENU_ITEMS },
    { name: tNav("tables"), icon: Table2, route: ROUTES.TABLES },
    { name: tNav("customers"), icon: Users, route: ROUTES.CUSTOMERS },
    { name: tNav("deliveryRiders"), icon: Bike, route: ROUTES.DELIVERY_RIDERS },
    { name: tNav("returns"), icon: RotateCcw, route: ROUTES.RETURNS },
    { name: tNav("expenses"), icon: Receipt, route: ROUTES.EXPENSES },
    { name: tNav("reports"), icon: BarChart3, route: ROUTES.REPORTS },
    { name: tNav("settings"), icon: Settings, route: ROUTES.SETTINGS },
    { name: tNav("auditLogs"), icon: ClipboardList, route: ROUTES.AUDIT_LOGS },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{t("welcome")} {user?.fullName}</span>
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5" />
              {t("logout")}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {modules.map((module) => (
            <button
              key={module.route}
              onClick={() => router.push(module.route)}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center gap-3"
            >
              <module.icon className="w-8 h-8 text-indigo-600" />
              <span className="text-gray-900 font-medium">{module.name}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
