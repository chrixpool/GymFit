import { UserProfile } from '../types/workout';
import { getCurrentUser } from './auth';
import { supabase } from './supabase';

const PROFILE_COLUMNS = 'age, weight, height, goal, bmi';

const isProfile = (value: UserProfile | null): value is UserProfile => {
  return Boolean(value?.age && value?.weight && value?.height && value?.goal && value?.bmi);
};

export const saveProfile = async (profile: UserProfile) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No logged-in user.');
  }

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    ...profile,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
};

export const getProfile = async (): Promise<UserProfile | null> => {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase.from('profiles').select(PROFILE_COLUMNS).eq('id', user.id).maybeSingle();

  if (error) throw error;

  return isProfile(data) ? data : null;
};

export const clearProfile = async () => {
  const user = await getCurrentUser();

  if (!user) return;

  const { error } = await supabase.from('profiles').delete().eq('id', user.id);

  if (error) throw error;
};
