import InsightPanel from "@/components/insight-panel";

const compliance = [
  {
    title: "IEP alignment",
    detail: "Every accommodation is mapped back to service minutes + goals.",
    status: "Live",
  },
  {
    title: "FERPA + SOC2 logging",
    detail: "Edge logs stream to your district SIEM with anonymized IDs.",
    status: "Configured",
  },
  {
    title: "Family summaries",
    detail: "Auto-generate weekly summaries families can read or listen to.",
    status: "Beta",
  },
];

const metrics = [
  { label: "Signals tracked", value: "24" },
  { label: "Avg. alert response", value: "3m" },
  { label: "Regulation wins", value: "82%" },
];

export const metadata = {
  title: "Alloquly Insights | AI Coach + Compliance Radar",
  description:
    "Monitor focus, regulation, and accommodation fidelity with auditable AI insights.",
};

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-12 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-6 sm:px-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Insights + compliance
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">
            AI coach surfaces focus, reading load, and regulation signals—with
            documentation your district can trust.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Signals run locally and redact all student identifiers. Export PDF or
            JSON packets for IEP meetings, share insight snapshots with SEL teams,
            and monitor compliance streaks in one screen.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {metric.label}
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">{metric.value}</p>
              </div>
            ))}
          </div>
        </section>

        <InsightPanel />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold text-slate-900">Compliance cockpit</h2>
          <p className="mt-2 text-sm text-slate-600">
            Connect your district SSO + logging destination to stream anonymized
            telemetry. Nothing leaves the project without your API key.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {compliance.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-500">
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
