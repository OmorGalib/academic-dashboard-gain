'use client'

import { useEffect, useState } from 'react'
import { apiService } from '@/services/api'
import DynamicChart from './DynamicChart'
import { ApexOptions } from 'apexcharts'

interface EnrollmentData {
  course: string;
  enrollments: number;
  capacity: number;
}

export default function EnrollmentChart() {
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEnrollmentData()
  }, [])

  const fetchEnrollmentData = async () => {
    try {
      setLoading(true)
      const data = await apiService.getCourseEnrollments()
      setEnrollmentData(data as EnrollmentData[])
    } catch (error) {
      console.error('Error fetching enrollment data:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: enrollmentData.map(item => item.course.split(' ').slice(0, 2).join(' ')),
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Students',
        style: {
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif'
        }
      },
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + " students"
        }
      },
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    },
    colors: ['#4F46E5', '#10B981'],
    legend: {
      position: 'top',
      fontFamily: 'Inter, sans-serif'
    },
    grid: {
      borderColor: '#e5e7eb'
    },
    responsive: [{
      breakpoint: 640,
      options: {
        chart: {
          height: 300
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '10px'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '10px'
            }
          }
        }
      }
    }]
  }

  const chartSeries = [
    {
      name: 'Enrolled',
      data: enrollmentData.map(item => item.enrollments)
    },
    {
      name: 'Capacity',
      data: enrollmentData.map(item => item.capacity)
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
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Course Enrollments</h3>
          <p className="text-sm text-gray-500">Current semester enrollment statistics</p>
        </div>
        <select className="text-sm bg-amber-200 outline-none rounded-md px-3 py-1">
          <option>Fall 2024</option>
          <option>Spring 2024</option>
          <option>Fall 2023</option>
        </select>
      </div>
      <div className="mt-4">
        <DynamicChart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={350}
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="font-medium text-gray-900">
            {enrollmentData.reduce((sum, item) => sum + item.enrollments, 0)}
          </div>
          <div className="text-gray-500">Total Enrollments</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-gray-900">
            {enrollmentData.reduce((sum, item) => sum + item.capacity, 0) > 0 
              ? ((enrollmentData.reduce((sum, item) => sum + item.enrollments, 0) / 
                  enrollmentData.reduce((sum, item) => sum + item.capacity, 0) * 100).toFixed(1)) + '%'
              : '0%'}
          </div>
          <div className="text-gray-500">Overall Occupancy</div>
        </div>
      </div>
    </div>
  )
}