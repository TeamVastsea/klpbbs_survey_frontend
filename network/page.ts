import { Page } from '@/model/page';
import { Paged } from '@/model/paged';
import { baseFetcher } from '@/network/base';

export class PageNetwork {
  public static fetchPageByIndex = (survey: number, index: number) =>
    baseFetcher<Paged<Page>>(
      `/api/page`,
      'GET',
      true,
      undefined,
      new URLSearchParams({ survey: survey.toString(), index: index.toString() })
    );

  public static savePage = (page: Page) =>
    baseFetcher<string>(
      '/api/page',
      'PUT',
      true,
      JSON.stringify(page),
      undefined,
      false,
      'application/json'
    )();

  public static newPage = (title: string, survey: number, index: number) =>
    baseFetcher<string>(
      '/api/page',
      'POST',
      true,
      JSON.stringify({ title, survey, index }),
      undefined,
      false,
      'application/json'
    )();
}
