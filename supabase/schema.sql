-- Alloquy Database Schema
-- Run this in the Supabase SQL Editor after creating your project.

-- Enable UUID helpers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles capture onboarding data for both teachers and students.
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
  school_name TEXT,
  district TEXT,
  subjects TEXT[] DEFAULT '{}',
  grades_taught TEXT[] DEFAULT '{}',
  grade_level TEXT,
  preferred_grading_scale TEXT,
  accommodations JSONB DEFAULT '{}'::jsonb,
  is_onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student records link back to auth + profile rows for class membership.
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classes owned by teachers (teacher_id matches profiles.id).
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  section TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Google Classroom style join codes with expirations.
CREATE TABLE IF NOT EXISTS classroom_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE CHECK (char_length(code) BETWEEN 6 AND 8),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email invites for onboarding + auto-join.
CREATE TABLE IF NOT EXISTS class_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  invite_email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Many-to-many relationship between classes and student records.
CREATE TABLE IF NOT EXISTS class_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (class_id, student_id)
);

-- Assignments can be AI-generated or manual.
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  rubric JSONB DEFAULT '[]'::jsonb,
  accommodations JSONB DEFAULT '{}'::jsonb,
  differentiation JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student submissions + AI grading metadata.
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  graded BOOLEAN DEFAULT FALSE,
  score NUMERIC,
  rubric JSONB DEFAULT '[]'::jsonb,
  strengths TEXT[] DEFAULT '{}',
  next_steps TEXT[] DEFAULT '{}',
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional insights tracking for trend charts.
CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  metric TEXT NOT NULL,
  value NUMERIC,
  note TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance.
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_students_user ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_codes_class ON classroom_codes(class_id);
CREATE INDEX IF NOT EXISTS idx_class_students_class ON class_students(class_id);
CREATE INDEX IF NOT EXISTS idx_class_students_student ON class_students(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_invites_email ON class_invitations(invite_email);

-- Keep updated_at fresh.
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER students_updated BEFORE UPDATE ON students
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Enable RLS everywhere.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Profiles: users manage their own record.
CREATE POLICY "Profiles readable by owner"
ON profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Profiles upsert by owner"
ON profiles FOR INSERT
WITH CHECK (id = auth.uid());

CREATE POLICY "Profiles update by owner"
ON profiles FOR UPDATE
USING (id = auth.uid());

-- Students: student sees own record, teachers see roster membership.
CREATE POLICY "Students readable by owner or teacher"
ON students FOR SELECT
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM class_students
    JOIN classes ON classes.id = class_students.class_id
    WHERE class_students.student_id = students.id
      AND classes.teacher_id = auth.uid()
  )
);

CREATE POLICY "Students insert own record"
ON students FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Students update own record"
ON students FOR UPDATE
USING (user_id = auth.uid());

-- Classes: teachers manage, students can view classes they joined.
CREATE POLICY "Classes readable by teachers"
ON classes FOR SELECT
USING (teacher_id = auth.uid());

CREATE POLICY "Classes readable by enrolled students"
ON classes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM class_students
    JOIN students ON students.id = class_students.student_id
    WHERE class_students.class_id = classes.id
      AND students.user_id = auth.uid()
  )
);

CREATE POLICY "Classes managed by teachers"
ON classes FOR INSERT
WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Classes updated by teachers"
ON classes FOR UPDATE
USING (teacher_id = auth.uid());

CREATE POLICY "Classes deleted by teachers"
ON classes FOR DELETE
USING (teacher_id = auth.uid());

-- Classroom codes: only the class owner.
CREATE POLICY "Codes managed by teacher"
ON classroom_codes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = classroom_codes.class_id
      AND classes.teacher_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = classroom_codes.class_id
      AND classes.teacher_id = auth.uid()
  )
);

-- Invitations: teachers only.
CREATE POLICY "Invites managed by teacher"
ON class_invitations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = class_invitations.class_id
      AND classes.teacher_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = class_invitations.class_id
      AND classes.teacher_id = auth.uid()
  )
);

-- Membership: teachers and students manage their link.
CREATE POLICY "Class membership readable"
ON class_students FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = class_students.class_id
      AND classes.teacher_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM students
    WHERE students.id = class_students.student_id
      AND students.user_id = auth.uid()
  )
);

CREATE POLICY "Class membership managed by teacher or student"
ON class_students FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = class_students.class_id
      AND classes.teacher_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM students
    WHERE students.id = class_students.student_id
      AND students.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = class_students.class_id
      AND classes.teacher_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM students
    WHERE students.id = class_students.student_id
      AND students.user_id = auth.uid()
  )
);

-- Assignments: teachers own, students view within enrolled classes.
CREATE POLICY "Assignments readable by teacher"
ON assignments FOR SELECT
USING (teacher_id = auth.uid());

CREATE POLICY "Assignments readable by enrolled students"
ON assignments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM class_students
    JOIN students ON students.id = class_students.student_id
    WHERE class_students.class_id = assignments.class_id
      AND students.user_id = auth.uid()
  )
);

CREATE POLICY "Assignments managed by teacher"
ON assignments FOR ALL
USING (teacher_id = auth.uid())
WITH CHECK (teacher_id = auth.uid());

-- Submissions: teachers of the assignment or student owner.
CREATE POLICY "Submissions readable by teacher"
ON submissions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM assignments
    WHERE assignments.id = submissions.assignment_id
      AND assignments.teacher_id = auth.uid()
  )
);

CREATE POLICY "Submissions readable by student"
ON submissions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM students
    WHERE students.id = submissions.student_id
      AND students.user_id = auth.uid()
  )
);

CREATE POLICY "Submissions created by student"
ON submissions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM students
    JOIN class_students ON class_students.student_id = students.id
    JOIN assignments ON assignments.class_id = class_students.class_id
    WHERE students.id = submissions.student_id
      AND students.user_id = auth.uid()
      AND assignments.id = submissions.assignment_id
  )
);

CREATE POLICY "Submissions updated by teacher"
ON submissions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM assignments
    WHERE assignments.id = submissions.assignment_id
      AND assignments.teacher_id = auth.uid()
  )
);

CREATE POLICY "Submissions updated by student owner"
ON submissions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM students
    WHERE students.id = submissions.student_id
      AND students.user_id = auth.uid()
  )
);

-- Insights follow same access rules as submissions.
CREATE POLICY "Insights readable by teacher"
ON insights FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = insights.class_id
      AND classes.teacher_id = auth.uid()
  )
);

CREATE POLICY "Insights readable by student"
ON insights FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM students
    WHERE students.id = insights.student_id
      AND students.user_id = auth.uid()
  )
);
