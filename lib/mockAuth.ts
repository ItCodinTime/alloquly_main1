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

export function getMockUser(): MockUser {
  return mockTeacher;
}
