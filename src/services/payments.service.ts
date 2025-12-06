import { isSupabaseEnabled, supabase } from '../api/supabase';
import { MOCK_PAYMENTS } from '../utils/mockData';
import { Payment } from '../types';

type PaymentsResult = { data: Payment[] | null; error?: any };
type PaymentResult = { data: Payment | null; error?: any };

export async function fetchPayments(
  gymId: string,
  limit = 50,
  offset = 0
): Promise<PaymentsResult> {
  if (!isSupabaseEnabled || !supabase) {
    return { data: MOCK_PAYMENTS.slice(offset, offset + limit) };
  }

  try {
    const { data, error } = await supabase
      .from('member_payments')
      .select('*')
      .eq('gym_id', gymId)
      .order('paid_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchMemberPayments(
  memberId: string
): Promise<PaymentsResult> {
  if (!isSupabaseEnabled || !supabase) {
    const filtered = MOCK_PAYMENTS.filter((p) => p.member_id === memberId);
    return { data: filtered };
  }

  try {
    const { data, error } = await supabase
      .from('member_payments')
      .select('*')
      .eq('member_id', memberId)
      .order('paid_at', { ascending: false });

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createPayment(
  payment: Omit<Payment, 'id' | 'paid_at'>
): Promise<PaymentResult> {
  if (!isSupabaseEnabled || !supabase) {
    const newPayment: Payment = {
      ...payment,
      id: `p_${Date.now()}`,
      paid_at: new Date().toISOString(),
    };
    return { data: newPayment };
  }

  try {
    const { data, error } = await supabase
      .from('member_payments')
      .insert(payment)
      .select()
      .maybeSingle();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getRevenueStats(
  gymId: string,
  startDate: string,
  endDate: string
): Promise<{ total: number; count: number }> {
  if (!isSupabaseEnabled || !supabase) {
    const total = MOCK_PAYMENTS.reduce((sum, p) => sum + p.amount, 0);
    return { total, count: MOCK_PAYMENTS.length };
  }

  try {
    const { data, error } = await supabase
      .from('member_payments')
      .select('amount')
      .eq('gym_id', gymId)
      .eq('status', 'paid')
      .gte('paid_at', startDate)
      .lte('paid_at', endDate);

    if (error || !data) {
      return { total: 0, count: 0 };
    }

    const total = data.reduce((sum, p) => sum + (p.amount || 0), 0);
    return { total, count: data.length };
  } catch (error) {
    return { total: 0, count: 0 };
  }
}
