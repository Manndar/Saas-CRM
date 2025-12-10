import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export interface AuthUser {
  userId: string;
  email: string;
  organizationId?: string;
  role?: string;
}

// Atoms for auth state
export const tokensAtom = atomWithStorage<AuthTokens>('auth-tokens', {
  accessToken: null,
  refreshToken: null,
});

export const userAtom = atom<AuthUser | null>(null);

export const isAuthenticatedAtom = atom((get) => {
  const tokens = get(tokensAtom);
  return !!tokens.accessToken && !!tokens.refreshToken;
});

// Helper functions
export const setTokens = (tokens: AuthTokens) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', tokens.accessToken || '');
    localStorage.setItem('refreshToken', tokens.refreshToken || '');
  }
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

export const getTokens = (): AuthTokens => {
  if (typeof window === 'undefined') {
    return { accessToken: null, refreshToken: null };
  }
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
};

