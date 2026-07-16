import type { Order, OrderItemDetailDto } from "./hooks";
import type { MenuItem } from "@/features/menu-items/hooks";

export interface CartItem {
  menuItemId: number;
  menuItemName: string;
  unitPrice: number;
  quantity: number;
  notes: string;
}

export interface POSState {
  orderType: string;
  selectedTableId: number | null;
  selectedCustomerId: number | null;
  selectedRiderId: number | null;
  activeOrder: Order | null;
  cartItems: CartItem[];
  menuSearch: string;
  categoryFilter: number | null;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  serviceCharge: number;
  tax: number;
  grandTotal: number;
  discountType: string | null;
  discountValue: number;
}
