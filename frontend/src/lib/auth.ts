export interface UserProfile {
  name: string;
  email: string;
  eventName?: string;
  role?: string;
}

/**
 * Save user session to localStorage when logging in or signing up
 */
export function setAuthSession(user: UserProfile, token?: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_profile', JSON.stringify(user));
    if (token) {
      localStorage.setItem('auth_token', token);
    }
  }
}

/**
 * Get current logged in user session
 */
export function getAuthSession(): UserProfile | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem('user_profile') || localStorage.getItem('user');
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    return {
      name: parsed.name || parsed.fullName || parsed.username || 'Organizer',
      email: parsed.email || 'organizer@platform.com',
      eventName: parsed.eventName || 'Stanford TreeHacks 2025',
      role: parsed.role || 'organizer',
    };
  } catch (error) {
    console.error('Failed to parse user profile:', error);
    return null;
  }
}

/**
 * Clear session on Sign Out
 */
export function clearAuthSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_profile');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  }
}