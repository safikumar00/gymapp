/*
  # Create Base Gym Management Schema

  ## New Tables
  
  ### 1. gyms
  - `id` (uuid, primary key)
  - `name` (text, required) - Gym name
  - `address` (text) - Gym physical address
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### 2. profiles
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text) - User full name
  - `email` (text) - User email
  - `role` (text) - User role: owner, trainer, or member
  - `gym_id` (uuid, references gyms) - Associated gym
  - `avatar` (text) - Avatar URL
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### 3. members
  - `id` (uuid, primary key)
  - `gym_id` (uuid, references gyms) - Associated gym
  - `name` (text, required) - Member name
  - `phone` (text) - Member phone number
  - `email` (text) - Member email
  - `status` (text) - Membership status: active, expired, inactive
  - `plan_id` (uuid, references subscription_plans) - Current plan
  - `assigned_trainer` (uuid, references profiles) - Assigned trainer
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### 4. subscription_plans
  - `id` (uuid, primary key)
  - `gym_id` (uuid, references gyms) - Associated gym
  - `name` (text, required) - Plan name
  - `duration_days` (integer, required) - Plan duration in days
  - `price` (numeric, required) - Plan price
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### 5. subscriptions
  - `id` (uuid, primary key)
  - `member_id` (uuid, references members) - Associated member
  - `plan_id` (uuid, references subscription_plans) - Selected plan
  - `start_date` (date) - Subscription start date
  - `end_date` (date) - Subscription end date
  - `status` (text) - Subscription status: active, expired, cancelled
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### 6. attendance
  - `id` (uuid, primary key)
  - `member_id` (uuid, references members) - Associated member
  - `gym_id` (uuid, references gyms) - Associated gym
  - `checkin_at` (timestamptz) - Check-in timestamp
  - `checkin_type` (text) - Check-in method: qr or manual
  
  ### 7. member_payments
  - `id` (uuid, primary key)
  - `member_id` (uuid, references members) - Associated member
  - `gym_id` (uuid, references gyms) - Associated gym
  - `amount` (numeric) - Payment amount
  - `currency` (text) - Payment currency
  - `status` (text) - Payment status: paid, pending, failed
  - `paid_at` (timestamptz) - Payment timestamp

  ## Security
  
  All tables will have Row Level Security (RLS) enabled in the next migration.
*/

-- Create gyms table
CREATE TABLE IF NOT EXISTS gyms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  email text,
  role text DEFAULT 'member',
  gym_id uuid REFERENCES gyms(id) ON DELETE SET NULL,
  avatar text,
  created_at timestamptz DEFAULT now()
);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id uuid REFERENCES gyms(id) ON DELETE CASCADE,
  name text NOT NULL,
  duration_days integer NOT NULL,
  price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id uuid REFERENCES gyms(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  email text,
  status text DEFAULT 'active',
  plan_id uuid REFERENCES subscription_plans(id) ON DELETE SET NULL,
  assigned_trainer uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES subscription_plans(id) ON DELETE CASCADE,
  start_date date,
  end_date date,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  gym_id uuid REFERENCES gyms(id) ON DELETE CASCADE,
  checkin_at timestamptz DEFAULT now(),
  checkin_type text DEFAULT 'manual'
);

-- Create member_payments table
CREATE TABLE IF NOT EXISTS member_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  gym_id uuid REFERENCES gyms(id) ON DELETE CASCADE,
  amount numeric(10,2),
  currency text DEFAULT 'INR',
  status text DEFAULT 'paid',
  paid_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_gym_id ON profiles(gym_id);
CREATE INDEX IF NOT EXISTS idx_members_gym_id ON members(gym_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_member_id ON subscriptions(member_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_attendance_gym_id ON attendance(gym_id);
CREATE INDEX IF NOT EXISTS idx_attendance_member_id ON attendance(member_id);
CREATE INDEX IF NOT EXISTS idx_attendance_checkin_at ON attendance(checkin_at);
CREATE INDEX IF NOT EXISTS idx_payments_gym_id ON member_payments(gym_id);
CREATE INDEX IF NOT EXISTS idx_payments_member_id ON member_payments(member_id);
