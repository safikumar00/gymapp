export interface User {
  id: string;
  email: string;
  role: 'owner' | 'trainer' | 'member';
  gym_id: string;
  full_name?: string;
  avatar?: string;
}

export interface Gym {
  id: string;
  name: string;
  address?: string;
  created_at: string;
}

export interface Member {
  id: string;
  gym_id: string;
  name: string;
  phone?: string;
  email?: string;
  status: 'active' | 'expired' | 'inactive';
  plan_id?: string;
  assigned_trainer?: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  gym_id: string;
  name: string;
  duration_days: number;
  price: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  member_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled';
  created_at: string;
}

export interface Attendance {
  id: string;
  member_id: string;
  gym_id: string;
  checkin_at: string;
  checkin_type: 'qr' | 'manual';
}

export interface Payment {
  id: string;
  member_id: string;
  gym_id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  paid_at: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
      USE_MOCK_DATA: string;
    }
  }
}

export {};
