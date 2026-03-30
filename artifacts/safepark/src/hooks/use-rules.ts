import { useQuery } from "@tanstack/react-query";

import { loadRules } from "@/lib/api";

export function useRules() {
  return useQuery({
    queryKey: ["/api/rules"],
    queryFn: loadRules,
  });
}
