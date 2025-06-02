import useSWR from 'swr';
import { QuestionNetwork } from '@/network/question';

export function useQuestionByPage(page: number) {
  const { data, mutate, error } = useSWR(
    `api_question_${page}`,
    QuestionNetwork.fetchQuestionByPage(page),
    {
      onErrorRetry: () => {},
    }
  );

  return {
    questionList: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
