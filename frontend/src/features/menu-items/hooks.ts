import { apiClient } from "@/lib/api/client";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface MenuItem {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  price: number;
  image: string | null;
  notes: string | null;
  displayOrder: number;
  isAvailable: boolean;
}

export interface CreateMenuItemDto {
  categoryId: number;
  name: string;
  price: number;
  image?: string;
  notes?: string;
  displayOrder: number;
}

export interface UpdateMenuItemDto {
  categoryId: number;
  name: string;
  price: number;
  image?: string;
  notes?: string;
  displayOrder: number;
}

export function useMenuItems() {
  return useQuery({
    queryKey: QUERY_KEYS.MENU_ITEMS,
    queryFn: async () => {
      const response = await apiClient.get<MenuItem[]>("/menu-items");
      return response.data;
    },
  });
}

export function useMenuItem(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.MENU_ITEM(id),
    queryFn: async () => {
      const response = await apiClient.get<MenuItem>(`/menu-items/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMenuItemDto) => {
      const response = await apiClient.post<MenuItem>("/menu-items", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MENU_ITEMS });
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateMenuItemDto }) => {
      const response = await apiClient.put<MenuItem>(`/menu-items/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MENU_ITEMS });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/menu-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MENU_ITEMS });
    },
  });
}

export function useToggleAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isAvailable }: { id: number; isAvailable: boolean }) => {
      const response = await apiClient.patch<MenuItem>(`/menu-items/${id}/availability`, {
        isAvailable,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MENU_ITEMS });
    },
  });
}
