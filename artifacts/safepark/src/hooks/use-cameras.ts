import { useQuery } from "@tanstack/react-query";
import { MOCK_CAMERAS, Camera } from "@/lib/mock-data";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useCameras() {
  return useQuery({
    queryKey: ['/api/cameras'],
    queryFn: async (): Promise<Camera[]> => {
      await delay(500);
      return MOCK_CAMERAS;
    },
    initialData: MOCK_CAMERAS,
  });
}
