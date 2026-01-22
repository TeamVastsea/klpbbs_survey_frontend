import useSWR from 'swr';
import {PageNetwork} from '@/network/page';

export function usePageByIndex(survey: number, index: number) {
  const {data, mutate, error} = useSWR(
    `api_survey_${survey}_${index}`,
    PageNetwork.fetchPageByIndex(survey, index),
    {
      onErrorRetry: () => {
      },
      revalidateOnFocus: true,
      revalidateIfStale: true,
      dedupingInterval: 0, // 禁用重复请求的去重，确保每次都获取最新数据
    },
  );

  return {
    page: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
