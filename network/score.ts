import {baseFetcher} from '@/network/base';
import {Paged} from "@/model/paged";
import {Score} from "@/model/score";

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
      new URLSearchParams({id: scoreId.toString()}),
      false
    );

  public static fetchUnfinishedAnswer = (survey: number) =>
    baseFetcher<{ id: number; answer: string; update_time: string }[]>(
      `/api/score`,
      'GET',
      true,
      undefined,
      new URLSearchParams({survey: survey.toString()})
    );

  public static fetchSearchedScore = (page: number, size?: number, survey?: number, user?: number, only_unfinished?: boolean) => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(survey !== undefined ? {survey: survey.toString()} : {}),
      ...(size !== undefined ? {size: size.toString()} : {}),
      ...(user !== undefined ? {user: user.toString()} : {}),
      ...(only_unfinished !== undefined
        ? {only_unfinished: only_unfinished.toString()}
        : {})
    })

    return baseFetcher<Paged<Score[]>>(
      `/api/score/search`,
      'GET',
      true,
      undefined,
      new URLSearchParams(params)
    )
  }

  public static exportAnswer = (survey: number) =>
    baseFetcher<string>(
      `/api/score/${survey}/export`,
      'GET',
      true,
      undefined,
      undefined,
      false
    )();
}
