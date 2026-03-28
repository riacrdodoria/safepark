import { useQuery } from "@tanstack/react-query";

import { loadSystemStatus } from "@/lib/api";

export function useSystemStatus() {
  return useQuery({
    queryKey: ["/api/system/status"],
    queryFn: loadSystemStatus,
  });
}
