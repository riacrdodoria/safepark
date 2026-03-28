import { useQuery } from "@tanstack/react-query";
import { Camera } from "@/lib/mock-data";
import { loadCameras } from "@/lib/api";

export function useCameras() {
  return useQuery({
    queryKey: ['/api/cameras'],
    queryFn: async (): Promise<Camera[]> => loadCameras(),
  });
}
