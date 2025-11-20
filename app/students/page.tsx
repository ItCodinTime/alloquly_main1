import ClassroomManager from "@/components/classroom-manager";
import StudentWorkspace from "@/components/student-workspace";

const trustBadges = [
  { label: "Gmail verified", detail: "Students join with school Gmail; no shared passwords." },
  { label: "Role-based controls", detail: "Co-teachers, paras, and therapists get scoped access." },
  { label: "Device-friendly", detail: "Chromebook, iPad, and desktop layouts auto-adapt." },
];

export const metadata = {
  title: "Alloquly Students | Rosters, Workspaces, Regulation",
  description:
    "Invite Gmail accounts, monitor progress, and sync regulation supports across devices.",
};

export default function StudentsPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-12 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-6 sm:px-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Student experience
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">
            Invite students, lock accommodations, and watch AI flag regulation
            needs before they derail learning.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Rosters sync with Gmail and Classroom. Each learner gets a focus board
            with timers, calm scenes, and multi-modal response options. Teachers
            see statuses shift in real time.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {badge.label}
                </p>
                <p className="mt-2 text-sm text-slate-700">{badge.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <ClassroomManager />
        <StudentWorkspace />
      </div>
    </main>
  );
}
