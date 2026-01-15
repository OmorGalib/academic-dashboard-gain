import { useState, useCallback } from 'react'
import { apiService } from '@/services/api'
import { Grade } from '@/types'

export function useGrades() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStudentGrades = useCallback(async (studentId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const studentGrades = await apiService.getStudentGrades(studentId)
      setGrades(studentGrades)
      return studentGrades
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch grades')
      console.error('Error fetching grades:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCourseGrades = useCallback(async (courseId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const courseGrades = await apiService.getCourseGrades(courseId)
      setGrades(courseGrades)
      return courseGrades
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course grades')
      console.error('Error fetching course grades:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const updateGrade = useCallback(async (data: {
    studentId: string;
    courseId: string;
    grade: string;
    score: number;
  }) => {
    try {
      setLoading(true)
      setError(null)
      
      const updatedGrade = await apiService.updateGrade(data)
      
      // Update local state if grade exists
      setGrades(prev => {
        const index = prev.findIndex(g => 
          g.studentId === data.studentId && g.courseId === data.courseId
        )
        if (index !== -1) {
          const newGrades = [...prev]
          newGrades[index] = updatedGrade
          return newGrades
        }
        return [...prev, updatedGrade]
      })
      
      return updatedGrade
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update grade')
      console.error('Error updating grade:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    grades,
    loading,
    error,
    fetchStudentGrades,
    fetchCourseGrades,
    updateGrade
  }
}