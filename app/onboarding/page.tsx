"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "teacher" | "student";

type ProfileResponse = {
  profile?: {
    role: Role;
    is_onboarded?: boolean;
    school_name?: string;
    district?: string;
    subjects?: string[];
    grades_taught?: string[];
    grade_level?: string;
    preferred_grading_scale?: string;
    accommodations?: {
      selections?: string[];
      notes?: string;
    };
  } | null;
};

const TEACHER_SUBJECT_OPTIONS = [
  "ELA",
  "Math",
  "Science",
  "Social Studies",
  "Special Education",
  "Electives",
];

const TEACHER_GRADE_OPTIONS = ["K-2", "3-5", "6-8", "9-12"];

const GRADING_SCALE_OPTIONS = ["Standards-based", "Percentage", "Points", "Rubric"];

const STUDENT_ACCOMMODATION_OPTIONS = [
  "Extended time",
  "Chunked instructions",
  "Audio support",
  "Visual schedule",
  "Calming breaks",
];

type Step = 1 | 2 | 3;

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-10">
        <header className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-300">Welcome to Alloquly</p>
          <h1 className="text-3xl font-semibold">Let’s tailor your classroom experience</h1>
          <p className="text-sm text-slate-400">
            We’ll use this info to personalize assignments, grading tools, and insights. It takes less than two minutes.
          </p>
        </header>
        <OnboardingWizard />
      </div>
    </main>
  );
}

function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [district, setDistrict] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [gradesTaught, setGradesTaught] = useState<string[]>([]);
  const [preferredScale, setPreferredScale] = useState(GRADING_SCALE_OPTIONS[0]);
  const [gradeLevel, setGradeLevel] = useState("");
  const [studentAccommodations, setStudentAccommodations] = useState<string[]>([]);
  const [accommodationNotes, setAccommodationNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const destinations = useMemo(
    () => ({
      teacher: "/teacher/dashboard",
      student: "/student/dashboard",
    }),
    [],
  );

  const reroute = useCallback(
    (selectedRole: Role) => {
      const dest = destinations[selectedRole] ?? "/assignments";
      router.replace(dest);
    },
    [destinations, router],
  );

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile", { cache: "no-store" });
        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }
        const payload = await safeJson<ProfileResponse>(res);
        if (!payload) {
          setMessage("Unable to load your profile. Please refresh and try again.");
          return;
        }
        if (payload.profile?.is_onboarded) {
          reroute(payload.profile.role);
          return;
        }
        if (payload.profile) {
          const profile = payload.profile;
          setRole(profile.role);
          setSchoolName(profile.school_name ?? "");
          setDistrict(profile.district ?? "");
          setSubjects(profile.subjects ?? []);
          setGradesTaught(profile.grades_taught ?? []);
          setGradeLevel(profile.grade_level ?? "");
          setPreferredScale(profile.preferred_grading_scale ?? GRADING_SCALE_OPTIONS[0]);
          setStudentAccommodations(profile.accommodations?.selections ?? []);
          setAccommodationNotes(profile.accommodations?.notes ?? "");
        }
      } catch (error) {
        console.error("Onboarding profile load error", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [reroute, router]);

  useEffect(() => {
    setMessage(null);
  }, [step]);

  const handleNext = () => {
    if (step === 1) {
      if (!role) {
        setMessage("Select whether you are a teacher or a student.");
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      const validationError = validateDetails();
      if (validationError) {
        setMessage(validationError);
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 1) return;
    setStep((prev) => (prev - 1) as Step);
  };

  const validateDetails = () => {
    if (!role) return "Select a role to continue.";
    if (!schoolName.trim()) return "School name is required.";

    if (role === "teacher") {
      if (!district.trim()) return "District is required for teachers.";
      if (subjects.length === 0) return "Select at least one subject.";
    }

    if (role === "student" && !gradeLevel.trim()) {
      return "Grade level is required for students.";
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!role) return;
    const errorMsg = validateDetails();
    if (errorMsg) {
      setMessage(errorMsg);
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          schoolName,
          district,
          subjects,
          gradesTaught,
          gradeLevel,
          preferredGradingScale: preferredScale,
          accommodations: {
            selections: role === "student" ? studentAccommodations : [],
            notes: accommodationNotes,
          },
        }),
      });
      const raw = await response.text();
      let payload: { error?: string } | null = null;
      if (raw) {
        try {
          payload = JSON.parse(raw) as { error?: string };
        } catch (err) {
          console.error("Profile submit parse error", err);
        }
      }

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to save profile.");
      }
      reroute(role);
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-white shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
        Checking your profile…
      </section>
    );
  }

  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
      <StepIndicator current={step} />
      {step === 1 && <RoleStep currentRole={role} onSelect={setRole} />}
      {step === 2 && (
        <DetailsStep
          role={role}
          schoolName={schoolName}
          district={district}
          subjects={subjects}
          gradesTaught={gradesTaught}
          gradeLevel={gradeLevel}
          preferredScale={preferredScale}
          studentAccommodations={studentAccommodations}
          accommodationNotes={accommodationNotes}
          onChange={{
            setSchoolName,
            setDistrict,
            setSubjects,
            setGradesTaught,
            setGradeLevel,
            setPreferredScale,
            setStudentAccommodations,
            setAccommodationNotes,
          }}
        />
      )}
      {step === 3 && (
        <ConfirmationStep
          role={role}
          schoolName={schoolName}
          district={district}
          subjects={subjects}
          gradesTaught={gradesTaught}
          gradeLevel={gradeLevel}
          preferredScale={preferredScale}
          studentAccommodations={studentAccommodations}
          accommodationNotes={accommodationNotes}
        />
      )}

      {message && <p className="text-sm text-amber-200">{message}</p>}

      <div className="flex flex-wrap justify-between gap-3">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="rounded-full border border-white/30 px-5 py-2 text-sm text-white transition hover:border-white"
          >
            Back
          </button>
        ) : (
          <div />
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="rounded-full border border-white bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-full border border-white bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Finish setup"}
          </button>
        )}
      </div>
    </section>
  );
}

