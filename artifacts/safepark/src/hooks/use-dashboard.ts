import { useQuery } from "@tanstack/react-query";

import { loadDashboard } from "@/lib/api";

export function useDashboard() {
  return useQuery({
    queryKey: ["/api/dashboard/metrics"],
    queryFn: loadDashboard,
  });
}
