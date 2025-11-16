import AssignmentRemodeler from "@/components/assignment-remodeler";
import InsightPanel from "@/components/insight-panel";

const safeguards = [
  "PII never leaves Vercel edge functions.",
  "Every rewrite is logged with timestamp + editor ID.",
  "Transparent JSON output means admins can audit changes.",
  "Teachers can export original + adapted versions together.",
];

export const metadata = {
  title: "Alloquly Assignments | Upload, Remodel, Ship",
  description:
    "Upload any assignment, pick neuro profiles, and push polished missions with auditable AI summaries.",
};

export default function AssignmentsPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden pb-12 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,.05),_transparent_55%)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_35px_120px_rgba(0,0,0,0.55)] sm:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Assignment studio
          </p>
          <h1 className="mt-4 text-4xl text-white sm:text-5xl">
            Drop any rubric or doc. Alloquly rebuilds it into micro-missions per
            learner with explainable AI steps.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-zinc-400">
            Teachers keep control: change tone, rigor, modalities, and supports.
            AI summaries highlight what changed so you can communicate with
            families, co-teachers, and administrators without guesswork.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {safeguards.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-300"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <AssignmentRemodeler />
        <InsightPanel />
      </div>
    </main>
  );
}
