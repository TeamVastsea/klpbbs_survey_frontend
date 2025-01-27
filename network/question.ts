import {baseFetcher} from "@/network/base";
import {Question} from "@/model/question";

export class QuestionNetwork {
    public static fetchQuestionByPage = (page: number) =>
      baseFetcher<Question[]>(`/api/question`, "GET", true, undefined, new URLSearchParams({page: page.toString()}));
}
