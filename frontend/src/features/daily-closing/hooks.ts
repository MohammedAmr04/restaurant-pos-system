import { apiClient } from "@/lib/api/client";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface DailyClosingSummary {
  businessDate: string;
  totalOrders: number;
  totalSales: number;
  totalExpenses: number;
  totalReturns: number;
  cashCollected: number;
  expectedCash: number;
}

export interface DailyClosing {
  id: number;
  userId: number;
  userName: string;
  businessDate: string;
  totalSales: number;
  totalExpenses: number;
  totalReturns: number;
  cashCollected: number;
  expectedCash: number;
  actualCash: number;
  difference: number;
  notes: string | null;
  createdAt: string;
}

export interface CreateDailyClosingDto {
  actualCash: number;
  notes?: string;
}

export function useDailyClosingSummary() {
  return useQuery({
    queryKey: ["daily-closing", "summary"],
    queryFn: async () => {
      const response = await apiClient.get<DailyClosingSummary>("/daily-closing");
      return response.data;
    },
  });
}

export function useDailyClosingHistory() {
  return useQuery({
    queryKey: ["daily-closing", "history"],
    queryFn: async () => {
      const response = await apiClient.get<DailyClosing[]>("/daily-closing/history");
      return response.data;
    },
  });
}

export function useCreateDailyClosing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDailyClosingDto) => {
      const response = await apiClient.post<DailyClosing>("/daily-closing", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-closing"] });
    },
  });
}
