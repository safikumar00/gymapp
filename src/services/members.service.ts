import { isSupabaseEnabled, supabase } from '../api/supabase';
import { MOCK_MEMBERS } from '../utils/mockData';
import { Member } from '../types';

type MembersResult = { data: Member[] | null; error?: any };
type MemberResult = { data: Member | null; error?: any };

export async function fetchMembers(
  gymId: string,
  limit = 50,
  offset = 0
): Promise<MembersResult> {
  if (!isSupabaseEnabled || !supabase) {
    return { data: MOCK_MEMBERS.slice(offset, offset + limit) };
  }

  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('gym_id', gymId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function searchMembers(
  gymId: string,
  query: string
): Promise<MembersResult> {
  if (!isSupabaseEnabled || !supabase) {
    const filtered = MOCK_MEMBERS.filter(
      (m) =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.phone?.includes(query) ||
        m.email?.toLowerCase().includes(query.toLowerCase())
    );
    return { data: filtered };
  }

  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('gym_id', gymId)
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createMember(
  member: Omit<Member, 'id' | 'created_at'>
): Promise<MemberResult> {
  if (!isSupabaseEnabled || !supabase) {
    const newMember: Member = {
      ...member,
      id: `m_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return { data: newMember };
  }

  try {
    const { data, error } = await supabase
      .from('members')
      .insert(member)
      .select()
      .maybeSingle();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateMember(
  id: string,
  updates: Partial<Member>
): Promise<MemberResult> {
  if (!isSupabaseEnabled || !supabase) {
    const mockMember = MOCK_MEMBERS.find((m) => m.id === id);
    if (mockMember) {
      return { data: { ...mockMember, ...updates } };
    }
    return { data: null, error: { message: 'Member not found' } };
  }

  try {
    const { data, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteMember(id: string): Promise<{ error?: any }> {
  if (!isSupabaseEnabled || !supabase) {
    return {};
  }

  try {
    const { error } = await supabase.from('members').delete().eq('id', id);
    return { error };
  } catch (error) {
    return { error };
  }
}
