'use client';

import useSWR from 'swr';
import StatisticsNetwork from '@/network/statistics';

export function useAdminStatistics() {
  const { data, error, mutate } = useSWR(
    'api_admin_statistics',
    StatisticsNetwork.fetchStatistics,
    { onErrorRetry: () => {} }
  );

  return {
    statistics: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
