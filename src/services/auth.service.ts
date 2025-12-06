import { isSupabaseEnabled, supabase } from '../api/supabase';
import { User } from '../types';

type SignInResult = { user?: User; error?: any };
type SignUpResult = { user?: User; error?: any };

export async function signInWithEmail(
  email: string,
  password: string
): Promise<SignInResult> {
  if (!isSupabaseEnabled || !supabase) {
    return {
      user: {
        id: 'mock-user-1',
        email,
        role: 'owner',
        gym_id: 'gym_mock',
        full_name: 'Mock Owner',
      },
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    if (data?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profile) {
        return {
          user: {
            id: profile.id,
            email: profile.email,
            role: profile.role,
            gym_id: profile.gym_id,
            full_name: profile.full_name,
            avatar: profile.avatar,
          },
        };
      }
    }

    return { error: { message: 'Profile not found' } };
  } catch (error) {
    return { error };
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
): Promise<SignUpResult> {
  if (!isSupabaseEnabled || !supabase) {
    return {
      user: {
        id: 'mock-user-new',
        email,
        role: 'owner',
        gym_id: 'gym_mock',
        full_name: fullName,
      },
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    if (data?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          full_name: fullName,
          role: 'owner',
        })
        .select()
        .maybeSingle();

      if (profile) {
        return {
          user: {
            id: profile.id,
            email: profile.email,
            role: profile.role,
            gym_id: profile.gym_id,
            full_name: profile.full_name,
            avatar: profile.avatar,
          },
        };
      }
    }

    return { error: { message: 'Failed to create profile' } };
  } catch (error) {
    return { error };
  }
}

export async function signOut(): Promise<{ error?: any }> {
  if (!isSupabaseEnabled || !supabase) {
    return {};
  }

  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return { error };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseEnabled || !supabase) {
    return null;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profile) {
      return {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        gym_id: profile.gym_id,
        full_name: profile.full_name,
        avatar: profile.avatar,
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}