async function safeJson<T>(res: Response): Promise<T | null> {
  try {
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch (err) {
    console.error("JSON parse error", err);
    return null;
  }
}

function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { id: 1, label: "Role" },
    { id: 2, label: "Details" },
    { id: 3, label: "Confirm" },
  ];
  return (
    <div className="flex items-center justify-center gap-4">
      {steps.map((step) => (
        <div key={step.id} className="flex items-center gap-2 text-xs uppercase tracking-[0.3em]">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] ${
              current === step.id ? "border-white bg-white text-slate-900" : "border-white/30 text-white/70"
            }`}
          >
            {step.id}
          </span>
          <span className={current === step.id ? "text-white" : "text-white/60"}>{step.label}</span>
        </div>
      ))}
    </div>
  );
}

function RoleStep({ currentRole, onSelect }: { currentRole: Role | null; onSelect: (role: Role) => void }) {
  const cards = [
    {
      role: "teacher" as Role,
      title: "Teacher",
      copy: "Create classes, design assignments, and monitor student insights.",
    },
    {
      role: "student" as Role,
      title: "Student",
      copy: "Join classes, complete missions, and track your learning progress.",
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => {
        const active = currentRole === card.role;
        return (
          <button
            key={card.role}
            type="button"
            onClick={() => onSelect(card.role)}
            className={`rounded-3xl border p-5 text-left transition ${
              active ? "border-white bg-white/20 text-white" : "border-white/20 bg-white/5 text-slate-200 hover:border-white/40"
            }`}
          >
            <p className="text-lg font-semibold">{card.title}</p>
            <p className="mt-3 text-sm text-slate-300">{card.copy}</p>
          </button>
        );
      })}
    </div>
  );
}

type DetailsStepProps = {
  role: Role | null;
  schoolName: string;
  district: string;
  subjects: string[];
  gradesTaught: string[];
  gradeLevel: string;
  preferredScale: string;
  studentAccommodations: string[];
  accommodationNotes: string;
  onChange: {
    setSchoolName: (value: string) => void;
    setDistrict: (value: string) => void;
    setSubjects: (value: string[]) => void;
    setGradesTaught: (value: string[]) => void;
    setGradeLevel: (value: string) => void;
    setPreferredScale: (value: string) => void;
    setStudentAccommodations: (value: string[]) => void;
    setAccommodationNotes: (value: string) => void;
  };
};

function DetailsStep({
  role, 
  schoolName,
  district,
  subjects,
  gradesTaught,
  gradeLevel,
  preferredScale,
  studentAccommodations,
  accommodationNotes,
  onChange,
}: DetailsStepProps) {
  if (!role) {
    return <p className="text-sm text-slate-300">Select a role to continue.</p>;
  }
  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs uppercase tracking-[0.3em] text-slate-300">School name</label>
        <input
          value={schoolName}
          onChange={(event) => onChange.setSchoolName(event.target.value)}
          placeholder="E.g., Lakeview Middle School"
          className="mt-1 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-white focus:outline-none"
        />
      </div>
      {role === "teacher" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-300">District</label>
              <input
                value={district}
                onChange={(event) => onChange.setDistrict(event.target.value)}
                placeholder="E.g., Seattle Public Schools"
                className="mt-1 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-300">Preferred grading scale</label>
              <select
                value={preferredScale}
                onChange={(event) => onChange.setPreferredScale(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white focus:border-white focus:outline-none"
              >
                {GRADING_SCALE_OPTIONS.map((scale) => (
                  <option key={scale} value={scale} className="bg-slate-900 text-white">
                    {scale}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <MultiSelectChips
            label="Subjects you teach"
            options={TEACHER_SUBJECT_OPTIONS}
            selected={subjects}
            onToggle={(value) =>
              onChange.setSubjects(
                subjects.includes(value) ? subjects.filter((item) => item !== value) : [...subjects, value],
              )
            }
          />
          <MultiSelectChips
            label="Grades you support (optional)"
            options={TEACHER_GRADE_OPTIONS}
            selected={gradesTaught}
            onToggle={(value) =>
              onChange.setGradesTaught(
                gradesTaught.includes(value) ? gradesTaught.filter((item) => item !== value) : [...gradesTaught, value],
              )
            }
          />
        </>
      )}
      {role === "student" && (
        <>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-slate-300">Grade level</label>
            <input
              value={gradeLevel}
              onChange={(event) => onChange.setGradeLevel(event.target.value)}
              placeholder="E.g., 8th grade"
              className="mt-1 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-white focus:outline-none"
            />
          </div>
          <CheckboxGrid
            label="Supports that help you most"
            options={STUDENT_ACCOMMODATION_OPTIONS}
            selected={studentAccommodations}
            onToggle={(value) =>
              onChange.setStudentAccommodations(
                studentAccommodations.includes(value)
                  ? studentAccommodations.filter((item) => item !== value)
                  : [...studentAccommodations, value],
              )
            }
          />
        </>
      )}
      <div>
        <label className="text-xs uppercase tracking-[0.3em] text-slate-300">
          {role === "teacher" ? "Notes about differentiation or supports" : "Anything else we should know?"}
        </label>
        <textarea
          value={accommodationNotes}
          onChange={(event) => onChange.setAccommodationNotes(event.target.value)}
          placeholder={
            role === "teacher"
              ? "E.g., prefer chunked missions, embedded timers, SEL check-ins."
              : "E.g., I do best with quiet spaces, visual cues, or calming music."
          }
          className="mt-1 min-h-[100px] w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-white focus:outline-none"
        />
      </div>
    </div>
  );
}

function MultiSelectChips({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              type="button"
              key={option}
              onClick={() => onToggle(option)}
              className={`rounded-full border px-4 py-1 text-xs ${
                active ? "border-white bg-white text-slate-900" : "border-white/20 text-slate-200"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CheckboxGrid({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{label}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="h-4 w-4 rounded border-white/30 bg-transparent text-indigo-500 focus:ring-indigo-500"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ConfirmationStep({
  role,
  schoolName,
  district,
  subjects,
  gradesTaught,
  gradeLevel,
  preferredScale,
  studentAccommodations,
  accommodationNotes,
}: {
  role: Role | null;
  schoolName: string;
  district: string;
  subjects: string[];
  gradesTaught: string[];
  gradeLevel: string;
  preferredScale: string;
  studentAccommodations: string[];
  accommodationNotes: string;
}) {
  if (!role) return null;
  return (
    <div className="space-y-4 rounded-2xl border border-white/15 bg-white/5 p-4">
      <h2 className="text-lg font-semibold">Review details</h2>
      <div className="space-y-2 text-sm text-slate-200">
        <p>
          <span className="font-semibold">Role:</span> {role === "teacher" ? "Teacher" : "Student"}
        </p>
        <p>
          <span className="font-semibold">School:</span> {schoolName}
        </p>
        {role === "teacher" && (
          <>
            <p>
              <span className="font-semibold">District:</span> {district || "—"}
            </p>
            <p>
              <span className="font-semibold">Subjects:</span> {subjects.length ? subjects.join(", ") : "—"}
            </p>
            <p>
              <span className="font-semibold">Grades taught:</span> {gradesTaught.length ? gradesTaught.join(", ") : "—"}
            </p>
            <p>
              <span className="font-semibold">Grading scale:</span> {preferredScale}
            </p>
          </>
        )}
        {role === "student" && (
          <>
            <p>
              <span className="font-semibold">Grade level:</span> {gradeLevel || "—"}
            </p>
            <p>
              <span className="font-semibold">Supports:</span> {studentAccommodations.length ? studentAccommodations.join(", ") : "—"}
            </p>
          </>
        )}
        <p>
          <span className="font-semibold">Notes:</span> {accommodationNotes || "None"}
        </p>
      </div>
    </div>
  );
}
