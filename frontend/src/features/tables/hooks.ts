import { apiClient } from "@/lib/api/client";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Table {
  id: number;
  number: number;
  isOccupied: boolean;
}

export interface CreateTableDto {
  number: number;
}

export interface UpdateTableDto {
  number: number;
}

export interface MoveOrderDto {
  targetTableId: number;
}

export function useTables() {
  return useQuery({
    queryKey: QUERY_KEYS.TABLES,
    queryFn: async () => {
      const response = await apiClient.get<Table[]>("/tables");
      return response.data;
    },
  });
}

export function useTable(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.TABLE(id),
    queryFn: async () => {
      const response = await apiClient.get<Table>(`/tables/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTableDto) => {
      const response = await apiClient.post<Table>("/tables", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TABLES });
    },
  });
}

export function useUpdateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateTableDto }) => {
      const response = await apiClient.put<Table>(`/tables/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TABLES });
    },
  });
}

export function useDeleteTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/tables/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TABLES });
    },
  });
}

export function useMoveOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: MoveOrderDto;
    }) => {
      const response = await apiClient.patch<void>(
        `/tables/${id}/move-order`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TABLES });
    },
  });
}
