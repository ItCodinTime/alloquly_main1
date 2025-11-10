import AssignmentRemodeler from "@/components/assignment-remodeler";
import ClassroomManager from "@/components/classroom-manager";
import InsightPanel from "@/components/insight-panel";
import StudentWorkspace from "@/components/student-workspace";

const heroStats = [
  { label: "District pilots", value: "37" },
  { label: "Assignments re-modeled", value: "12.4K" },
  { label: "Avg. prep time saved", value: "94%" },
];

const pipeline = [
  {
    title: "Upload or draft",
    detail: "Docs, PDFs, audio notes, or blank canvas. Detects tone + rigor instantly.",
  },
  {
    title: "Remodel per learner",
    detail: "ADHD, Autism, Dyslexia presets plus custom blends per IEP / 504 plan.",
  },
  {
    title: "Share + monitor",
    detail: "Invite via Gmail, Classroom, or SSO. Students work in distraction-free mode.",
  },
  {
    title: "AI insight coach",
    detail: "Edge models surface friction, regulation, and compliance notes you can trust.",
  },
];

const securityHighlights = [
  "No student data stored on device; all sensitive calls stay on Vercel edge.",
  "Key rotation + env isolation. Secrets live in `.env.local` and Vercel env UI.",
  "Optional audit log stream for districts that need SOC2 evidence.",
];

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden px-4 py-12 text-white sm:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,.09),_transparent_55%)] blur-3xl" />
        <div className="absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(circle_at_bottom,_rgba(255,255,255,.05),_transparent_50%)] blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <header className="relative z-10 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.55)] sm:p-12">
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-zinc-400">
            <span className="rounded-full border border-white/20 px-4 py-1 text-white">
              Alloquly
            </span>
            <span>Neuroinclusive assignment studio</span>
            <span className="text-emerald-300">Edge secured</span>
          </div>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <h1 className="text-4xl leading-tight text-white sm:text-5xl sm:leading-tight">
                Upload any assignment. Alloquly remodels it for ADHD, Autism,
                dyslexia, and every learner in one polished workspace.
              </h1>
              <p className="max-w-2xl text-lg text-zinc-400">
                Teachers upload or draft assignments, toggle accommodations, invite
                students via Gmail, and watch AI insights surface the exact support each
                learner needs. Built for Vercel + iPad classrooms with a calm,
                black-and-white interface.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <button className="rounded-full border border-white px-6 py-3 font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white">
                  Launch live demo
                </button>
                <button className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:border-white hover:bg-white/10">
                  Share with my district
                </button>
              </div>
              <div className="grid gap-4 text-sm text-zinc-400 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl text-white">{stat.value}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_25px_100px_rgba(0,0,0,0.55)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Trusted rails
              </p>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                {securityHighlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl border border-dashed border-white/20 p-4 text-xs text-zinc-400">
                `.env.local` stays out of git. Set <code>ALLOQULY_AI_API_KEY</code>{" "}
                locally and inside Vercel → Settings → Environment Variables.
              </div>
            </div>
          </div>
        </header>

        <section className="relative z-10 grid gap-6 lg:grid-cols-2">
          <AssignmentRemodeler />
          <InsightPanel />
        </section>

        <section className="relative z-10 grid gap-6 lg:grid-cols-2">
          <ClassroomManager />
          <StudentWorkspace />
        </section>

        <section className="relative z-10 rounded-[2.5rem] border border-white/10 bg-white/5 p-6 shadow-[0_35px_120px_rgba(0,0,0,0.55)] sm:p-10">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
            <span className="h-px w-10 bg-white/40" />
            Flight plan
          </div>
          <h2 className="mt-4 text-3xl text-white sm:text-4xl">
            Everything a teacher needs: upload, remodel, assign, monitor, and
            reflect—with AI that is explainable to families.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {pipeline.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-black/40 p-4"
              >
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm text-zinc-400">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <button className="rounded-full border border-white px-6 py-3 font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white">
              Book a 20 min build
            </button>
            <button className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:border-white hover:bg-white/10">
              Deploy to Vercel
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
