import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MOCK_EVENTS, SecurityEvent } from "@/lib/mock-data";

// Simulating API latency and robust frontend state
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useEvents() {
  return useQuery({
    queryKey: ['/api/events'],
    queryFn: async (): Promise<SecurityEvent[]> => {
      await delay(600);
      return MOCK_EVENTS;
    },
    initialData: MOCK_EVENTS,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['/api/events', id],
    queryFn: async (): Promise<SecurityEvent | undefined> => {
      await delay(400);
      return MOCK_EVENTS.find(e => e.id === id);
    },
    initialData: () => MOCK_EVENTS.find(e => e.id === id),
  });
}

export function useUpdateEventStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await delay(500);
      // In a real app this would be a PATCH to /api/events/:id
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
    }
  });
}
