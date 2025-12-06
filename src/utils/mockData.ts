import { Member, SubscriptionPlan, Attendance, Payment } from '../types';

export const MOCK_MEMBERS: Member[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `m_${i + 1}`,
  gym_id: 'gym_mock',
  name: `Member ${i + 1}`,
  phone: `+91 90000${1000 + i}`,
  email: `member${i + 1}@example.com`,
  status: i % 3 === 0 ? 'expired' : 'active',
  plan_id: `plan_${(i % 3) + 1}`,
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
}));

export const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_1',
    gym_id: 'gym_mock',
    name: 'Monthly',
    duration_days: 30,
    price: 1500,
    created_at: new Date().toISOString(),
  },
  {
    id: 'plan_2',
    gym_id: 'gym_mock',
    name: 'Quarterly',
    duration_days: 90,
    price: 4000,
    created_at: new Date().toISOString(),
  },
  {
    id: 'plan_3',
    gym_id: 'gym_mock',
    name: 'Annual',
    duration_days: 365,
    price: 15000,
    created_at: new Date().toISOString(),
  },
];

export const MOCK_ATTENDANCE: Attendance[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `a_${i + 1}`,
  member_id: `m_${(i % 20) + 1}`,
  gym_id: 'gym_mock',
  checkin_at: new Date(Date.now() - i * 3600000).toISOString(),
  checkin_type: i % 2 === 0 ? 'qr' : 'manual',
}));

export const MOCK_PAYMENTS: Payment[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `p_${i + 1}`,
  member_id: `m_${(i % 20) + 1}`,
  gym_id: 'gym_mock',
  amount: [1500, 4000, 15000][i % 3],
  currency: 'INR',
  status: 'paid',
  paid_at: new Date(Date.now() - i * 86400000 * 30).toISOString(),
}));
