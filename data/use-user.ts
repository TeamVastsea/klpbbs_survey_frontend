'use client';

import useSWR from 'swr';
import UserNetwork from '@/network/user';

export function useUser() {
  const { data, mutate, error } = useSWR('api_user', UserNetwork.fetchUser, {
    onErrorRetry: () => {},
  });

  return {
    user: data,
    isLoading: !error && !data,
    isLoggedIn: !error && data !== undefined,
    mutate,
  };
}

export function useManagedUsers(page: number, size: number, search?: string) {
  const normalizedSearch = search?.trim() ?? '';
  const { data, mutate, error } = useSWR(
    ['api_managed_users', page, size, normalizedSearch],
    UserNetwork.fetchManagedUsers(page, size, normalizedSearch),
    { onErrorRetry: () => {} }
  );

  return {
    users: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
