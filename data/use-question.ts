import useSWR from 'swr';
import { QuestionNetwork } from '@/network/question';

export function useQuestionByPage(page: number) {
  const { data, mutate, error } = useSWR(
    `api_question_${page}`,
    QuestionNetwork.fetchQuestionByPage(page),
    {
      onErrorRetry: () => {},
      revalidateOnFocus: true,
      revalidateIfStale: true,
      dedupingInterval: 0, // 禁用重复请求的去重，确保每次都获取最新数据
    }
  );

  return {
    questionList: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
