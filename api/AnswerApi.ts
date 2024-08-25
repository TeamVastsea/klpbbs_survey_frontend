import { notifications } from '@mantine/notifications';
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
            notifications.show({
                title: '获取题目失败，请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

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
