import { getClient, unwrap, unwrapMaybe } from './client';
import { Profile, ProfileLanguage, ProfileRole } from './types';

/**
 * profiles is the only table that knows auth_user_id. Every other domain takes
 * a profile_id, so a change of authentication provider stops at this file.
 */

const COLUMNS = '*';

export async function createProfile(authUserId: string, name: string): Promise<Profile> {
  return unwrap<Profile>(
    await getClient()
      .from('profiles')
      .insert({ auth_user_id: authUserId, name })
      .select(COLUMNS)
      .single()
  );
}

export async function getProfileByAuthUserId(authUserId: string): Promise<Profile | null> {
  return unwrapMaybe<Profile>(
    await getClient().from('profiles').select(COLUMNS).eq('auth_user_id', authUserId).maybeSingle()
  );
}

export async function getProfileById(profileId: string): Promise<Profile | null> {
  return unwrapMaybe<Profile>(
    await getClient().from('profiles').select(COLUMNS).eq('id', profileId).maybeSingle()
  );
}

async function updateProfile(
  profileId: string,
  patch: Partial<Pick<Profile, 'name' | 'language' | 'role'>>
): Promise<Profile | null> {
  return unwrapMaybe<Profile>(
    await getClient().from('profiles').update(patch).eq('id', profileId).select(COLUMNS).maybeSingle()
  );
}

export async function updateProfileName(profileId: string, name: string): Promise<Profile | null> {
  return updateProfile(profileId, { name });
}

export async function updateProfileLanguage(
  profileId: string,
  language: ProfileLanguage
): Promise<Profile | null> {
  return updateProfile(profileId, { language });
}

/** Operator use only. The caller checks the permission, this function does not. */
export async function updateProfileRole(
  profileId: string,
  role: ProfileRole
): Promise<Profile | null> {
  return updateProfile(profileId, { role });
}

/** Cascades to conversations, messages, quotas, logs and subscriptions. */
export async function deleteProfile(profileId: string): Promise<boolean> {
  const row = unwrapMaybe<{ id: string }>(
    await getClient().from('profiles').delete().eq('id', profileId).select('id').maybeSingle()
  );
  return row !== null;
}
