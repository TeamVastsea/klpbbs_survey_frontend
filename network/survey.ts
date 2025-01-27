import {baseFetcher} from "@/network/base";
import Survey from "@/model/survey";

export default class SurveyNetwork {
  public static fetchSurveyList = baseFetcher<Survey[]>("/api/survey", "GET", true);
}
