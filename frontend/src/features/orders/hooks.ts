import { apiClient } from "@/lib/api/client";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface OrderItemDetailDto {
  id: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  notes: string | null;
  total: number;
}

export interface Order {
  id: number;
  invoiceNumber: string;
  orderType: string;
  status: string;
  userId: number;
  userName: string;
  customerId: number | null;
  customerName: string | null;
  tableId: number | null;
  tableNumber: number | null;
  deliveryRiderId: number | null;
  deliveryRiderName: string | null;
  subtotal: number;
  discountType: string | null;
  discountValue: number;
  serviceCharge: number;
  tax: number;
  grandTotal: number;
  paymentMethod: string | null;
  paidAmount: number;
  businessDate: string;
  completedAt: string | null;
  createdAt: string;
  items: OrderItemDetailDto[];
}

export interface CreateOrderDto {
  orderType: string;
  customerId?: number;
  tableId?: number;
  deliveryRiderId?: number;
  items: { menuItemId: number; quantity: number; notes?: string }[];
}

export interface OrderItemDto {
  menuItemId: number;
  quantity: number;
  notes?: string;
}

export interface UpdateOrderItemDto {
  quantity: number;
  notes?: string;
}

export interface ApplyDiscountDto {
  discountType: string;
  discountValue: number;
}

export interface ApplyServiceChargeDto {
  serviceCharge: number;
}

export interface CompleteOrderDto {
  paymentMethod: string;
  paidAmount: number;
}

export function useOrders() {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS,
    queryFn: async () => {
      const response = await apiClient.get<Order[]>("/orders");
      return response.data;
    },
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.ORDER(id),
    queryFn: async () => {
      const response = await apiClient.get<Order>(`/orders/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useHoldOrders() {
  return useQuery({
    queryKey: QUERY_KEYS.HOLD_ORDERS,
    queryFn: async () => {
      const response = await apiClient.get<Order[]>("/orders/hold");
      return response.data;
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateOrderDto) => {
      const response = await apiClient.post<Order>("/orders", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOLD_ORDERS });
    },
  });
}

export function useAddOrderItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      data,
    }: {
      orderId: number;
      data: OrderItemDto;
    }) => {
      const response = await apiClient.post<Order>(
        `/orders/${orderId}/items`,
        data
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOLD_ORDERS });
    },
  });
}

export function useUpdateOrderItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      itemId,
      data,
    }: {
      orderId: number;
      itemId: number;
      data: UpdateOrderItemDto;
    }) => {
      const response = await apiClient.put<Order>(
        `/orders/${orderId}/items/${itemId}`,
        data
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOLD_ORDERS });
    },
  });
}

export function useRemoveOrderItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      itemId,
    }: {
      orderId: number;
      itemId: number;
    }) => {
      const response = await apiClient.delete<Order>(
        `/orders/${orderId}/items/${itemId}`
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOLD_ORDERS });
    },
  });
}

export function useApplyDiscount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      data,
    }: {
      orderId: number;
      data: ApplyDiscountDto;
    }) => {
      const response = await apiClient.patch<Order>(
        `/orders/${orderId}/discount`,
        data
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOLD_ORDERS });
    },
  });
}

export function useRemoveDiscount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      const response = await apiClient.delete<Order>(
        `/orders/${orderId}/discount`
      );
      return response.data;
    },
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER(orderId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOLD_ORDERS });
    },
  });
}

export function useApplyServiceCharge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      data,
    }: {
      orderId: number;
      data: ApplyServiceChargeDto;
    }) => {
      const response = await apiClient.patch<Order>(
        `/orders/${orderId}/service-charge`,
        data
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOLD_ORDERS });
    },
  });
}

export function useRemoveServiceCharge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      const response = await apiClient.delete<Order>(
        `/orders/${orderId}/service-charge`
      );
      return response.data;
    },
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER(orderId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOLD_ORDERS });
    },
  });
}

export function useCompleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      data,
    }: {
      orderId: number;
      data: CompleteOrderDto;
    }) => {
      const response = await apiClient.patch<Order>(
        `/orders/${orderId}/complete`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOLD_ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TABLES });
    },
  });
}

export function useResumeOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      const response = await apiClient.patch<Order>(
        `/orders/${orderId}/resume`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOLD_ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TABLES });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      await apiClient.delete(`/orders/${orderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOLD_ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TABLES });
    },
  });
}
