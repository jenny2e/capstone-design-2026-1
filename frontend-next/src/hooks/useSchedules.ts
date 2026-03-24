import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Schedule } from '@/types';

export function useSchedules() {
  return useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const { data } = await api.get<Schedule[]>('/schedules');
      return data;
    },
  });
}

export function useCreateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (schedule: Omit<Schedule, 'id' | 'user_id'>) => {
      const { data } = await api.post<Schedule>('/schedules', schedule);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['schedules'] }),
  });
}

export function useUpdateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...schedule }: Partial<Schedule> & { id: number }) => {
      const { data } = await api.put<Schedule>(`/schedules/${id}`, schedule);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['schedules'] }),
  });
}

export function useDeleteSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/schedules/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['schedules'] }),
  });
}
