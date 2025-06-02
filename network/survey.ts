import { Survey } from '@/model/survey';
import { baseFetcher } from '@/network/base';

export default class SurveyNetwork {
  public static fetchSurveyList = baseFetcher<Survey[]>('/api/survey', 'GET', true);

  public static fetchSurveyById = (id: number) =>
    baseFetcher<Survey>(`/api/survey/${id}`, 'GET', true);

  public static saveSurvey = (survey: Survey, create: boolean) =>
    baseFetcher<Survey>(
      `/api/survey`,
      create ? 'POST' : 'PUT',
      true,
      JSON.stringify(survey),
      undefined,
      false,
      'application/json'
    )();
}
