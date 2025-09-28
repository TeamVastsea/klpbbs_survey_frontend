'use client';

import useSWR from 'swr';
import SurveyNetwork from '@/network/survey';

export function useSurveyList(page: number, size: number) {
  const { data, mutate, error } = useSWR(`api_survey_${page}_${size}`, SurveyNetwork.fetchSurveyList(page, size), {
    onErrorRetry: () => {},
  });

  return {
    surveyList: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
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
