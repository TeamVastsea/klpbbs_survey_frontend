import { Cookie } from '@/components/cookie';
import { SERVER_URL } from '@/api/BackendApi';

export default class AnswerApi {
    public static async getAnswer(id: number): Promise<AnswerInfo> {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
        };

        const res = await fetch(`${SERVER_URL}/api/answer/${id}`, requestOptions);

        if (!res.ok) {
            throw new Error('Failed to get answer');
        }

        return await res.json() as AnswerInfo;
    }
}

export interface AnswerInfo {
    id: number;
    survey: number;
    user: number;
    answers: Object;
    score: null | number;
    create_time: string;
    completed: boolean;
}
