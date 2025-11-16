export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: "teacher" | "student";
}

const mockTeacher: MockUser = {
  id: "teacher-001",
  name: "Sahasra Joginipally",
  email: "sahasra.joginipally@example.com",
  role: "teacher",
};

const mockStudent: MockUser = {
  id: "student-431",
  name: "Jordan Kumar",
  email: "jordan.kumar@example.com",
  role: "student",
};

export function getMockUser(role: MockUser["role"] = "teacher"): MockUser {
  return role === "student" ? mockStudent : mockTeacher;
}
