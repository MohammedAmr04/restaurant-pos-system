export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  POS: "/pos",
  CATEGORIES: "/categories",
  MENU_ITEMS: "/menu-items",
  TABLES: "/tables",
  CUSTOMERS: "/customers",
  DELIVERY_RIDERS: "/delivery-riders",
  ORDERS: "/orders",
  RETURNS: "/returns",
  EXPENSES: "/expenses",
  REPORTS: "/reports",
  SETTINGS: "/settings",
  AUDIT_LOGS: "/audit-logs",
  DAILY_CLOSING: "/daily-closing",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = (typeof ROUTES)[RouteKey];
