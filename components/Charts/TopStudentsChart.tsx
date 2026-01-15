'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { apiService } from '@/services/api'
import { Student } from '@/types'

// Dynamically import ApexCharts for better performance
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function TopStudentsChart() {
  const [topStudents, setTopStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [viewType, setViewType] = useState<'gpa' | 'courses'>('gpa')

  useEffect(() => {
    fetchTopStudents()
  }, [])

  const fetchTopStudents = async () => {
    try {
      setLoading(true)
      const data = await apiService.getTopStudents(10)
      setTopStudents(data)
    } catch (error) {
      console.error('Error fetching top students:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartOptions: any = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(2)
      },
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },
    xaxis: {
      categories: topStudents.map(student => 
        viewType === 'gpa' 
          ? student.name.split(' ')[0]
          : `${student.name.split(' ')[0]} (${student.major})`
      ),
      title: {
        text: viewType === 'gpa' ? 'GPA Score' : 'Number of Courses',
        style: {
          fontSize: '14px',
          fontWeight: 600
        }
      },
      max: viewType === 'gpa' ? 4.0 : Math.max(...topStudents.map(s => s.courses?.length || 0)) + 1
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    colors: ['#4F46E5'],
    tooltip: {
      y: {
        formatter: function (val: number) {
          return viewType === 'gpa' 
            ? `GPA: ${val.toFixed(2)}`
            : `Courses: ${val}`
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1'
    }
  }

  const chartSeries = [
    {
      name: viewType === 'gpa' ? 'GPA' : 'Courses',
      data: topStudents.map(student => 
        viewType === 'gpa' ? student.gpa : (student.courses?.length || 0)
      )
    }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Students</h3>
          <p className="text-sm text-gray-500">Academic performance by GPA and course load</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewType('gpa')}
            className={`px-3 py-1 text-sm rounded-md ${viewType === 'gpa' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            By GPA
          </button>
          <button
            onClick={() => setViewType('courses')}
            className={`px-3 py-1 text-sm rounded-md ${viewType === 'courses' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            By Course Load
          </button>
        </div>
      </div>
      <div className="mt-4">
        {typeof window !== 'undefined' && (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={350}
          />
        )}
      </div>
      <div className="mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Major</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">GPA</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Courses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className={`flex items-center justify-center h-6 w-6 rounded-full ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-50 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-8 w-8 rounded-full mr-2"
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.avatar || student.name}`}
                        alt={student.name}
                      />
                      <span className="text-sm font-medium text-gray-500">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {student.major}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      student.gpa >= 3.8 ? 'bg-green-100 text-green-800' :
                      student.gpa >= 3.5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {student.gpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {student.courses?.length || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}