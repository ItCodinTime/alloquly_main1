"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { mockTeacherDashboardData } from "@/lib/mocks/teacherDashboard";

type PersonaKey = "adhd" | "autism" | "dyslexia" | "visual" | "hearing" | "generic";

const MAX_FILE_CHARS = 8000;
const MAX_PREVIEW_CHARS = 600;

const personaDetails: Record<
  PersonaKey,
  {
    label: string;
    helper: string;
  }
> = {
  adhd: { label: "Executive support", helper: "Chunked steps, timers, reminders" },
  autism: { label: "Predictable flow", helper: "Sensory-aware, literal language" },
  dyslexia: { label: "Reading support", helper: "Plain language, short blocks" },
  visual: { label: "Vision-friendly", helper: "Descriptive text, audio pairing" },
  hearing: { label: "Hearing-friendly", helper: "Text-first, caption cues" },
  generic: { label: "General scaffold", helper: "Universal accessibility basics" },
};

const personaMatchers: { key: PersonaKey; patterns: RegExp[] }[] = [
  { key: "visual", patterns: [/visual/, /vision/, /sight/, /screen reader/, /audio narration/, /large print/] },
  { key: "hearing", patterns: [/hearing/, /caption/, /asl/, /sign/, /amplification/] },
  { key: "dyslexia", patterns: [/dyslexia/, /reading/, /phonics/, /decoding/, /text/, /simplified vocabulary/] },
  { key: "autism", patterns: [/sensory/, /autism/, /aac/, /social narrative/, /predictable/, /noise-canceling/] },
  { key: "adhd", patterns: [/adhd/, /check[-\s]?ins/, /chunk/, /focus/, /executive/, /processing time/, /timer/] },
];

const inferPersonaFromAccommodations = (accommodations: string[]): PersonaKey => {
  const joined = accommodations.join(" ").toLowerCase();
  for (const matcher of personaMatchers) {
    if (matcher.patterns.some((pattern) => pattern.test(joined))) {
      return matcher.key;
    }
  }
  return "generic";
};

type StudentDraftState = {
  status: "idle" | "pending" | "done" | "error";
  persona: PersonaKey;
  output?: string;
  error?: string;
};

