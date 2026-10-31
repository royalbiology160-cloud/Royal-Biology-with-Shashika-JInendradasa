-- ============================================================
-- ROYAL BIOLOGY – Complete Database Schema
-- Single course only: 2027 Revision
-- Run this in Supabase SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  mobile text,
  role text not null check (role in ('student', 'admin')) default 'student',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Students
create table if not exists public.students (
  id uuid primary key references public.profiles(id) on delete cascade,
  student_id text unique not null,
  school text,
  extra_info text,
  is_active boolean default true,
  ai_credits integer default 50,
  created_at timestamptz default now()
);

-- Admins
create table if not exists public.admins (
  id uuid primary key references public.profiles(id) on delete cascade,
  permissions jsonb default '{}'::jsonb
);

-- SINGLE COURSE
create table if not exists public.courses (
  id uuid primary key default uuid_generate_v4(),
  name text not null default '2027 Revision',
  slug text unique not null default '2027-revision',
  description text,
  is_active boolean default true,
  created_at timestamptz default now()
);

insert into public.courses (name, slug, description)
values (
  '2027 A/L Biology Revision',
  '2027-revision',
  'Royal Biology 2027 Revision පන්තිය – G.C.E. Advanced Level Biology'
) on conflict (slug) do nothing;

-- Enrollments
create table if not exists public.enrollments (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references public.students(id) on delete cascade,
  course_id uuid references public.courses(id),
  enrolled_at timestamptz default now(),
  unique(student_id, course_id)
);

-- Payments
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references public.students(id) on delete cascade,
  amount numeric(12,2) not null,
  status text not null check (status in ('pending','approved','rejected','expired')) default 'pending',
  method text default 'bank_transfer',
  receipt_url text,
  notes text,
  valid_from timestamptz,
  valid_until timestamptz,
  approved_by uuid references public.admins(id),
  approved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.payment_receipts (
  id uuid primary key default uuid_generate_v4(),
  payment_id uuid references public.payments(id) on delete cascade,
  file_path text not null,
  uploaded_at timestamptz default now()
);

-- Lessons & Recordings
create table if not exists public.lessons (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id),
  title text not null,
  description text,
  chapter text,
  order_index integer default 0,
  duration_minutes integer,
  thumbnail_url text,
  is_published boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.recordings (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  storage_path text not null,
  duration_seconds integer,
  created_at timestamptz default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references public.students(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  watched_seconds integer default 0,
  completed boolean default false,
  last_watched_at timestamptz default now(),
  unique(student_id, lesson_id)
);

-- Live classes
create table if not exists public.live_classes (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id),
  title text not null,
  description text,
  start_time timestamptz not null,
  end_time timestamptz,
  zoom_link text,
  youtube_link text,
  is_live boolean default false,
  recording_url text,
  created_at timestamptz default now()
);

-- Study materials
create table if not exists public.study_materials (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id),
  title text not null,
  category text,
  file_path text not null,
  is_paid boolean default true,
  chapter text,
  created_at timestamptz default now()
);

-- Exams
create table if not exists public.exams (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id),
  title text not null,
  exam_type text check (exam_type in ('mcq','structured','model','revision')),
  instructions text,
  duration_minutes integer not null,
  total_marks integer,
  is_published boolean default false,
  start_at timestamptz,
  end_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.questions (
  id uuid primary key default uuid_generate_v4(),
  exam_id uuid references public.exams(id) on delete cascade,
  question_text text not null,
  question_type text check (question_type in ('mcq','structured')),
  options jsonb,
  correct_answer text,
  marks integer default 1,
  explanation text,
  order_index integer default 0
);

create table if not exists public.exam_attempts (
  id uuid primary key default uuid_generate_v4(),
  exam_id uuid references public.exams(id),
  student_id uuid references public.students(id),
  started_at timestamptz default now(),
  submitted_at timestamptz,
  score numeric(8,2),
  status text default 'in_progress'
);

create table if not exists public.exam_answers (
  id uuid primary key default uuid_generate_v4(),
  attempt_id uuid references public.exam_attempts(id) on delete cascade,
  question_id uuid references public.questions(id),
  answer text,
  is_correct boolean,
  marks_awarded numeric(6,2)
);

-- Notifications
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  type text,
  is_read boolean default false,
  link text,
  created_at timestamptz default now()
);

-- AI usage
create table if not exists public.ai_usage (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references public.students(id),
  prompt_preview text,
  tokens_used integer,
  created_at timestamptz default now()
);

-- Announcements
create table if not exists public.announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text,
  is_published boolean default true,
  created_at timestamptz default now()
);

-- Attendance
create table if not exists public.attendance (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references public.students(id) on delete cascade,
  live_class_id uuid references public.live_classes(id),
  present boolean default true,
  marked_at timestamptz default now()
);

-- Settings
create table if not exists public.settings (
  key text primary key,
  value jsonb
);

-- Audit logs
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid,
  action text not null,
  entity text,
  entity_id text,
  meta jsonb,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_payments_student on public.payments(student_id);
create index if not exists idx_payments_status on public.payments(status);
create index if not exists idx_lessons_course on public.lessons(course_id);
create index if not exists idx_live_classes_start on public.live_classes(start_time);
create index if not exists idx_notifications_user on public.notifications(user_id);

-- Helper function
create or replace function public.has_active_payment(p_student_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.payments
    where student_id = p_student_id
      and status = 'approved'
      and (valid_until is null or valid_until > now())
  );
$$;

-- Auto-create profile on signup (trigger)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Student'),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.payments enable row level security;
alter table public.lessons enable row level security;
alter table public.recordings enable row level security;
alter table public.live_classes enable row level security;
alter table public.study_materials enable row level security;
alter table public.exams enable row level security;
alter table public.notifications enable row level security;
alter table public.announcements enable row level security;
alter table public.lesson_progress enable row level security;

-- Basic policies (expand in production)
create policy "Public profiles are viewable by owner"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Students can view own record"
  on public.students for select using (auth.uid() = id);

create policy "Students can view own payments"
  on public.payments for select using (auth.uid() = student_id);

create policy "Students can insert own payments"
  on public.payments for insert with check (auth.uid() = student_id);

create policy "Published lessons are readable"
  on public.lessons for select using (is_published = true);

create policy "Live classes readable"
  on public.live_classes for select using (true);

create policy "Published announcements"
  on public.announcements for select using (is_published = true);

create policy "Users see own notifications"
  on public.notifications for select using (auth.uid() = user_id);

create policy "Students own progress"
  on public.lesson_progress for all using (auth.uid() = student_id);

-- NOTE: Admin policies should use a custom claim or service role.
-- For production, create a function is_admin() and add policies accordingly.
