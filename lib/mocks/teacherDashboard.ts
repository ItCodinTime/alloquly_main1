export interface SummaryStat {
  id: string;
  label: string;
  value: string;
  helper: string;
}

export interface ClassOverview {
  id: string;
  name: string;
  grade: string;
  students: number;
  progress: number;
  focusArea: string;
  rosterLink?: string;
}

export interface ClassStudent {
  id: string;
  name: string;
  status: "On track" | "Needs support" | "Monitoring";
  accommodations: string[];
}

export interface ClassAssignment {
  id: string;
  title: string;
  dueDate: string;
  status: "Draft" | "Assigned" | "Completed";
  submissions: number;
}

export interface GradebookEntry {
  studentId: string;
  studentName: string;
  assignmentTitle: string;
  score: string;
  mastery: "Exceeds" | "Meets" | "Developing";
}

export interface UpcomingPlan {
  id: string;
  title: string;
  date: string;
  focus: string;
  className: string;
  status: "Draft" | "Scheduled" | "Published";
  tags?: string[];
}

export interface SupportTicket {
  id: string;
  studentName: string;
  title: string;
  summary: string;
  status: "In progress" | "Waiting" | "Resolved";
  updatedAt: string;
  channel: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  role: string;
  district: string;
  avatarInitials: string;
}

export interface TeacherDashboardData {
  profile: TeacherProfile;
  stats: SummaryStat[];
  classes: ClassOverview[];
  upcomingPlans: UpcomingPlan[];
  supportTickets: SupportTicket[];
  classDetails: Record<
    string,
    {
      students: ClassStudent[];
      assignments: ClassAssignment[];
      gradebook: GradebookEntry[];
    }
  >;
}

export const mockTeacherDashboardData: TeacherDashboardData = {
  profile: {
    id: "teacher-001",
    name: "Sahasra Joginipally",
    role: "Instructional Coach",
    district: "Solon County Public Schools",
    avatarInitials: "SJ",
  },
  stats: [
    {
      id: "minutes-saved",
      label: "Minutes saved this week",
      value: "214",
      helper: "+18% vs last week",
    },
    {
      id: "students-supported",
      label: "Students supported",
      value: "132",
      helper: "28 with active plans",
    },
    {
      id: "plans-generated",
      label: "Plans generated",
      value: "42",
      helper: "6 awaiting review",
    },
  ],
  classes: [
    {
      id: "class-01",
      name: "Grade 4 • Willow Cohort",
      grade: "4",
      students: 24,
      progress: 78,
      focusArea: "Executive function scaffolds",
      rosterLink: "/classes/class-01",
    },
    {
      id: "class-02",
      name: "Grade 6 • STEM Lab",
      grade: "6",
      students: 18,
      progress: 64,
      focusArea: "Sensory-friendly lab steps",
      rosterLink: "/classes/class-02",
    },
    {
      id: "class-03",
      name: "Inclusion Block",
      grade: "3-5",
      students: 12,
      progress: 88,
      focusArea: "Social narratives + AAC scripts",
      rosterLink: "/classes/class-03",
    },
  ],
  upcomingPlans: [
    {
      id: "plan-01",
      title: "Fractions re-teach stations",
      date: "Thu • 10:15 AM",
      focus: "Chunked steps + tactile manipulatives",
      className: "Willow Cohort",
      status: "Scheduled",
      tags: ["Math", "Grade 4"],
    },
    {
      id: "plan-02",
      title: "Science fair peer feedback",
      date: "Fri • 1:30 PM",
      focus: "Positive scripting + visual cue cards",
      className: "STEM Lab",
      status: "Draft",
      tags: ["Science", "Grade 6"],
    },
  ],
  supportTickets: [
    {
      id: "ticket-01",
      studentName: "Micah L.",
      title: "Behavior reflection",
      summary: "Drafting reflection prompts with OT",
      status: "In progress",
      updatedAt: "Updated 2h ago",
      channel: "Coaching DM",
    },
    {
      id: "ticket-02",
      studentName: "Priya D.",
      title: "Spanish OT plan",
      summary: "Awaiting Spanish translation for OT plan",
      status: "Waiting",
      updatedAt: "Updated yesterday",
      channel: "District thread",
    },
    {
      id: "ticket-03",
      studentName: "Theo R.",
      title: "Audio narration",
      summary: "Audio narration timing check completed",
      status: "Resolved",
      updatedAt: "Resolved Monday",
      channel: "Family email",
    },
  ],
  classDetails: {
    "class-01": {
      students: [
        { id: "stu-01", name: "Micah L.", status: "Needs support", accommodations: ["Check-ins", "Visual cues"] },
        { id: "stu-02", name: "Priya D.", status: "On track", accommodations: ["Audio narration"] },
        { id: "stu-03", name: "Theo R.", status: "Monitoring", accommodations: ["Extra processing time"] },
      ],
      assignments: [
        { id: "assign-01", title: "Fraction Sort", dueDate: "Oct 12", status: "Assigned", submissions: 12 },
        { id: "assign-02", title: "Travel Budget Story", dueDate: "Oct 18", status: "Draft", submissions: 0 },
      ],
      gradebook: [
        { studentId: "stu-01", studentName: "Micah L.", assignmentTitle: "Fraction Sort", score: "85%", mastery: "Meets" },
        { studentId: "stu-02", studentName: "Priya D.", assignmentTitle: "Fraction Sort", score: "92%", mastery: "Exceeds" },
      ],
    },
    "class-02": {
      students: [
        { id: "stu-10", name: "Elena K.", status: "On track", accommodations: ["Lab preview videos"] },
        { id: "stu-11", name: "Riley M.", status: "Needs support", accommodations: ["Noise-canceling", "Step cards"] },
      ],
      assignments: [
        { id: "assign-10", title: "Circuit Safety", dueDate: "Oct 15", status: "Assigned", submissions: 8 },
      ],
      gradebook: [
        { studentId: "stu-10", studentName: "Elena K.", assignmentTitle: "Circuit Safety", score: "96%", mastery: "Exceeds" },
      ],
    },
    "class-03": {
      students: [
        { id: "stu-20", name: "Noah P.", status: "Monitoring", accommodations: ["Social narrative"] },
      ],
      assignments: [
        { id: "assign-20", title: "Friendship Story", dueDate: "Oct 20", status: "Draft", submissions: 0 },
      ],
      gradebook: [],
    },
  },
};
