import { Cookie } from '@/components/cookie';
import { SERVER_URL } from '@/api/BackendApi';
import { Value } from '@/app/(root)/survey/components/generateQuestion';

export default class QuestionApi {
    public static createPage = async (title?: string) => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
        };

        const res = await fetch(`${SERVER_URL}/api/question/sheet?title=${title}`, requestOptions);

        if (!res.ok) {
            throw new Error('Failed to create question sheet');
        }

        const result: string = await res.text();

        return result;
    };

    public static createQuestion = async (question: QuestionContent) => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(question),
        };

        const res = await fetch(`${SERVER_URL}/api/question`, requestOptions);

        if (!res.ok) {
            throw new Error('Failed to create question');
        }

        const result: string = await res.text();
        return result;
    };
}

export interface QuestionContent {
    content: Value;
    type: string;
    values: Value[];
    condition: Object[] | undefined;
    required: boolean | undefined;
    answer: Answer | undefined;
}
export interface Answer {
    all_points: number;
    sub_points: number;
    answer: string;
}
