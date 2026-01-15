'use client'

import { useState, useEffect } from 'react'
import { ChartBarIcon, DocumentArrowDownIcon, AcademicCapIcon, UsersIcon } from '@heroicons/react/24/outline'
import { apiService } from '@/services/api'
import { Student, Course } from '@/types'

export default function ReportsPage() {
  const [loading, setLoading] = useState(false)
  const [topStudents, setTopStudents] = useState<Student[]>([])
  const [popularCourses, setPopularCourses] = useState<Course[]>([])

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const [students, courses] = await Promise.all([
        apiService.getTopStudents(5),
        apiService.getPopularCourses(5)
      ])
      setTopStudents(students)
      setPopularCourses(courses)
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type: 'students' | 'courses' | 'grades') => {
    try {
      const csv = await apiService.exportData(type)
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Generate and export academic reports</p>
      </div>

      {/* Export Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => handleExport('students')}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center min-w-0">
              <UsersIcon className="h-6 w-6 text-gray-400 mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Students Data</p>
                <p className="text-xs text-gray-500 truncate">Export all student records</p>
              </div>
            </div>
            <DocumentArrowDownIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
          </button>

          <button
            onClick={() => handleExport('courses')}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center min-w-0">
              <AcademicCapIcon className="h-6 w-6 text-gray-400 mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Courses Data</p>
                <p className="text-xs text-gray-500 truncate">Export course information</p>
              </div>
            </div>
            <DocumentArrowDownIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
          </button>

          <button
            onClick={() => handleExport('grades')}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center min-w-0">
              <ChartBarIcon className="h-6 w-6 text-gray-400 mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Grades Data</p>
                <p className="text-xs text-gray-500 truncate">Export academic performance</p>
              </div>
            </div>
            <DocumentArrowDownIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Students</h3>
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading data...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topStudents.map((student, index) => (
                <div key={student.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center min-w-0">
                    <span className="text-sm font-medium text-gray-900 mr-2">{index + 1}.</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                      <p className="text-xs text-gray-500 truncate">{student.major}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">{student.gpa.toFixed(2)}</span>
                    <span className="ml-2 text-sm text-green-600">
                      GPA
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Courses</h3>
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading data...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {popularCourses.map((course) => (
                <button key={course.id} className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">{course.code}</p>
                    <p className="text-xs font-medium text-gray-900">
                      {course.enrolledStudents} students
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}