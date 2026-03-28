import { useQuery } from "@tanstack/react-query";

import { loadTracking } from "@/lib/api";

export function useTrackingOverview() {
  return useQuery({
    queryKey: ["/api/tracking/overview"],
    queryFn: loadTracking,
  });
}
