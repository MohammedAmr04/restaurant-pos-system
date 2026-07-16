import { apiClient } from "@/lib/api/client";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Expense {
  id: number;
  userId: number;
  userName: string;
  title: string;
  amount: number;
  notes: string | null;
  businessDate: string;
  createdAt: string;
}

export interface CreateExpenseDto {
  title: string;
  amount: number;
  notes?: string;
}

export interface UpdateExpenseDto {
  title: string;
  amount: number;
  notes?: string;
}

export function useExpenses() {
  return useQuery({
    queryKey: QUERY_KEYS.EXPENSES,
    queryFn: async () => {
      const response = await apiClient.get<Expense[]>("/expenses");
      return response.data;
    },
  });
}

export function useExpense(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.EXPENSE(id),
    queryFn: async () => {
      const response = await apiClient.get<Expense>(`/expenses/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExpenseDto) => {
      const response = await apiClient.post<Expense>("/expenses", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXPENSES });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateExpenseDto }) => {
      const response = await apiClient.put<Expense>(`/expenses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXPENSES });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXPENSES });
    },
  });
}
