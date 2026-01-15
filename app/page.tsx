'use client'

import { UsersIcon, BookOpenIcon, AcademicCapIcon, ChartBarIcon, ArrowTrendingUpIcon, ClockIcon, ServerIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { apiService } from '@/services/api'
import { Student, Course } from '@/types'
import Link from 'next/link'

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalFaculty: number;
  averageGPA: number;
  totalEnrollments: number;
}

interface Activity {
  type: string;
  student?: string;
  course?: string;
  instructor?: string;
  major?: string;
  grade?: string;
  time: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalCourses: 0,
    totalFaculty: 0,
    averageGPA: 0,
    totalEnrollments: 0
  })
  const [topStudents, setTopStudents] = useState<Student[]>([])
  const [popularCourses, setPopularCourses] = useState<Course[]>([])
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [systemMetrics, setSystemMetrics] = useState({
    serverStatus: 'online' as 'online' | 'offline' | 'maintenance',
    responseTime: 0,
    activeUsers: 0,
    storageUsed: '0 GB'
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [
        stats,
        topStudentsData,
        popularCoursesData,
        activityData,
        metrics
      ] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getTopStudents(5),
        apiService.getPopularCourses(4),
        apiService.getRecentActivity(),
        apiService.getSystemMetrics()
      ])

      setDashboardStats(stats)
      setTopStudents(topStudentsData)
      setPopularCourses(popularCoursesData)
      setRecentActivity(activityData as Activity[])
      setSystemMetrics(metrics)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { 
      name: 'Total Students', 
      value: dashboardStats.totalStudents.toLocaleString(), 
      icon: UsersIcon, 
      change: '+12%', 
      color: 'bg-blue-500',
      href: '/students'
    },
    { 
      name: 'Total Courses', 
      value: dashboardStats.totalCourses.toString(), 
      icon: BookOpenIcon, 
      change: '+5%', 
      color: 'bg-green-500',
      href: '/courses'
    },
    { 
      name: 'Faculty Members', 
      value: dashboardStats.totalFaculty.toString(), 
      icon: AcademicCapIcon, 
      change: '+8%', 
      color: 'bg-purple-500',
      href: '/faculty'
    },
    { 
      name: 'Average GPA', 
      value: dashboardStats.averageGPA.toFixed(2), 
      icon: ChartBarIcon, 
      change: '+0.2', 
      color: 'bg-yellow-500',
      href: '/reports'
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <UsersIcon className="h-5 w-5 text-green-600" />
      case 'grade_update': return <ChartBarIcon className="h-5 w-5 text-blue-600" />
      case 'course_added': return <BookOpenIcon className="h-5 w-5 text-purple-600" />
      case 'student_added': return <UserGroupIcon className="h-5 w-5 text-indigo-600" />
      default: return <ClockIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'enrollment':
        return `${activity.student} enrolled in ${activity.course}`
      case 'grade_update':
        return `${activity.student} received ${activity.grade} in ${activity.course}`
      case 'course_added':
        return `New course "${activity.course}" added by ${activity.instructor}`
      case 'student_added':
        return `New student ${activity.student} added to ${activity.major}`
      default:
        return 'Activity recorded'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, Admin!</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Here's what's happening with your academy today.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <ArrowTrendingUpIcon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">Overall performance up by 15%</span>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            systemMetrics.serverStatus === 'online' 
              ? 'bg-green-100 text-green-800' 
              : systemMetrics.serverStatus === 'maintenance'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            <ServerIcon className="h-3 w-3 mr-1" />
            Server: {systemMetrics.serverStatus}
          </div>
          <div className="text-sm text-gray-500">
            <span className="font-medium">{systemMetrics.activeUsers}</span> active users
          </div>
          <div className="text-sm text-gray-500">
            Response: <span className="font-medium">{systemMetrics.responseTime}ms</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link 
            key={stat.name} 
            href={stat.href}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1 min-w-0">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 truncate">{stat.value}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Students */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">Top Performing Students</h3>
              <span className="text-sm text-gray-500">This Semester</span>
            </div>
            <div className="mt-6 flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                {topStudents.map((student) => (
                  <li key={student.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-full" 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.avatar || student.name}`} 
                          alt={student.name}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="truncate text-sm text-gray-500">{student.major} • Year {student.year}</p>
                      </div>
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${
                        student.gpa >= 3.8 ? 'bg-green-100 text-green-800' :
                        student.gpa >= 3.5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        GPA: {student.gpa.toFixed(2)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                href="/students"
                className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                View all students
              </Link>
            </div>
          </div>
        </div>

        {/* Popular Courses */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">Most Popular Courses</h3>
              <span className="text-sm text-gray-500">Fall 2024</span>
            </div>
            <div className="mt-6 flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                {popularCourses.map((course) => (
                  <li key={course.id} className="py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                        <p className="text-sm text-gray-500 truncate">{course.code} • {course.faculty}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-900 font-medium">
                          {course.enrolledStudents}/{course.maxCapacity}
                        </div>
                        <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ 
                              width: `${Math.min((course.enrolledStudents / course.maxCapacity) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                href="/courses"
                className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                View all courses
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg lg:col-span-2">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">Recent Activity</h3>
            <div className="mt-6 flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                {recentActivity.map((activity, index) => (
                  <li key={index} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {getActivityText(activity)}
                        </p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">Quick Actions</h3>
            <div className="mt-6 grid grid-cols-1 gap-4">
              <Link
                href="/students?add=true"
                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-4 py-4 shadow-sm hover:border-gray-400 hover:shadow transition-all duration-200"
              >
                <div className="flex-shrink-0 rounded-md bg-blue-100 p-2">
                  <UsersIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">Add Student</p>
                  <p className="truncate text-sm text-gray-500">Register new student</p>
                </div>
              </Link>

              <Link
                href="/courses?add=true"
                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-4 py-4 shadow-sm hover:border-gray-400 hover:shadow transition-all duration-200"
              >
                <div className="flex-shrink-0 rounded-md bg-green-100 p-2">
                  <BookOpenIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">Create Course</p>
                  <p className="truncate text-sm text-gray-500">Add new course</p>
                </div>
              </Link>

              <Link
                href="/grades"
                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-4 py-4 shadow-sm hover:border-gray-400 hover:shadow transition-all duration-200"
              >
                <div className="flex-shrink-0 rounded-md bg-purple-100 p-2">
                  <AcademicCapIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">Update Grades</p>
                  <p className="truncate text-sm text-gray-500">Submit student grades</p>
                </div>
              </Link>

              <Link
                href="/reports"
                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-4 py-4 shadow-sm hover:border-gray-400 hover:shadow transition-all duration-200"
              >
                <div className="flex-shrink-0 rounded-md bg-yellow-100 p-2">
                  <ChartBarIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">Generate Report</p>
                  <p className="truncate text-sm text-gray-500">Create academic report</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}