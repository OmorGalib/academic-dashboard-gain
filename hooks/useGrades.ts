import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Grade } from '@/types';

export const useStudentGrades = (studentId: string) => {
  return useQuery({
    queryKey: ['grades', studentId],
    queryFn: () => apiService.getStudentGrades(studentId),
    enabled: !!studentId,
  });
};

export const useUpdateGrade = () => {
  const queryClient = useQueryClient();
  
  type UpdateGradeInput = {
    studentId: string;
    courseId: string;
    grade: string;
    score: number;
  };

  return useMutation<Grade, unknown, UpdateGradeInput>({
    mutationFn: (data: UpdateGradeInput) => apiService.updateGrade(data),
    onSuccess: (_: Grade, variables: UpdateGradeInput) => {
      queryClient.invalidateQueries({ queryKey: ['grades', variables.studentId] });
    },
  });
};