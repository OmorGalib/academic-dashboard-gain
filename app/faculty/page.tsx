'use client'

import { useState, useEffect } from 'react'
import { AcademicCapIcon, EnvelopeIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import { apiService } from '@/services/api'
import { Faculty } from '@/types'

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFaculty()
  }, [])

  const fetchFaculty = async () => {
    try {
      setLoading(true)
      const data = await apiService.getFaculty()
      setFaculty(data)
    } catch (error) {
      console.error('Error fetching faculty:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Faculty Panel</h1>
        <p className="text-gray-600 mt-1">Manage faculty members and their assignments</p>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading faculty...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.map((fac) => (
            <div key={fac.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <AcademicCapIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
                <div className="ml-4 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{fac.name}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <EnvelopeIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{fac.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <BookOpenIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500 truncate">Courses</p>
                      <p className="text-lg font-semibold text-gray-900">{fac.courses.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500 truncate">Students</p>
                      <p className="text-lg font-semibold text-gray-900">120+</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 truncate max-w-full">
                  {fac.department}
                </span>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-2">
                <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">
                  View Profile
                </button>
                <button className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">
                  Assign Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}