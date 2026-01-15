import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: apiService.getDashboardStats,
  });
};

export const useTopStudents = (limit = 10) => {
  return useQuery({
    queryKey: ['top-students', limit],
    queryFn: () => apiService.getTopStudents(limit),
  });
};

export const useCourseEnrollments = () => {
  return useQuery({
    queryKey: ['course-enrollments'],
    queryFn: apiService.getCourseEnrollments,
  });
};