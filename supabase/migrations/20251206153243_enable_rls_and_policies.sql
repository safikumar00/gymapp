/*
  # Enable Row Level Security and Create Policies

  ## Security Implementation
  
  ### 1. Enable RLS on all tables
  All tables will have RLS enabled to ensure data security.
  
  ### 2. Profiles Policies
  - Users can read their own profile
  - Users can update their own profile
  - Users can read profiles in their gym
  
  ### 3. Gyms Policies
  - Gym owners can read their own gym data
  - Gym owners can update their own gym
  
  ### 4. Members Policies
  - Owners and trainers can view members in their gym
  - Owners and trainers can create members in their gym
  - Owners and trainers can update members in their gym
  - Owners can delete members in their gym
  
  ### 5. Subscription Plans Policies
  - Users can view plans for their gym
  - Owners can create, update, delete plans for their gym
  
  ### 6. Subscriptions Policies
  - Users can view subscriptions for members in their gym
  - Owners and trainers can create subscriptions
  - Owners can update subscriptions
  
  ### 7. Attendance Policies
  - Users can view attendance for their gym
  - Owners and trainers can create attendance records
  
  ### 8. Payments Policies
  - Users can view payments for their gym
  - Owners can create payment records

  ## Important Notes
  
  - All policies check authentication status
  - Policies are restrictive by default
  - Ownership/membership is verified through gym_id
*/

-- Enable RLS on all tables
ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_payments ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view profiles in their gym"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    gym_id IN (
      SELECT gym_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Gyms Policies
CREATE POLICY "Gym owners can view their gym"
  ON gyms FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT gym_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('owner', 'trainer')
    )
  );

CREATE POLICY "Gym owners can update their gym"
  ON gyms FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT gym_id FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'owner'
    )
  )
  WITH CHECK (
    id IN (
      SELECT gym_id FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'owner'
    )
  );

-- Members Policies
CREATE POLICY "Users can view members in their gym"
  ON members FOR SELECT
  TO authenticated
  USING (
    gym_id IN (
      SELECT gym_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Owners and trainers can create members"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (
    gym_id IN (
      SELECT gym_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('owner', 'trainer')
    )
  );

CREATE POLICY "Owners and trainers can update members"
  ON members FOR UPDATE
  TO authenticated
  USING (
    gym_id IN (
      SELECT gym_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('owner', 'trainer')
    )
  )
  WITH CHECK (
    gym_id IN (
      SELECT gym_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('owner', 'trainer')
    )
  );

CREATE POLICY "Owners can delete members"
  ON members FOR DELETE
  TO authenticated
  USING (
    gym_id IN (
      SELECT gym_id FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'owner'
    )
  );

-- Subscription Plans Policies
CREATE POLICY "Users can view plans in their gym"
  ON subscription_plans FOR SELECT
  TO authenticated
  USING (
    gym_id IN (
      SELECT gym_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Owners can create plans"
  ON subscription_plans FOR INSERT
  TO authenticated
  WITH CHECK (
    gym_id IN (
      SELECT gym_id FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'owner'
    )
  );

CREATE POLICY "Owners can update plans"
  ON subscription_plans FOR UPDATE
  TO authenticated
  USING (
    gym_id IN (
      SELECT gym_id FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'owner'
    )
  )
  WITH CHECK (
    gym_id IN (
      SELECT gym_id FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'owner'
    )
  );

CREATE POLICY "Owners can delete plans"
  ON subscription_plans FOR DELETE
  TO authenticated
  USING (
    gym_id IN (
      SELECT gym_id FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'owner'
    )
  );

-- Subscriptions Policies
CREATE POLICY "Users can view subscriptions in their gym"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (
    member_id IN (
      SELECT id FROM members 
      WHERE gym_id IN (
        SELECT gym_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Owners and trainers can create subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (
    member_id IN (
      SELECT id FROM members 
      WHERE gym_id IN (
        SELECT gym_id FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('owner', 'trainer')
      )
    )
  );

CREATE POLICY "Owners can update subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (
    member_id IN (
      SELECT id FROM members 
      WHERE gym_id IN (
        SELECT gym_id FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'owner'
      )
    )
  )
  WITH CHECK (
    member_id IN (
      SELECT id FROM members 
      WHERE gym_id IN (
        SELECT gym_id FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'owner'
      )
    )
  );

-- Attendance Policies
CREATE POLICY "Users can view attendance in their gym"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    gym_id IN (
      SELECT gym_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Owners and trainers can create attendance"
  ON attendance FOR INSERT
  TO authenticated
  WITH CHECK (
    gym_id IN (
      SELECT gym_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('owner', 'trainer')
    )
  );

-- Payments Policies
CREATE POLICY "Users can view payments in their gym"
  ON member_payments FOR SELECT
  TO authenticated
  USING (
    gym_id IN (
      SELECT gym_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Owners can create payments"
  ON member_payments FOR INSERT
  TO authenticated
  WITH CHECK (
    gym_id IN (
      SELECT gym_id FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'owner'
    )
  );
