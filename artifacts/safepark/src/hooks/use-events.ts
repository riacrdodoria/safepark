import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MOCK_EVENTS, SecurityEvent } from "@/lib/mock-data";
import { loadEvent, loadEvents } from "@/lib/api";

export function useEvents() {
  return useQuery({
    queryKey: ['/api/events'],
    queryFn: async (): Promise<SecurityEvent[]> => loadEvents(),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['/api/events', id],
    queryFn: async (): Promise<SecurityEvent | undefined> => loadEvent(id),
    initialData: () => MOCK_EVENTS.find(e => e.id === id),
  });
}

export function useUpdateEventStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      // In a real app this would be a PATCH to /api/events/:id
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
    }
  });
}
