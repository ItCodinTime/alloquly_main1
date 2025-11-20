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
    <main className="min-h-screen bg-slate-50 pb-12 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-6 sm:px-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Assignment studio
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">
            Drop any rubric or doc. Alloquly rebuilds it into micro-missions per
            learner with explainable AI steps.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Teachers keep control: change tone, rigor, modalities, and supports.
            AI summaries highlight what changed so you can communicate with
            families, co-teachers, and administrators without guesswork.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {safeguards.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
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
