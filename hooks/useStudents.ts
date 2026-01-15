import { useState, useCallback } from 'react'
import { apiService } from '@/services/api'
import { Student } from '@/types'

interface UseStudentsProps {
  initialPage?: number
  initialLimit?: number
}

export function useStudents({ initialPage = 1, initialLimit = 10 }: UseStudentsProps = {}) {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0
  })

  const fetchStudents = useCallback(async (params?: {
    search?: string
    year?: number
    major?: string
    page?: number
    limit?: number
  }) => {
    try {
      setLoading(true)
      setError(null)
      
      const page = params?.page || pagination.page
      const limit = params?.limit || pagination.limit
      
      const response = await apiService.getStudents({
        ...params,
        page,
        limit
      })
      
      setStudents(response.students)
      setPagination(prev => ({
        ...prev,
        page,
        limit,
        total: response.total,
        totalPages: Math.ceil(response.total / limit)
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students')
      console.error('Error fetching students:', err)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  const updateStudent = useCallback(async (id: string, data: Partial<Student>) => {
    try {
      setLoading(true)
      const updatedStudent = await apiService.updateStudent(id, data)
      
      setStudents(prev => prev.map(student => 
        student.id === id ? updatedStudent : student
      ))
      
      return updatedStudent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update student')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteStudent = useCallback(async (id: string) => {
    try {
      setLoading(true)
      await apiService.deleteStudent(id)
      
      setStudents(prev => prev.filter(student => student.id !== id))
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1,
        totalPages: Math.ceil((prev.total - 1) / prev.limit)
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete student')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createStudent = useCallback(async (data: Omit<Student, 'id'>) => {
    try {
      setLoading(true)
      const newStudent = await apiService.createStudent(data)
      
      setStudents(prev => [newStudent, ...prev])
      setPagination(prev => ({
        ...prev,
        total: prev.total + 1,
        totalPages: Math.ceil((prev.total + 1) / prev.limit)
      }))
      
      return newStudent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create student')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }))
    fetchStudents({ page })
  }, [fetchStudents])

  const setLimit = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }))
    fetchStudents({ limit, page: 1 })
  }, [fetchStudents])

  return {
    students,
    loading,
    error,
    pagination,
    fetchStudents,
    updateStudent,
    deleteStudent,
    createStudent,
    setPage,
    setLimit
  }
}