import {baseFetcher} from "@/network/base";
import {Page} from "@/model/page";
import {Paged} from "@/model/paged";

export class PageNetwork {
  public static fetchPageByIndex = (survey: number, index: number) =>
    baseFetcher<Paged<Page>>(`/api/page`, "GET", true, undefined,
      new URLSearchParams({survey: survey.toString(), index: index.toString()}));
}
