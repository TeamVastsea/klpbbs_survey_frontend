import { notifications } from '@mantine/notifications';
import { SERVER_URL } from '@/api/BackendApi';
import { Cookie } from '@/components/cookie';

export default class JudgeApi {
    public static async doJudge(answer: string): Promise<JudgeResult> {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
        };

        const res = await fetch(`${SERVER_URL}/api/judge?answer=${answer}`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '判卷失败，请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to get judge result');
        }
        
        return res.json();
    }
}

export interface JudgeResult {
    full: number;
    user: number;
    scores: object;
}
