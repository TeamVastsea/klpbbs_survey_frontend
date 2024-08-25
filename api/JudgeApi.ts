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
                title: '判卷失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to get judge result');
        }

        return res.json();
    }

    public static async confirmJudge(answer: string) {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
        };

        const result = await fetch(`http://127.0.0.1:25000/api/judge?answer=${answer}`, requestOptions)
            .then((res) => res)
            .catch((error) => {
                notifications.show({
                    title: '确认判卷失败',
                    message: error.toString(),
                    color: 'red',
                });
            });
        if (!result?.ok) {
            const reason = await result?.text();
            notifications.show({
                title: '确认失败',
                message: reason,
                color: 'red',
            });
        } else {
            notifications.show({
                title: '确认成功',
                message: '已成功确认判卷',
                color: 'green',
            });
        }
    }
}

export interface JudgeResult {
    full: number;
    user: number;
    scores: object;
    completed: boolean;
}
