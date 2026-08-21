'use client';

import useSWR from 'swr';
import SurveyNetwork from '@/network/survey';

export function useSurveyList(page: number, size: number, search?: string) {
  const normalizedSearch = search?.trim() ?? '';
  const listKey = ['api_survey', page, size, normalizedSearch] as const;
  const nextItemKey = ['api_survey_next_item', page, size, normalizedSearch] as const;

  const { data, mutate, error } = useSWR(
    listKey,
    SurveyNetwork.fetchSurveyList(page, size, normalizedSearch),
    {
      onErrorRetry: () => {},
    }
  );
  const {
    data: nextItem,
    mutate: mutateNextItem,
    error: nextItemError,
  } = useSWR(nextItemKey, SurveyNetwork.fetchSurveyList((page + 1) * size, 1, normalizedSearch), {
    onErrorRetry: () => {},
  });

  return {
    surveyList: data,
    hasNextPage: (nextItem?.length ?? 0) > 0,
    isLoading: (!error && !data) || (!nextItemError && !nextItem),
    isError: error ?? nextItemError,
    mutate: () => Promise.all([mutate(), mutateNextItem()]),
  };
}

export function useSurveyId(id: number) {
  const { data, mutate, error } = useSWR(`api_survey_${id}`, SurveyNetwork.fetchSurveyById(id), {
    onErrorRetry: () => {},
  });

  return {
    survey: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
