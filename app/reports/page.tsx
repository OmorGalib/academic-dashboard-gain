'use client'

import { useState, useEffect } from 'react'
import { ChartBarIcon, DocumentArrowDownIcon, AcademicCapIcon, UsersIcon } from '@heroicons/react/24/outline'
import { apiService } from '@/services/api'
import { Student, Course } from '@/types'
import dynamic from 'next/dynamic'

// Dynamically import chart components to avoid SSR issues
const EnrollmentChart = dynamic(() => import('@/components/Charts/EnrollmentChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded w-32 animate-pulse"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
      </div>
    </div>
  )
})

const TopStudentsChart = dynamic(() => import('@/components/Charts/TopStudentsChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded w-32 animate-pulse"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>
      <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
      <div className="mt-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-gray-100 rounded mb-2 animate-pulse"></div>
        ))}
      </div>
    </div>
  )
})

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
      setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Generate and export academic reports</p>
      </div>

      {/* Export Section */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => handleExport('students')}
            disabled={loading}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={loading}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={loading}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 sm:col-span-2 lg:col-span-1 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Charts Section */}
      <div className="space-y-6">
        <EnrollmentChart />
        <TopStudentsChart />
      </div>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Performance</h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { label: 'Average GPA', value: '3.45', change: '+0.2' },
                { label: 'Pass Rate', value: '94%', change: '+2%' },
                { label: 'Top Student GPA', value: topStudents[0]?.gpa.toFixed(2) || '3.92', change: '+0.1' },
                { label: 'Course Completion', value: '89%', change: '+3%' },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">{item.value}</span>
                    <span className="ml-2 text-sm text-green-600">{item.change}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Reports</h3>
          <div className="space-y-3">
            <button 
              disabled={loading}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <p className="text-sm font-medium text-gray-900">Enrollment Summary</p>
              <p className="text-xs text-gray-500 mt-1">Current semester enrollment statistics</p>
            </button>
            <button 
              disabled={loading}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <p className="text-sm font-medium text-gray-900">Faculty Workload</p>
              <p className="text-xs text-gray-500 mt-1">Courses and students per faculty</p>
            </button>
            <button 
              disabled={loading}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <p className="text-sm font-medium text-gray-900">Department Performance</p>
              <p className="text-xs text-gray-500 mt-1">Academic performance by department</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}