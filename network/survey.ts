import {Survey} from '@/model/survey';
import {baseFetcher} from '@/network/base';

export default class SurveyNetwork {
  public static fetchSurveyList = (page: number, size: number) =>
    baseFetcher<Survey[]>('/api/survey', 'GET', true, undefined, new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    }));

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
