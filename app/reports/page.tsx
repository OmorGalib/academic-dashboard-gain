'use client'

import { useState, useEffect } from 'react'
import { ChartBarIcon, DocumentArrowDownIcon, AcademicCapIcon, UsersIcon } from '@heroicons/react/24/outline'
import { apiService } from '@/services/api'
import { Student, Course } from '@/types'
import EnrollmentChart from '@/components/Charts/EnrollmentChart'
import TopStudentsChart from '@/components/Charts/TopStudentsChart'

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
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
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
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
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
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 sm:col-span-2 lg:col-span-1"
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
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Performance</h3>
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading data...</p>
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

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Reports</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <p className="text-sm font-medium text-gray-900">Enrollment Summary</p>
              <p className="text-xs text-gray-500 mt-1">Current semester enrollment statistics</p>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <p className="text-sm font-medium text-gray-900">Faculty Workload</p>
              <p className="text-xs text-gray-500 mt-1">Courses and students per faculty</p>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <p className="text-sm font-medium text-gray-900">Department Performance</p>
              <p className="text-xs text-gray-500 mt-1">Academic performance by department</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}