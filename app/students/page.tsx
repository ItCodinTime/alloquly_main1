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
    <main className="relative isolate min-h-screen overflow-hidden pb-12 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,255,255,.05),_transparent_55%)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_35px_120px_rgba(0,0,0,0.55)] sm:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Student experience
          </p>
          <h1 className="mt-4 text-4xl text-white sm:text-5xl">
            Invite students, lock accommodations, and watch AI flag regulation
            needs before they derail learning.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-zinc-400">
            Rosters sync with Gmail and Classroom. Each learner gets a focus board
            with timers, calm scenes, and multi-modal response options. Teachers
            see statuses shift in real time.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="rounded-3xl border border-white/10 bg-black/40 p-4"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {badge.label}
                </p>
                <p className="mt-2 text-sm text-zinc-300">{badge.detail}</p>
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
