import { apiClient } from "@/lib/api/client";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string | null;
  notes: string | null;
}

export interface CreateCustomerDto {
  name: string;
  phone: string;
  address?: string;
  notes?: string;
}

export interface UpdateCustomerDto {
  name: string;
  phone: string;
  address?: string;
  notes?: string;
}

export function useCustomers() {
  return useQuery({
    queryKey: QUERY_KEYS.CUSTOMERS,
    queryFn: async () => {
      const response = await apiClient.get<Customer[]>("/customers");
      return response.data;
    },
  });
}

export function useCustomer(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.CUSTOMER(id),
    queryFn: async () => {
      const response = await apiClient.get<Customer>(`/customers/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCustomerByPhone(phone: string) {
  return useQuery({
    queryKey: ["customers", "phone", phone],
    queryFn: async () => {
      const response = await apiClient.get<Customer>(`/customers/phone/${phone}`);
      return response.data;
    },
    enabled: !!phone,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCustomerDto) => {
      const response = await apiClient.post<Customer>("/customers", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMERS });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateCustomerDto }) => {
      const response = await apiClient.put<Customer>(`/customers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMERS });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMERS });
    },
  });
}
