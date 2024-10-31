import { notifications } from '@mantine/notifications';
import { Cookie } from '@/components/cookie';
import { handleError, SERVER_URL } from '@/api/BackendApi';

export default class ScoreApi {
    public static async submitAnswer(props: SaveRequest): Promise<number> {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));
        myHeaders.append('Content-Type', 'application/json');

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(props),
            redirect: 'follow',
        };

        const res = await fetch(`${SERVER_URL}/api/score`, requestOptions);

        if (!res.ok) {
            if (res.status === 429) {
                notifications.show({
                    title: '重复提交',
                    message: '该问卷不支持重复提交',
                    color: 'red',
                });
            }

            if (!handleError(await res.text(), res.status)) {
                notifications.show({
                    title: '提交答案失败, 请将以下信息反馈给管理员',
                    message: `${res.statusText}: ${await res.text()}`,
                    color: 'red',
                });
            }

            throw new Error('Failed to submit answer');
        }

        return Number(await res.text());
    }

    public static async getAnswerList(survey: number): Promise<ScorePrompt[]> {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
        };

        const res = await fetch(`${SERVER_URL}/api/score?survey=${survey}`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '获取问卷答案失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to get answer');
        }

        return res.json();
    }

    public static async finishAnswer(id: number): Promise<void> {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'PATCH',
            headers: myHeaders,
            redirect: 'follow',
        };

        const res = await fetch(`${SERVER_URL}/api/score?id=${id}`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '提交答案失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to submit answer');
        }
    }

    public static async getAnswer(id: number): Promise<Score> {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
        };

        const res = await fetch(`${SERVER_URL}/api/score/${id}`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '获取问卷答案失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to get answer');
        }

        return (await res.json()) as Score;
    }

    public static async judgeAnswer(id: number): Promise<Score> {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'PATCH',
            headers: myHeaders,
        };

        const res = await fetch(`${SERVER_URL}/api/score/${id}`, requestOptions);

        if (!res.ok) {
            if (res.status === 429) {
                notifications.show({
                    title: '重复提交',
                    message: '该问卷已经确认分数，不支持重复提交',
                    color: 'red',
                });

                throw new Error('Already judged');
            }

            notifications.show({
                title: '获取问卷答案失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to get answer');
        }

        return (await res.json()) as Score;
    }

    public static async searchAnswerList(page: number,
                                         size: number | null,
                                         survey: number | null,
                                         user: number | null,
                                         unfinishedOnly: boolean)
        : Promise<PagedResponse<AnswerInfo>> {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
        };

        let queryString = `?page=${page}&only_unfinished=${unfinishedOnly}`;

        if (size !== null) {
            queryString += `&size=${size}`;
        }
        if (survey !== null) {
            queryString += `&survey=${survey}`;
        }
        if (user !== null) {
            queryString += `&user=${user}`;
        }

        const res = await fetch(`${SERVER_URL}/api/score/search${queryString}`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '获取问卷答案失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to get answer');
        }

        return res.json();
    }
}

export interface SaveRequest {
    survey: number;
    content: any;
    id?: number;
}

export interface AnswerInfo {
    id: number;
    survey: number;
    user: number;
    answers: Object;
    score: null | number;
    update_time: string;
    completed: boolean;
}

export interface PagedResponse<T> {
    data: T[];
    total: number;
}

export interface ScorePrompt {
    id: number;
    answer: string;
    update_time: string;
}

export interface Score {
    id: number;
    survey: number;
    user: string;
    answer: string;
    completed: boolean;
    update_time: string;
    judge?: string;
    judge_time?: string;
    scores?: string;
    user_scores?: number;
    full_scores?: number;
}
