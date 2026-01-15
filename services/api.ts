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
    page?: number;
    limit?: number;
  }): Promise<{ students: Student[]; total: number }> {
    await delay(300);
    let filtered = [...mockData.students];

    if (params?.search) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(params.search!.toLowerCase()) ||
          s.email.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    if (params?.year) {
      filtered = filtered.filter((s) => s.year === params.year);
    }

    if (params?.major) {
      filtered = filtered.filter((s) => s.major === params.major);
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

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    await delay(400);
    const index = mockData.students.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Student not found");

    mockData.students[index] = { ...mockData.students[index], ...data };
    return mockData.students[index];
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
          c.code.toLowerCase().includes(params.search!.toLowerCase())
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

  // Faculty
  async getFaculty(): Promise<Faculty[]> {
    await delay(300);
    return mockData.faculty;
  },

  // Grades
  async getStudentGrades(studentId: string): Promise<Grade[]> {
    await delay(200);
    return mockData.grades.filter((g) => g.studentId === studentId);
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

  // Reports
  async getCourseEnrollments(): Promise<
    { course: string; enrollments: number }[]
  > {
    await delay(300);
    return mockData.courses.map((course) => ({
      course: course.title,
      enrollments: course.enrolledStudents,
    }));
  },

  async getTopStudents(limit = 10): Promise<Student[]> {
    await delay(300);
    return [...mockData.students].sort((a, b) => b.gpa - a.gpa).slice(0, limit);
  },

  async getPopularCourses(limit = 10): Promise<Course[]> {
    await delay(300);
    return [...mockData.courses]
      .sort((a, b) => b.enrolledStudents - a.enrolledStudents)
      .slice(0, limit);
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

    const headers = Object.keys(data[0] || {});
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => JSON.stringify((row as any)[header])).join(",")
      ),
    ].join("\n");

    return csv;
  },
};
