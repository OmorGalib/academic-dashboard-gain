import { useState, useCallback } from 'react'
import { apiService } from '@/services/api'
import { Course } from '@/types'

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCourses = useCallback(async (params?: {
    search?: string
    department?: string
    semester?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiService.getCourses(params)
      setCourses(response.courses)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses')
      console.error('Error fetching courses:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getCourseById = useCallback(async (id: string) => {
    try {
      setLoading(true)
      const course = await apiService.getCourseById(id)
      return course
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course')
      console.error('Error fetching course:', err)
      return undefined
    } finally {
      setLoading(false)
    }
  }, [])

  const getPopularCourses = useCallback(async (limit = 5) => {
    try {
      setLoading(true)
      const courses = await apiService.getPopularCourses(limit)
      return courses
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch popular courses')
      console.error('Error fetching popular courses:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    courses,
    loading,
    error,
    fetchCourses,
    getCourseById,
    getPopularCourses
  }
}