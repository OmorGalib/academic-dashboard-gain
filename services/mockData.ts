import { Student, Course, Faculty, Grade, DashboardStats } from "@/types";

const generateMockData = () => {
  const students: Student[] = Array.from({ length: 50 }, (_, i) => ({
    id: `STU${1000 + i}`,
    name: `Student ${i + 1}`,
    email: `student${i + 1}@university.edu`,
    year: Math.floor(Math.random() * 4) + 1,
    major: [
      "Computer Science",
      "Mathematics",
      "Physics",
      "Biology",
      "Chemistry",
    ][Math.floor(Math.random() * 5)],
    gpa: parseFloat((Math.random() * 2 + 2).toFixed(2)),
    courses: Array.from(
      { length: Math.floor(Math.random() * 5) + 3 },
      (_, j) => `CSC${100 + j}`
    ),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=student${i}`,
  }));

  const courses: Course[] = Array.from({ length: 15 }, (_, i) => ({
    id: `CSC${100 + i}`,
    title: [
      "Algorithms",
      "Data Structures",
      "Calculus",
      "Biology 101",
      "Chemistry Lab",
      "Physics I",
      "Web Development",
      "Database Systems",
    ][i % 8],
    code: `CSC${100 + i}`,
    description: `Description for course ${i + 1}`,
    faculty: `Prof. ${
      ["Smith", "Johnson", "Williams", "Brown", "Jones"][i % 5]
    }`,
    facultyId: `FAC${100 + i}`,
    enrolledStudents: Math.floor(Math.random() * 30) + 10,
    maxCapacity: 40,
    credits: 3,
    department: ["Computer Science", "Mathematics", "Science", "Engineering"][
      i % 4
    ],
    semester: ["Fall", "Spring"][i % 2],
  }));

  const faculty: Faculty[] = Array.from({ length: 10 }, (_, i) => ({
    id: `FAC${100 + i}`,
    name: `Prof. ${
      [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Garcia",
        "Miller",
        "Davis",
      ][i % 8]
    }`,
    email: `prof${i + 1}@university.edu`,
    department: [
      "Computer Science",
      "Mathematics",
      "Physics",
      "Biology",
      "Chemistry",
    ][Math.floor(Math.random() * 5)],
    courses: Array.from({ length: 3 }, (_, j) => `CSC${100 + j}`),
  }));

  const grades: Grade[] = students.flatMap((student) =>
    student.courses.map((courseId) => ({
      id: `${student.id}-${courseId}`,
      studentId: student.id,
      courseId,
      grade: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
      score: Math.floor(Math.random() * 40) + 60,
      semester: "Fall 2024",
      year: 2024,
    }))
  );

  const dashboardStats: DashboardStats = {
    totalStudents: students.length,
    totalCourses: courses.length,
    totalFaculty: faculty.length,
    averageGPA: parseFloat(
      (students.reduce((acc, s) => acc + s.gpa, 0) / students.length).toFixed(2)
    ),
    totalEnrollments: courses.reduce((acc, c) => acc + c.enrolledStudents, 0),
  };

  return { students, courses, faculty, grades, dashboardStats };
};

export const mockData = generateMockData();
