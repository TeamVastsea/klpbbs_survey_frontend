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

export function useScoreById(score: number) {
  const { data, mutate, error } = useSWR(
    `api_score_${score}`,
    ScoreNetwork.fetchScoreById(score),
    {
      onErrorRetry: () => {},
      revalidateOnFocus: true,
      revalidateIfStale: true,
      dedupingInterval: 0, // 禁用重复请求的去重，确保每次都获取最新数据
    }
  );

  return {
    score: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
