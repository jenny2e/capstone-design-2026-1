import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ExamSchedule } from '@/types';

export function useExams() {
  return useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const { data } = await api.get<ExamSchedule[]>('/exams');
      return data;
    },
  });
}

export function useCreateExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (exam: Omit<ExamSchedule, 'id' | 'user_id'>) => {
      const { data } = await api.post<ExamSchedule>('/exams', exam);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exams'] }),
  });
}

export function useDeleteExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/exams/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exams'] }),
  });
}
