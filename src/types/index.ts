import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  initials: string;
  points: number;
  tier: "Free" | "Premium";
  status: "Normal" | "Influencer";
  role: "user" | "admin";
  created_at?: string;
  updated_at?: string;
}

export interface ProfileDisplayData {
  name: string;
  avatar?: string;
  initials: string;
  role?: {
    tier: "Free" | "Premium";
    status: "Normal" | "Influencer";
  };
  email?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  category_id?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimated_time?: string;
  instructions?: string;
  verification_type: "Automatic" | "Manual";
  required_media?: boolean;
  redirect_url?: string;
  active: boolean;
  image_url?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  category?: TaskCategory;
}

export interface TaskCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  status: "Pending" | "Submitted" | "Completed" | "Rejected";
  completed_at?: string;
  points_earned?: number;
  submission_id?: string;
  created_at: string;
  task?: Task;
  submission?: TaskSubmission[];
}

export interface TaskSubmission {
  id: string;
  user_task_id: string;
  screenshot_url?: string;
  submission_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  admin_notes?: string;
  created_at: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  points_cost: number;
  quantity?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  status: "Pending" | "Fulfilled" | "Cancelled";
  redeemed_at: string;
  points_spent: number;
  reward?: Reward;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referral_code: string;
  created_at: string;
}

export interface ReferredUser {
  id: string;
  referrer_id: string;
  referred_user_id: string;
  referral_code: string;
  created_at: string;
  points_awarded: boolean;
  referred_user?: UserProfile;
}

export interface ConnectedService {
  id: string;
  user_id: string;
  service_name: string;
  service_user_id: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface RPCResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}

export interface TaskProps {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: string | "referral" | "spotify" | "social" | "daily" | "music" | "other";
  expiresAt: Date;
  progress: number;
  completed: boolean;
}

export interface LeaderboardUser {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  initials: string;
  points: number;
  position: number;
  tier: "Free" | "Premium";
  status: "Normal" | "Influencer";
}
