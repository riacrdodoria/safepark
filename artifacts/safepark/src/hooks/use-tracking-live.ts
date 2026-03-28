import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { loadTrackingLive, setVisionEnabled } from "@/lib/api";

export function useTrackingLive() {
  return useQuery({
    queryKey: ["/api/tracking/live"],
    queryFn: loadTrackingLive,
    refetchInterval: 2000,
  });
}

export function useToggleVision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cameraId, enabled }: { cameraId: string; enabled: boolean }) =>
      setVisionEnabled(cameraId, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tracking/live"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tracking"] });
    },
  });
}
