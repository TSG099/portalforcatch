export type Role = "admin" | "leader" | "member";

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
  chapter_id: string | null;
  status: "active" | "pending";
}

export interface Chapter {
  id: string;
  university_name: string;
  chapter_name: string;
  leader_id: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface ToyCatalogItem {
  id: string;
  toy_name: string;
  manufacturer: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  switch_compatible: boolean;
  tools_required: string[] | null;
  materials: string | null;
  instructions: string | null;
  image_url: string | null;
  video_url: string | null;
  submitted_by_chapter: string | null;
  created_at: string;
}

export interface ToySubmission {
  id: string;
  toy_name: string;
  chapter_id: string;
  submitted_by: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  materials: string;
  instructions: string;
  safety_notes: string | null;
  image_url: string | null;
  video_url: string | null;
  file_url: string | null;
  status: "pending" | "approved" | "rejected" | "needs_revision";
  admin_feedback: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
  file_url: string | null;
  created_at: string;
}

export interface ChapterApplication {
  id: string;
  university: string;
  leader_name: string;
  leader_email: string;
  estimated_members: number | null;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at: string | null;
}

