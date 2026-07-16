import { apiClient } from "@/lib/api/client";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export interface AuditLog {
  id: number;
  userId: number | null;
  userName: string | null;
  action: string;
  entity: string;
  entityId: number | null;
  details: string;
  createdAt: string;
}

export function useAuditLogs() {
  return useQuery({
    queryKey: QUERY_KEYS.AUDIT_LOGS,
    queryFn: async () => {
      const response = await apiClient.get<AuditLog[]>("/audit-logs");
      return response.data;
    },
  });
}

export function useAuditLog(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.AUDIT_LOG(id),
    queryFn: async () => {
      const response = await apiClient.get<AuditLog>(`/audit-logs/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}
