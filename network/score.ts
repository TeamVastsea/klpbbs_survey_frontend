import { Paged } from '@/model/paged';
import { Score } from '@/model/score';
import { baseFetcher } from '@/network/base';

export class ScoreNetwork {
  public static submitAnswer = (surveyId: number, answer: object, scoreId?: number) =>
    baseFetcher<number>(
      `/api/score`,
      'POST',
      true,
      JSON.stringify({
        id: scoreId,
        survey: surveyId,
        content: answer,
      }),
      undefined,
      undefined,
      'application/json'
    );

  public static finishAnswer = (scoreId: number) =>
    baseFetcher<string>(
      `/api/score`,
      'PATCH',
      true,
      undefined,
      new URLSearchParams({ id: scoreId.toString() }),
      false
    );

  public static fetchUnfinishedAnswer = (survey: number) =>
    baseFetcher<{ id: number; answer: string; update_time: string }[]>(
      `/api/score`,
      'GET',
      true,
      undefined,
      new URLSearchParams({ survey: survey.toString() })
    );

  public static fetchSearchedScore = (
    page: number,
    size?: number,
    survey?: number,
    user?: number,
    onlyUnfinished?: boolean
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(survey !== undefined ? { survey: survey.toString() } : {}),
      ...(size !== undefined ? { size: size.toString() } : {}),
      ...(user !== undefined ? { user: user.toString() } : {}),
      ...(onlyUnfinished !== undefined ? { only_unfinished: onlyUnfinished.toString() } : {}),
    });

    return baseFetcher<Paged<Score[]>>(`/api/score/search`, 'GET', true, undefined, params);
  };

  public static exportAnswer = (survey: number) =>
    baseFetcher<string>(`/api/score/${survey}/export`, 'GET', true, undefined, undefined, false)();

  public static fetchScoreById = (id: number) =>
    baseFetcher<Score>(`/api/score/${id}`, 'GET', true);

  public static confirmScore = (id: number) =>
    baseFetcher<string>(`/api/score/${id}`, 'POST', true, undefined, undefined, false)();

  public static rejudgeScore = (id: number) =>
    baseFetcher<Score>(`/api/score/${id}`, 'PATCH', true)();
}
