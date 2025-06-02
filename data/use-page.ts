import useSWR from 'swr';
import { PageNetwork } from '@/network/page';

export function usePageByIndex(survey: number, index: number) {
  const { data, mutate, error } = useSWR(
    `api_survey_${survey}_${index}`,
    PageNetwork.fetchPageByIndex(survey, index),
    {
      onErrorRetry: () => {},
    }
  );

  return {
    page: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
