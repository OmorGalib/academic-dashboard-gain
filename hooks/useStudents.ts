import { apiService } from '@/services/api';
import { Student } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useStudents = (params?: {
  search?: string;
  year?: number;
  major?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => apiService.getStudents(params),
  });
};

export const useStudent = (id: string) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => apiService.getStudentById(id),
    enabled: !!id,
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) =>
      apiService.updateStudent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['student', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};