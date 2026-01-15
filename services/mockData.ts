import { Student, Course, Faculty, Grade, DashboardStats } from "@/types";

export const mockData = {
  dashboardStats: {
    totalStudents: 1542,
    totalCourses: 68,
    totalFaculty: 45,
    averageGPA: 3.45,
    totalEnrollments: 5342,
  },

  students: [
    { id: 'STU1001', name: 'John Smith', email: 'john@uni.edu', year: 3, major: 'Computer Science', gpa: 3.8, status: 'Active', courses: ['CSC101', 'CSC201', 'CSC301'], avatar: 'john-smith' },
    { id: 'STU1002', name: 'Emma Johnson', email: 'emma@uni.edu', year: 2, major: 'Mathematics', gpa: 3.9, status: 'Active', courses: ['MAT101', 'MAT201', 'MAT301'], avatar: 'emma-johnson' },
    { id: 'STU1003', name: 'Michael Brown', email: 'michael@uni.edu', year: 4, major: 'Physics', gpa: 3.6, status: 'Active', courses: ['PHY101', 'PHY201', 'PHY301'], avatar: 'michael-brown' },
    { id: 'STU1004', name: 'Sarah Wilson', email: 'sarah@uni.edu', year: 1, major: 'Biology', gpa: 3.7, status: 'Active', courses: ['BIO101', 'BIO201'], avatar: 'sarah-wilson' },
    { id: 'STU1005', name: 'David Lee', email: 'david@uni.edu', year: 3, major: 'Chemistry', gpa: 3.5, status: 'Active', courses: ['CHE101', 'CHE201', 'CHE301'], avatar: 'david-lee' },
    { id: 'STU1006', name: 'Lisa Wang', email: 'lisa@uni.edu', year: 2, major: 'Computer Science', gpa: 3.9, status: 'Active', courses: ['CSC101', 'CSC201', 'MAT101'], avatar: 'lisa-wang' },
    { id: 'STU1007', name: 'Robert Garcia', email: 'robert@uni.edu', year: 4, major: 'Mathematics', gpa: 3.4, status: 'Active', courses: ['MAT101', 'MAT201', 'MAT401'], avatar: 'robert-garcia' },
    { id: 'STU1008', name: 'Maria Gonzalez', email: 'maria@uni.edu', year: 1, major: 'Physics', gpa: 3.8, status: 'Active', courses: ['PHY101', 'MAT101'], avatar: 'maria-gonzalez' },
    { id: 'STU1009', name: 'James Taylor', email: 'james@uni.edu', year: 3, major: 'Biology', gpa: 3.6, status: 'Active', courses: ['BIO101', 'BIO201', 'CHE101'], avatar: 'james-taylor' },
    { id: 'STU1010', name: 'Jennifer Miller', email: 'jennifer@uni.edu', year: 2, major: 'Chemistry', gpa: 3.7, status: 'Active', courses: ['CHE101', 'CHE201', 'MAT101'], avatar: 'jennifer-miller' },
  ],

  courses: [
    { id: 'CSC101', title: 'Introduction to Computer Science', code: 'CSC101', description: 'Fundamentals of programming and computer science', faculty: 'Prof. Smith', facultyId: 'FAC101', enrolledStudents: 45, maxCapacity: 50, credits: 3, department: 'Computer Science', semester: 'Fall 2024' },
    { id: 'MAT201', title: 'Calculus II', code: 'MAT201', description: 'Advanced calculus topics and applications', faculty: 'Prof. Johnson', facultyId: 'FAC102', enrolledStudents: 189, maxCapacity: 200, credits: 4, department: 'Mathematics', semester: 'Fall 2024' },
    { id: 'PHY101', title: 'Physics I', code: 'PHY101', description: 'Classical mechanics and thermodynamics', faculty: 'Prof. Brown', facultyId: 'FAC103', enrolledStudents: 178, maxCapacity: 180, credits: 4, department: 'Physics', semester: 'Fall 2024' },
    { id: 'BIO101', title: 'Biology Fundamentals', code: 'BIO101', description: 'Introduction to cellular and molecular biology', faculty: 'Prof. Wilson', facultyId: 'FAC104', enrolledStudents: 165, maxCapacity: 170, credits: 3, department: 'Biology', semester: 'Fall 2024' },
    { id: 'CHE101', title: 'General Chemistry', code: 'CHE101', description: 'Principles of chemical reactions and bonding', faculty: 'Prof. Davis', facultyId: 'FAC105', enrolledStudents: 152, maxCapacity: 160, credits: 4, department: 'Chemistry', semester: 'Fall 2024' },
  ],

  faculty: [
    { id: 'FAC101', name: 'Prof. John Smith', email: 'smith@uni.edu', department: 'Computer Science', courses: ['CSC101', 'CSC201', 'CSC301', 'CSC401'] },
    { id: 'FAC102', name: 'Prof. Emma Johnson', email: 'johnson@uni.edu', department: 'Mathematics', courses: ['MAT101', 'MAT201', 'MAT301'] },
    { id: 'FAC103', name: 'Prof. Michael Brown', email: 'brown@uni.edu', department: 'Physics', courses: ['PHY101', 'PHY201', 'PHY301'] },
    { id: 'FAC104', name: 'Prof. Sarah Wilson', email: 'wilson@uni.edu', department: 'Biology', courses: ['BIO101', 'BIO201', 'BIO301'] },
    { id: 'FAC105', name: 'Prof. David Lee', email: 'lee@uni.edu', department: 'Chemistry', courses: ['CHE101', 'CHE201', 'CHE301'] },
  ],

  grades: [
    { id: 'GRD1001', studentId: 'STU1001', courseId: 'CSC101', grade: 'A', score: 95, semester: 'Fall 2024', year: 2024 },
    { id: 'GRD1002', studentId: 'STU1002', courseId: 'MAT201', grade: 'A+', score: 98, semester: 'Fall 2024', year: 2024 },
    { id: 'GRD1003', studentId: 'STU1003', courseId: 'PHY101', grade: 'B+', score: 88, semester: 'Fall 2024', year: 2024 },
    { id: 'GRD1004', studentId: 'STU1004', courseId: 'BIO101', grade: 'A-', score: 90, semester: 'Fall 2024', year: 2024 },
    { id: 'GRD1005', studentId: 'STU1005', courseId: 'CHE101', grade: 'B', score: 85, semester: 'Fall 2024', year: 2024 },
  ],
};