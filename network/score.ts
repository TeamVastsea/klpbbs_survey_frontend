import {baseFetcher} from "@/network/base";

export class ScoreNetwork {
  public static submitAnswer = (surveyId: number, answer: object, scoreId?: number) =>
    baseFetcher<number>(`/api/score`, "POST", true, JSON.stringify({
      id: scoreId,
      survey: surveyId,
      content: answer
    }), undefined, undefined, 'application/json');

  public static finishAnswer = (scoreId: number) =>
    baseFetcher<string>(`/api/score`, "PATCH", true, undefined, new URLSearchParams({id: scoreId.toString()}), false);
}
