import { redirect } from "next/navigation";
import AssignmentRemodeler from "@/components/assignment-remodeler";
import InsightPanel from "@/components/insight-panel";
import { createServerClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Alloquy Assignments | AI Builder + Remodeler",
  description:
    "Upload any assignment, pick neuro profiles, and push polished missions with auditable AI summaries.",
};

export default async function AssignmentsPage() {
  const supabase = await createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle();
  if (!profile) redirect("/onboarding");
  if (profile.role !== "teacher") redirect("/student/dashboard");

  const { data: classes } = await supabase
    .from("classes")
    .select("id,name,section")
    .eq("teacher_id", session.user.id)
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen bg-slate-50 pb-12 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-6 sm:px-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Assignment studio</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">
            Drop any rubric or doc. Alloquy rebuilds it into chunked missions per learner with explainable AI steps.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Teachers keep control: change tone, rigor, modalities, and supports. AI summaries highlight what changed so you
            can communicate with families, co-teachers, and administrators without guesswork.
          </p>
        </section>

        <AssignmentRemodeler classes={classes ?? []} />
        <InsightPanel />
      </div>
    </main>
  );
}
