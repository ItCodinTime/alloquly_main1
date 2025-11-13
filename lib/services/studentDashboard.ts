import { mockStudentDashboardData, StudentDashboardData } from "@/lib/mocks/studentDashboard";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchStudentDashboard(studentId: string): Promise<StudentDashboardData> {
  await delay(320);
  return {
    ...mockStudentDashboardData,
    profile: {
      ...mockStudentDashboardData.profile,
      id: studentId,
    },
  };
}
