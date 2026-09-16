import { cookies } from 'next/headers';
import crypto from 'crypto';
import { supabaseAdmin } from './supabaseAdmin';

const SESSION_COOKIE_NAME = 'token';
const SESSION_EXPIRY_DAYS = 7;

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  const { error } = await supabaseAdmin.from('sessions').insert({
    token,
    user_id: userId,
    expires_at: expiresAt.toISOString(),
  });

  if (error) throw error;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return token;
}

// if found return that value and if not found throw null
export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || null;
}


export async function destroySession() {
  const token = await getSessionToken();
  if (token) {
    await supabaseAdmin.from('sessions').delete().eq('token', token);
  }
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}