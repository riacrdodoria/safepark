import { useQuery } from "@tanstack/react-query";

import { loadCameraFlow } from "@/lib/api";

export function useCameraFlow() {
  return useQuery({
    queryKey: ["/api/camera-flow"],
    queryFn: loadCameraFlow,
  });
}
