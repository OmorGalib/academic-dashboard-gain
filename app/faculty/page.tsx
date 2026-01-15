'use client'

import { useState, useEffect } from 'react'
import { 
  AcademicCapIcon, 
  EnvelopeIcon, 
  BookOpenIcon, 
  UserPlusIcon,
  PencilIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { apiService } from '@/services/api'
import { Faculty, Student, Course } from '@/types'

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showGradeForm, setShowGradeForm] = useState(false)
  const [showAssignForm, setShowAssignForm] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [facultyData, studentsData, coursesData] = await Promise.all([
        apiService.getFaculty(),
        apiService.getStudents({}),
        apiService.getCourses({})
      ])
      setFaculty(facultyData)
      setStudents(studentsData.students)
      setCourses(coursesData.courses)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateGrade = async (data: {
    studentId: string;
    courseId: string;
    grade: string;
    score: number;
  }) => {
    try {
      await apiService.updateGrade(data)
      alert('Grade updated successfully!')
      setShowGradeForm(false)
    } catch (error) {
      console.error('Error updating grade:', error)
      alert('Failed to update grade')
    }
  }

  const handleAssignStudent = async (studentId: string, courseId: string) => {
    try {
      // In a real app, you would have an API for this
      alert(`Student ${studentId} assigned to course ${courseId}`)
      setShowAssignForm(false)
    } catch (error) {
      console.error('Error assigning student:', error)
      alert('Failed to assign student')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faculty Panel</h1>
          <p className="text-gray-600 mt-1">Manage faculty members and their assignments</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowGradeForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Update Grades
          </button>
          <button 
            onClick={() => setShowAssignForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
          >
            <UserGroupIcon className="h-5 w-5 mr-2" />
            Assign Student
          </button>
        </div>
      </div>

      {/* Grade Update Form Modal */}
      {showGradeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Student Grade</h3>
              <GradeUpdateForm 
                students={students}
                courses={courses}
                onSubmit={handleUpdateGrade}
                onCancel={() => setShowGradeForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Assign Student Form Modal */}
      {showAssignForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Student to Course</h3>
              <AssignStudentForm 
                students={students}
                courses={courses}
                onSubmit={handleAssignStudent}
                onCancel={() => setShowAssignForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Faculty Grid */}
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
                <button 
                  onClick={() => {
                    setSelectedFaculty(fac)
                    setShowGradeForm(true)
                  }}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                >
                  Manage Grades
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Grade Update Form Component
function GradeUpdateForm({ 
  students, 
  courses, 
  onSubmit, 
  onCancel 
}: { 
  students: Student[], 
  courses: Course[], 
  onSubmit: (data: any) => void,
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    grade: 'A',
    score: 90
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Student
        </label>
        <select
          value={formData.studentId}
          onChange={(e) => setFormData({...formData, studentId: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
          required
        >
          <option value="">Select Student</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.name} ({student.id})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course
        </label>
        <select
          value={formData.courseId}
          onChange={(e) => setFormData({...formData, courseId: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
          required
        >
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Grade
        </label>
        <select
          value={formData.grade}
          onChange={(e) => setFormData({...formData, grade: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
        >
          <option value="A+">A+ (97-100)</option>
          <option value="A">A (93-96)</option>
          <option value="A-">A- (90-92)</option>
          <option value="B+">B+ (87-89)</option>
          <option value="B">B (83-86)</option>
          <option value="B-">B- (80-82)</option>
          <option value="C+">C+ (77-79)</option>
          <option value="C">C (73-76)</option>
          <option value="C-">C- (70-72)</option>
          <option value="D+">D+ (67-69)</option>
          <option value="D">D (63-66)</option>
          <option value="D-">D- (60-62)</option>
          <option value="F">F (0-59)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Score (0-100)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={formData.score}
          onChange={(e) => setFormData({...formData, score: parseInt(e.target.value)})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Update Grade
        </button>
      </div>
    </form>
  )
}

// Assign Student Form Component
function AssignStudentForm({ 
  students, 
  courses, 
  onSubmit, 
  onCancel 
}: { 
  students: Student[], 
  courses: Course[], 
  onSubmit: (studentId: string, courseId: string) => void,
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData.studentId, formData.courseId)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Student
        </label>
        <select
          value={formData.studentId}
          onChange={(e) => setFormData({...formData, studentId: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
          required
        >
          <option value="">Select Student</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.name} ({student.major}, Year {student.year})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course
        </label>
        <select
          value={formData.courseId}
          onChange={(e) => setFormData({...formData, courseId: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
          required
        >
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.title} ({course.faculty})
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Assign Student
        </button>
      </div>
    </form>
  )
}