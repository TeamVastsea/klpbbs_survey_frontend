import useSWR from "swr";
import {ScoreNetwork} from "@/network/score";

export function useSearchedScore(page: number, size?: number, survey?: number, user?: number, only_unfinished?: boolean) {
  const {
    data,
    mutate,
    error
  } = useSWR(`api_survey_${page}_${size}_${survey}_${user}_${only_unfinished}`,
    ScoreNetwork.fetchSearchedScore(page, size, survey, user, only_unfinished), {
      onErrorRetry: () => {
      },
    });

  return {
    answers: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
