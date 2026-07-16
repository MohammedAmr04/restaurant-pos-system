import { apiClient } from "@/lib/api/client";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export interface DailySalesReportDto {
  businessDate: string;
  totalOrders: number;
  completedOrders: number;
  totalSales: number;
  discounts: number;
  serviceCharge: number;
  returns: number;
  expenses: number;
  revenueBeforeExpenses: number;
  revenueAfterExpenses: number;
}

export interface MonthlySalesReportDto {
  year: number;
  month: number;
  dailySales: DailySalesReportDto[];
  monthlyTotal: number;
  monthlyExpenses: number;
  monthlyReturns: number;
  netRevenue: number;
}

export interface CustomReportDto {
  startDate: string;
  endDate: string;
  totalOrders: number;
  sales: number;
  returns: number;
  expenses: number;
  netRevenue: number;
}

export interface DeliveryReportDto {
  riderId: number;
  riderName: string;
  numberOfOrders: number;
  totalSales: number;
}

export interface ExpenseReportDto {
  id: number;
  title: string;
  amount: number;
  createdBy: string;
  date: string;
  notes: string;
}

export interface ReturnsReportDto {
  invoiceNumber: string;
  returnDate: string;
  returnedItems: string;
  refundAmount: number;
  cashier: string;
}

export function useDailyReport(date?: string) {
  return useQuery({
    queryKey: date ? QUERY_KEYS.REPORTS_DAILY(date) : ["reports", "daily"],
    queryFn: async () => {
      const params = date ? `?date=${date}` : "";
      const response = await apiClient.get<DailySalesReportDto>(`/reports/daily${params}`);
      return response.data;
    },
    enabled: !!date,
  });
}

export function useMonthlyReport(year?: number, month?: number) {
  return useQuery({
    queryKey:
      year && month ? QUERY_KEYS.REPORTS_MONTHLY(year, month) : ["reports", "monthly"],
    queryFn: async () => {
      const params = year && month ? `?year=${year}&month=${month}` : "";
      const response = await apiClient.get<MonthlySalesReportDto>(`/reports/monthly${params}`);
      return response.data;
    },
    enabled: !!year && !!month,
  });
}

export function useCustomReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey:
      startDate && endDate
        ? QUERY_KEYS.REPORTS_CUSTOM(startDate, endDate)
        : ["reports", "custom"],
    queryFn: async () => {
      const params = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : "";
      const response = await apiClient.get<CustomReportDto>(`/reports/custom${params}`);
      return response.data;
    },
    enabled: !!startDate && !!endDate,
  });
}

export function useDeliveryReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey:
      startDate && endDate
        ? QUERY_KEYS.REPORTS_DELIVERY(startDate, endDate)
        : ["reports", "delivery"],
    queryFn: async () => {
      const params = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : "";
      const response = await apiClient.get<DeliveryReportDto[]>(`/reports/delivery${params}`);
      return response.data;
    },
    enabled: !!startDate && !!endDate,
  });
}

export function useExpenseReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey:
      startDate && endDate
        ? QUERY_KEYS.REPORTS_EXPENSES(startDate, endDate)
        : ["reports", "expenses"],
    queryFn: async () => {
      const params = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : "";
      const response = await apiClient.get<ExpenseReportDto[]>(`/reports/expenses${params}`);
      return response.data;
    },
    enabled: !!startDate && !!endDate,
  });
}

export function useReturnsReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey:
      startDate && endDate
        ? QUERY_KEYS.REPORTS_RETURNS(startDate, endDate)
        : ["reports", "returns"],
    queryFn: async () => {
      const params = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : "";
      const response = await apiClient.get<ReturnsReportDto[]>(`/reports/returns${params}`);
      return response.data;
    },
    enabled: !!startDate && !!endDate,
  });
}
