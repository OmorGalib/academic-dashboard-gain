import axios from "axios";
import { Student, Course, Faculty, Grade, DashboardStats } from "@/types";
import { mockData } from "./mockData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Simulated delay for realistic API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(300);
    return mockData.dashboardStats;
  },

  // Students
  async getStudents(params?: {
    search?: string;
    year?: number;
    major?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ students: Student[]; total: number }> {
    await delay(300);
    let filtered = [...mockData.students];

    if (params?.search) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(params.search!.toLowerCase()) ||
          s.email.toLowerCase().includes(params.search!.toLowerCase()) ||
          s.id.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    if (params?.year) {
      filtered = filtered.filter((s) => s.year === params.year);
    }

    if (params?.major && params.major !== 'All Majors') {
      filtered = filtered.filter((s) => s.major === params.major);
    }

    if (params?.status) {
      filtered = filtered.filter((s) => s.status === params.status);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      students: filtered.slice(start, end),
      total: filtered.length,
    };
  },

  async getStudentById(id: string): Promise<Student | undefined> {
    await delay(200);
    return mockData.students.find((s) => s.id === id);
  },

  async createStudent(data: Omit<Student, 'id'>): Promise<Student> {
    await delay(400);
    const newStudent: Student = {
      ...data,
      id: `STU${1000 + mockData.students.length + 1}`,
      avatar: data.name.toLowerCase().replace(/\s+/g, '-')
    };
    mockData.students.push(newStudent);
    return newStudent;
  },

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    await delay(400);
    const index = mockData.students.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Student not found");

    mockData.students[index] = { ...mockData.students[index], ...data };
    return mockData.students[index];
  },

  async deleteStudent(id: string): Promise<void> {
    await delay(300);
    const index = mockData.students.findIndex((s) => s.id === id);
    if (index !== -1) {
      mockData.students.splice(index, 1);
    }
  },

  // Courses
  async getCourses(params?: {
    search?: string;
    department?: string;
    semester?: string;
    page?: number;
    limit?: number;
  }): Promise<{ courses: Course[]; total: number }> {
    await delay(300);
    let filtered = [...mockData.courses];

    if (params?.search) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(params.search!.toLowerCase()) ||
          c.code.toLowerCase().includes(params.search!.toLowerCase()) ||
          c.faculty.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    if (params?.department) {
      filtered = filtered.filter((c) => c.department === params.department);
    }

    if (params?.semester) {
      filtered = filtered.filter((c) => c.semester === params.semester);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      courses: filtered.slice(start, end),
      total: filtered.length,
    };
  },

  async getCourseById(id: string): Promise<Course | undefined> {
    await delay(200);
    return mockData.courses.find((c) => c.id === id);
  },

  // Faculty
  async getFaculty(): Promise<Faculty[]> {
    await delay(300);
    return mockData.faculty;
  },

  async getFacultyById(id: string): Promise<Faculty | undefined> {
    await delay(200);
    return mockData.faculty.find((f) => f.id === id);
  },

  // Grades
  async getStudentGrades(studentId: string): Promise<Grade[]> {
    await delay(200);
    return mockData.grades.filter((g) => g.studentId === studentId);
  },

  async getCourseGrades(courseId: string): Promise<Grade[]> {
    await delay(200);
    return mockData.grades.filter((g) => g.courseId === courseId);
  },

  async updateGrade(data: {
    studentId: string;
    courseId: string;
    grade: string;
    score: number;
  }): Promise<Grade> {
    await delay(400);
    const existing = mockData.grades.find(
      (g) => g.studentId === data.studentId && g.courseId === data.courseId
    );

    if (existing) {
      Object.assign(existing, data);
      return existing;
    }

    const newGrade: Grade = {
      id: `${data.studentId}-${data.courseId}`,
      ...data,
      semester: "Fall 2024",
      year: 2024,
    };

    mockData.grades.push(newGrade);
    return newGrade;
  },

  // Analytics
  async getCourseEnrollments(): Promise<
    { course: string; enrollments: number; capacity: number }[]
  > {
    await delay(300);
    return mockData.courses.map((course) => ({
      course: course.title,
      enrollments: course.enrolledStudents,
      capacity: course.maxCapacity
    }));
  },

  async getTopStudents(limit = 5): Promise<Student[]> {
    await delay(300);
    return [...mockData.students]
      .filter(s => s.status === 'Active')
      .sort((a, b) => b.gpa - a.gpa)
      .slice(0, limit);
  },

  async getPopularCourses(limit = 5): Promise<Course[]> {
    await delay(300);
    return [...mockData.courses]
      .sort((a, b) => b.enrolledStudents - a.enrolledStudents)
      .slice(0, limit);
  },

  async getRecentActivity(): Promise<any[]> {
    await delay(300);
    return [
      { type: 'enrollment', student: 'John Smith', course: 'CSC101', time: '2 hours ago' },
      { type: 'grade_update', student: 'Emma Johnson', course: 'MAT201', grade: 'A+', time: '4 hours ago' },
      { type: 'course_added', course: 'Data Structures', instructor: 'Prof. Smith', time: '1 day ago' },
      { type: 'student_added', student: 'Alex Turner', major: 'Computer Science', time: '2 days ago' },
    ];
  },

  // Export
  async exportData(type: "students" | "courses" | "grades"): Promise<string> {
    await delay(500);
    let data: any[];

    switch (type) {
      case "students":
        data = mockData.students;
        break;
      case "courses":
        data = mockData.courses;
        break;
      case "grades":
        data = mockData.grades;
        break;
      default:
        data = [];
    }

    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => {
          const value = row[header as keyof typeof row];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : String(value);
        }).join(",")
      ),
    ].join("\n");

    return csv;
  },

  // System metrics
  async getSystemMetrics(): Promise<{
    serverStatus: 'online' | 'offline' | 'maintenance';
    responseTime: number;
    activeUsers: number;
    storageUsed: string;
  }> {
    await delay(200);
    return {
      serverStatus: 'online',
      responseTime: 120,
      activeUsers: 42,
      storageUsed: '2.3 GB'
    };
  },
};