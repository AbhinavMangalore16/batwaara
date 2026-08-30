import { supabase } from './supabase';
import type { Profile } from '@/types/database';

export async function syncUserProfile(user: {
  id: string;
  emailAddresses?: { emailAddress: string }[];
  fullName?: string | null;
  imageUrl?: string | null;
}): Promise<Profile | null> {
  const email = user.emailAddresses?.[0]?.emailAddress || '';
  const fullName = user.fullName || null;
  const avatarUrl = user.imageUrl || null;

  if (!user.id || !email) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        email,
        full_name: fullName,
        avatar_url: avatarUrl,
      },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error syncing user profile to Supabase:', error);
    return null;
  }

  return data as Profile;
}
