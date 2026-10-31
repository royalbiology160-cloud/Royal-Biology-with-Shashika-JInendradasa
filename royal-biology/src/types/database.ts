export type UserRole = "student" | "admin";

export type PaymentStatus = "pending" | "approved" | "rejected" | "expired";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  mobile: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Student {
  id: string;
  student_id: string;
  school: string | null;
  extra_info: string | null;
  is_active: boolean;
  ai_credits: number;
  created_at: string;
}

export interface Course {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
}

export interface Payment {
  id: string;
  student_id: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  receipt_url: string | null;
  notes: string | null;
  valid_from: string | null;
  valid_until: string | null;
  approved_at: string | null;
  created_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  chapter: string | null;
  order_index: number;
  duration_minutes: number | null;
  thumbnail_url: string | null;
  is_published: boolean;
}

export interface LiveClass {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  zoom_link: string | null;
  youtube_link: string | null;
  is_live: boolean;
  recording_url: string | null;
}

export interface Exam {
  id: string;
  course_id: string;
  title: string;
  exam_type: "mcq" | "structured" | "model" | "revision";
  instructions: string | null;
  duration_minutes: number;
  total_marks: number | null;
  is_published: boolean;
  start_at: string | null;
  end_at: string | null;
}

export interface StudyMaterial {
  id: string;
  course_id: string;
  title: string;
  category: string | null;
  file_path: string;
  is_paid: boolean;
  chapter: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  type: string | null;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string | null;
  is_published: boolean;
  created_at: string;
}