export default function ClassDetailPage() {
  const params = useParams<{ classId: string }>();
  const classId = params?.classId ?? "";
  const classInfo = mockTeacherDashboardData.classes.find((cls) => cls.id === classId);
  const details = mockTeacherDashboardData.classDetails[classId];

  const roster = useMemo(() => details?.students ?? [], [details]);

  const defaultDraftState = useMemo(() => {
    return roster.reduce<Record<string, StudentDraftState>>((acc, student) => {
      acc[student.id] = {
        status: "idle",
        persona: inferPersonaFromAccommodations(student.accommodations),
      };
      return acc;
    }, {});
  }, [roster]);

  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [learningTargets, setLearningTargets] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState("");
  const [fileMeta, setFileMeta] = useState<{ fileName: string; mimeType: string; wordCount?: number; snippet?: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [studentDrafts, setStudentDrafts] = useState<Record<string, StudentDraftState>>(defaultDraftState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [copiedStudentId, setCopiedStudentId] = useState<string | null>(null);

  useEffect(() => {
    setStudentDrafts(defaultDraftState);
  }, [defaultDraftState]);

  if (!classInfo || !details) {
    notFound();
  }

  const fileContext = [
    fileMeta ? `Source file: ${fileMeta.fileName} (${fileMeta.mimeType})${fileMeta.wordCount ? ` • ~${fileMeta.wordCount} words` : ""}` : null,
    filePreview.trim(),
  ]
    .filter(Boolean)
    .join("\n\n");

  const materialSummary = [assignmentDescription.trim(), fileContext]
    .filter(Boolean)
    .join("\n\n---\n\n");

  const rosterCount = roster.length;
  const completedDrafts = Object.values(studentDrafts).filter((draft) => draft.status === "done").length;

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setUploadedFile(file);
    setFileError(null);
    setIsReadingFile(true);
    setFileMeta(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/assignments/extract", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "We couldn't read that file.");
      }

      const cleanText = typeof data?.text === "string" ? data.text : "";
      setFilePreview(cleanText.slice(0, MAX_FILE_CHARS));
      setFileMeta(data?.meta ?? null);
      if (cleanText.length > MAX_FILE_CHARS) {
        setFileError("Preview shortened for the model prompt (~8k characters max).");
      }
    } catch (error) {
      console.error("Error reading file", error);
      setFilePreview("");
      setFileMeta(null);
      setFileError(error instanceof Error ? error.message : "Couldn't extract text from that file.");
    } finally {
      setIsReadingFile(false);
    }
  };

  const resetFile = () => {
    setUploadedFile(null);
    setFilePreview("");
    setFileError(null);
    setFileMeta(null);
  };

  const handleCopy = async (studentId: string, content?: string) => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopiedStudentId(studentId);
      setTimeout(() => setCopiedStudentId(null), 1500);
    } catch (error) {
      console.error("Clipboard error", error);
    }
  };

  const handleGenerateAssignments = async () => {
    setGenerateError(null);
    setProgress(0);
    if (!assignmentTitle.trim()) {
      setGenerateError("Name the assignment before generating personalized versions.");
      return;
    }
    if (!materialSummary) {
      setGenerateError("Add a description or upload a file so the model has context.");
      return;
    }
    if (rosterCount === 0) {
      setGenerateError("Add students to the roster to create personalized assignments.");
      return;
    }

    setIsGenerating(true);
    setStudentDrafts((prev) => {
      const next: Record<string, StudentDraftState> = {};
      for (const student of roster) {
        next[student.id] = {
          persona: prev[student.id]?.persona ?? inferPersonaFromAccommodations(student.accommodations),
          status: "pending",
        };
      }
      return next;
    });

    try {
      let completed = 0;
      for (const student of roster) {
        const personaKey = studentDrafts[student.id]?.persona ?? inferPersonaFromAccommodations(student.accommodations);
        const persona = personaDetails[personaKey];
        const promptSections = [
          `Class: ${classInfo.name} (Grade ${classInfo.grade})`,
          `Assignment title: ${assignmentTitle}`,
          learningTargets.trim() ? `Learning goals: ${learningTargets.trim()}` : null,
          `Original material:\n${materialSummary}`,
          `Student: ${student.name}`,
          `Student accommodations: ${student.accommodations.join(", ") || "Not listed"}`,
          `Persona focus: ${persona.label} — ${persona.helper}`,
          "Create a personalized assignment draft that includes:",
          "- A concise overview",
          "- Differentiated instructions with clear steps",
          "- Suggested scaffolds or tools aligned to the accommodations",
          "- How work should be submitted (text, audio, visuals, etc.)",
          "- Quick formative check at the end",
          "Respond in markdown with headings so teachers can copy/paste directly.",
        ].filter(Boolean);

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: promptSections.join("\n\n"),
              disability: personaKey,
            }),
          });

          if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Model request failed");
          }

          const data = (await response.json()) as { output?: string; error?: string };
          if (data.error) {
            throw new Error(data.error);
          }

          setStudentDrafts((prev) => ({
            ...prev,
            [student.id]: {
              status: "done",
              persona: personaKey,
              output: data.output?.trim() || "Model returned an empty response.",
            },
          }));
        } catch (error) {
          console.error("Generation error", error);
          setStudentDrafts((prev) => ({
            ...prev,
            [student.id]: {
              status: "error",
              persona: personaKey,
              error: error instanceof Error ? error.message : "Unknown error",
            },
          }));
        } finally {
          completed += 1;
          setProgress(Math.round((completed / rosterCount) * 100));
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout teacherName="Jamie Ortiz">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Class Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold">{classInfo.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              {classInfo.students} students • Grade {classInfo.grade} • {classInfo.focusArea}
            </p>
          </div>
          <div className="flex gap-2 text-sm">
            <Link href="/classes" className="rounded-full border border-slate-200 px-4 py-2 dark:border-white/20">
              Back to classes
            </Link>
            <button className="rounded-full border border-indigo-300 px-4 py-2 text-indigo-600">Add student</button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <motion.div whileHover={{ translateY: -4 }} className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-white/5">
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Student management</p>
            <div className="mt-4 space-y-3">
              {details.students.map((student) => (
                <div key={student.id} className="rounded-2xl border border-slate-200/70 p-3 text-sm dark:border-white/20">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{student.name}</p>
                    <span className="text-xs text-indigo-500">{student.status}</span>
                  </div>
                  <p className="text-xs text-slate-500">{student.accommodations.join(", ")}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div whileHover={{ translateY: -4 }} className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-white/5">
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Assignment creation</p>
            <div className="mt-4 space-y-4">
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Assignment title</label>
                  <input
                    value={assignmentTitle}
                    onChange={(event) => setAssignmentTitle(event.target.value)}
                    placeholder="Ex: Fraction Sort with tactile supports"
                    className="mt-1 w-full rounded-2xl border border-slate-200/70 bg-transparent px-3 py-2 focus:border-indigo-400 focus:outline-none dark:border-white/20"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Describe or paste the assignment</label>
                  <textarea
                    value={assignmentDescription}
                    onChange={(event) => setAssignmentDescription(event.target.value)}
                    placeholder="Paste directions, rubric highlights, or link context..."
                    className="mt-1 h-28 w-full rounded-2xl border border-slate-200/70 bg-transparent px-3 py-2 text-sm leading-5 focus:border-indigo-400 focus:outline-none dark:border-white/20"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Learning targets / success criteria</label>
                  <textarea
                    value={learningTargets}
                    onChange={(event) => setLearningTargets(event.target.value)}
                    placeholder="Ex: Students compare fractions with unlike denominators using models and sentence frames."
                    className="mt-1 h-20 w-full rounded-2xl border border-slate-200/70 bg-transparent px-3 py-2 text-sm leading-5 focus:border-indigo-400 focus:outline-none dark:border-white/20"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Upload source file (optional)</label>
                  <div className="mt-1 flex flex-col gap-2 rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-500 dark:border-white/20">
                    <label className="flex cursor-pointer flex-col gap-1 text-center">
                      <span className="font-medium text-slate-700 dark:text-slate-200">{uploadedFile ? uploadedFile.name : "Drag & drop or click to upload"}</span>
                      <span>{uploadedFile ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : "PDF, DOCX, Google Doc export, or text file"}</span>
                      <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt,.rtf,.md" />
                    </label>
                    {uploadedFile && (
                      <button type="button" className="text-xs text-indigo-500" onClick={resetFile}>
                        Remove file
                      </button>
                    )}
                    {isReadingFile && <p className="text-xs text-slate-400">Extracting text preview…</p>}
                    {fileError && <p className="text-xs text-amber-500">{fileError}</p>}
                    {fileMeta && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-300">
                        Extracted ~{fileMeta.wordCount ?? "…"} words from {fileMeta.fileName}
                      </p>
                    )}
                    {filePreview && (
                      <p className="max-h-28 overflow-y-auto rounded-xl bg-slate-50 p-2 text-left font-mono text-[11px] leading-relaxed text-slate-500 dark:bg-white/10 dark:text-slate-200">
                        {filePreview.slice(0, MAX_PREVIEW_CHARS)}
                        {filePreview.length > MAX_PREVIEW_CHARS ? "…" : ""}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {generateError && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/60 px-3 py-2 text-xs text-rose-600 dark:border-rose-400/40 dark:bg-rose-400/10">
                  {generateError}
                </div>
              )}

              {(isGenerating || progress > 0) && (
                <div className="rounded-2xl border border-slate-200/70 px-3 py-2 text-xs dark:border-white/20">
                  <div className="flex items-center justify-between">
                    <p className="uppercase tracking-[0.2em] text-slate-400">{isGenerating ? "Generating drafts" : "Drafts updated"}</p>
                    <p className="font-semibold text-indigo-500">{progress}%</p>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/10">
                    <div className="h-full rounded-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-slate-200/70 p-3 text-xs text-slate-500 dark:border-white/20">
                <p className="text-[11px] uppercase tracking-[0.3em] text-indigo-400">Roster accommodations</p>
                <div className="mt-2 space-y-2">
                  {details.students.map((student) => {
                    const draft = studentDrafts[student.id];
                    const personaDetail = personaDetails[draft?.persona ?? "generic"];
                    return (
                      <div key={student.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-[13px] dark:bg-white/10">
                        <div>
                          <p className="font-medium text-slate-700 dark:text-white">{student.name}</p>
                          <p>{student.accommodations.join(", ")}</p>
                        </div>
                        <span className="rounded-full border border-indigo-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:border-indigo-500/50">
                          {personaDetail.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleGenerateAssignments}
                disabled={isGenerating || isReadingFile}
                className="w-full rounded-full bg-indigo-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-300"
              >
                {isReadingFile ? "Reading uploaded file…" : isGenerating ? "Creating personalized drafts…" : "Create assignment"}
              </button>

              <div className="space-y-2 rounded-2xl border border-slate-100 p-3 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
                <p className="text-[11px] uppercase tracking-[0.3em] text-indigo-400">Existing assignments</p>
                {details.assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs dark:bg-white/10">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">{assignment.title}</p>
                      <p className="text-slate-500">Due {assignment.dueDate} • {assignment.submissions} submissions</p>
                    </div>
                    <span className="rounded-full border border-slate-200 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-indigo-500 dark:border-white/20">
                      {assignment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Personalized drafts</p>
              <h2 className="text-xl font-semibold">Accommodation-aware versions</h2>
            </div>
            <p className="text-xs text-slate-500">
              {completedDrafts}/{rosterCount} ready
            </p>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {details.students.map((student) => {
              const draft = studentDrafts[student.id];
              const personaDetail = personaDetails[draft?.persona ?? "generic"];
              const status = draft?.status ?? "idle";
              return (
                <div key={student.id} className="flex h-full flex-col rounded-2xl border border-slate-200/70 p-4 text-sm dark:border-white/20">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.accommodations.join(", ")}</p>
                    </div>
                    <span className="rounded-full border border-indigo-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:border-indigo-500/50">
                      {personaDetail.label}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        status === "done" ? "bg-emerald-400" : status === "pending" ? "bg-amber-400 animate-pulse" : status === "error" ? "bg-rose-400" : "bg-slate-300"
                      }`}
                    />
                    <span className="uppercase tracking-[0.3em] text-slate-400">{status}</span>
                  </div>
                  <div className="mt-3 flex-1 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600 dark:bg-white/10 dark:text-slate-200 md:max-h-64 md:overflow-y-auto">
                    {status === "done" && draft?.output && (
                      <pre className="max-h-60 overflow-y-auto whitespace-pre-wrap rounded-lg bg-white/60 p-2 font-mono text-[11px] text-slate-700 dark:bg-white/5 dark:text-slate-100">
                        {draft.output}
                      </pre>
                    )}
                    {status === "pending" && <p>Generating a version with {personaDetail.helper.toLowerCase()}…</p>}
                    {status === "idle" && <p>Click “Create assignment” to generate this version.</p>}
                    {status === "error" && <p className="text-rose-500">Couldn&apos;t create draft: {draft?.error ?? "Unknown error"}</p>}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleCopy(student.id, draft?.output)}
                      disabled={!draft?.output}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs uppercase tracking-[0.2em] text-indigo-500 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300 dark:border-white/20 dark:hover:bg-white/10"
                    >
                      {copiedStudentId === student.id ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Gradebook</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.3em] text-slate-400">
                <tr>
                  <th className="py-2">Student</th>
                  <th className="py-2">Assignment</th>
                  <th className="py-2">Score</th>
                  <th className="py-2">Mastery</th>
                </tr>
              </thead>
              <tbody>
                {details.gradebook.map((row) => (
                  <tr key={`${row.studentId}-${row.assignmentTitle}`} className="border-t border-slate-100 text-slate-600 dark:border-white/10 dark:text-slate-200">
                    <td className="py-3">{row.studentName}</td>
                    <td className="py-3">{row.assignmentTitle}</td>
                    <td className="py-3">{row.score}</td>
                    <td className="py-3">{row.mastery}</td>
                  </tr>
                ))}
                {details.gradebook.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      No grade entries yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
