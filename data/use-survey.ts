'use client';

import useSWR from 'swr';
import SurveyNetwork from '@/network/survey';

export function useSurveyList() {
  const { data, mutate, error } = useSWR('api_survey', SurveyNetwork.fetchSurveyList, {
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
