export interface StudentProfile {
  id: string;
  name: string;
  grade: string;
  homeroom: string;
  advisor: string;
  avatarInitials: string;
  focusGoal: string;
}

export interface StudentSummaryStat {
  id: string;
  label: string;
  value: string;
  helper: string;
}

export interface StudentAssignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "Ready" | "In progress" | "Submitted";
  progress: number;
  adaptations: string[];
}

export interface StudentSupportTool {
  id: string;
  title: string;
  description: string;
  type: "Checklist" | "Audio" | "Planner" | "Steps";
  completed: boolean;
  linkLabel: string;
}

export interface StudentCelebration {
  id: string;
  title: string;
  detail: string;
  tag: string;
  timestamp: string;
}

export interface DailyRoutineStep {
  id: string;
  label: string;
  completed: boolean;
  helper: string;
}

export interface StudentPulse {
  id: string;
  energy: number;
  focus: number;
  mood: string;
  note: string;
  updatedAt: string;
}

export interface StudentDashboardData {
  profile: StudentProfile;
  stats: StudentSummaryStat[];
  assignments: StudentAssignment[];
  supports: StudentSupportTool[];
  celebrations: StudentCelebration[];
  routine: DailyRoutineStep[];
  pulse: StudentPulse;
}

export const mockStudentDashboardData: StudentDashboardData = {
  profile: {
    id: "student-431",
    name: "Jordan Kumar",
    grade: "6",
    homeroom: "STEM Lab • Period 2",
    advisor: "Ms. Patel",
    avatarInitials: "JK",
    focusGoal: "Chunk long tasks into 3 clear steps and use the audio scaffold before submitting.",
  },
  stats: [
    {
      id: "tasks-due",
      label: "Tasks due this week",
      value: "3",
      helper: "Science + ELA checkpoints",
    },
    {
      id: "ready-launch",
      label: "Ready-to-launch items",
      value: "2",
      helper: "Math lab + Reading log",
    },
    {
      id: "teacher-notes",
      label: "Teacher feedback",
      value: "4",
      helper: "2 new notes today",
    },
  ],
  assignments: [
    {
      id: "assign-sci-01",
      title: "Circuit Safety Poster",
      course: "Science",
      dueDate: "Tomorrow • 9:00 AM",
      status: "In progress",
      progress: 65,
      adaptations: ["Audio narration", "Chunked steps", "Example visuals"],
    },
    {
      id: "assign-math-02",
      title: "Fraction Lab Reflection",
      course: "Math Lab",
      dueDate: "Fri • 11:30 AM",
      status: "Ready",
      progress: 45,
      adaptations: ["Graphic organizer", "Sentence starters"],
    },
    {
      id: "assign-ela-03",
      title: "Novel Study Quick Write",
      course: "ELA",
      dueDate: "Mon • 8:45 AM",
      status: "Submitted",
      progress: 100,
      adaptations: ["Audio to text", "Simplified prompt"],
    },
  ],
  supports: [
    {
      id: "support-01",
      title: "3-step checklist",
      description: "Preview → Plan → Create. Tap to mark each step finished.",
      type: "Checklist",
      completed: false,
      linkLabel: "Open checklist",
    },
    {
      id: "support-02",
      title: "Read-aloud boost",
      description: "Listen to the science directions with highlighted text.",
      type: "Audio",
      completed: true,
      linkLabel: "Replay audio",
    },
    {
      id: "support-03",
      title: "Focus timer",
      description: "15 min work / 3 min break cadence to finish the math lab.",
      type: "Planner",
      completed: false,
      linkLabel: "Start timer",
    },
  ],
  celebrations: [
    {
      id: "celebrate-01",
      title: "Math lab reflection draft",
      detail: "Nice job using the sentence starters. Add 1 sentence on what was tricky.",
      tag: "Ms. Patel",
      timestamp: "Updated 10m ago",
    },
    {
      id: "celebrate-02",
      title: "Reading log voice note",
      detail: "Love the detail about the main character—keep the same structure tomorrow.",
      tag: "Coach Reilly",
      timestamp: "Yesterday",
    },
  ],
  routine: [
    {
      id: "routine-01",
      label: "Skim today’s agenda",
      completed: true,
      helper: "Tap the bell to re-open notifications.",
    },
    {
      id: "routine-02",
      label: "Turn on focus mode",
      completed: false,
      helper: "Headphones + closed captions",
    },
    {
      id: "routine-03",
      label: "Upload math photo",
      completed: false,
      helper: "Snap the lab worksheet when finished.",
    },
  ],
  pulse: {
    id: "pulse-01",
    energy: 7,
    focus: 6,
    mood: "Curious",
    note: "Need quiet space for the last step of the poster.",
    updatedAt: "Logged 8:10 AM",
  },
};
