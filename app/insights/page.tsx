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
    <main className="relative isolate min-h-screen overflow-hidden pb-12 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,.06),_transparent_60%)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_35px_120px_rgba(0,0,0,0.55)] sm:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Insights + compliance
          </p>
          <h1 className="mt-4 text-4xl text-white sm:text-5xl">
            AI coach surfaces focus, reading load, and regulation signals—with
            documentation your district can trust.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-zinc-400">
            Signals run locally and redact all student identifiers. Export PDF or
            JSON packets for IEP meetings, share insight snapshots with SEL teams,
            and monitor compliance streaks in one screen.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-3xl border border-white/10 bg-black/40 p-4"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {metric.label}
                </p>
                <p className="mt-3 text-2xl text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        </section>

        <InsightPanel />

        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:p-10">
          <h2 className="text-2xl text-white">Compliance cockpit</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Connect your district SSO + logging destination to stream anonymized
            telemetry. Nothing leaves the project without your API key.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {compliance.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-black/40 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <span className="rounded-full border border-white/15 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-zinc-400">
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
