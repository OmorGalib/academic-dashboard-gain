import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

export const useCourses = (params?: {
  search?: string;
  department?: string;
  semester?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => apiService.getCourses(params),
  });
};

export const usePopularCourses = (limit = 10) => {
  return useQuery({
    queryKey: ['popular-courses', limit],
    queryFn: () => apiService.getPopularCourses(limit),
  });
};