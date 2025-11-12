import { mockTeacherDashboardData, TeacherDashboardData } from "@/lib/mocks/teacherDashboard";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchTeacherDashboard(teacherId: string): Promise<TeacherDashboardData> {
  // TODO: Replace with real API/DB request once authentication is wired up.
  await delay(350);
  return {
    ...mockTeacherDashboardData,
    profile: {
      ...mockTeacherDashboardData.profile,
      id: teacherId,
    },
  };
}
