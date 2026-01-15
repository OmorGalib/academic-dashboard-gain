export interface Student {
  id: string;
  name: string;
  email: string;
  year: number;
  major: string;
  gpa: number;
  status: 'Active' | 'Inactive' | 'Graduated';
  courses: string[];
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  faculty: string;
  facultyId: string;
  enrolledStudents: number;
  maxCapacity: number;
  credits: number;
  department: string;
  semester: string;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  courses: string[];
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  grade: string;
  score: number;
  semester: string;
  year: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  status: "active" | "completed" | "dropped";
}

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalFaculty: number;
  averageGPA: number;
  totalEnrollments: number;
}
