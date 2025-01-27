'use client';

import useSWR from "swr";
import SurveyNetwork from "@/network/survey";

export default function useSurveyList() {
  const {data, mutate, error} = useSWR('api_survey', SurveyNetwork.fetchSurveyList,  {
    onErrorRetry: () => {}
  });

  return {
    surveyList: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}
