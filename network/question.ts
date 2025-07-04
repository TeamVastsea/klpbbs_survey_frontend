import { Question } from '@/model/question';
import { baseFetcher } from '@/network/base';

export class QuestionNetwork {
  public static fetchQuestionByPage = (page: number) =>
    baseFetcher<Question[]>(
      `/api/question`,
      'GET',
      true,
      undefined,
      new URLSearchParams({ page: page.toString() })
    );
  public static newQuestion = (question: Question) =>
    baseFetcher<string>(
      `/api/question`,
      'POST',
      true,
      JSON.stringify(question),
      undefined,
      false,
      'application/json'
    );
  public static modifyQuestion = (question: Question) =>
    baseFetcher<string>(
      `/api/question`,
      'PUT',
      true,
      JSON.stringify(question),
      undefined,
      false,
      'application/json'
    );
  public static swapQuestion = (page: number, from: number, to: number) =>
    baseFetcher<string>(
      `/api/question`,
      'PATCH',
      true,
      JSON.stringify({ page, from, to }),
      undefined,
      false,
      'application/json'
    );
}
