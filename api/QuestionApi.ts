import { notifications } from '@mantine/notifications';
import { Cookie } from '@/components/cookie';
import { SERVER_URL } from '@/api/BackendApi';

export default class QuestionApi {
    public static createQuestion = async (question: Question) => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(question, null, 4).toString(),
        };

        const res = await fetch(`${SERVER_URL}/api/question`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '创建问题失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to fetch question');
        }

        const result: string = await res.text();
        return result;
    };

    public static fetchSingleQuestion = async (id: string) => {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
        };

        const res = await fetch(`${SERVER_URL}/api/question/${id}`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '获取单个问题失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to fetch question');
        }

        const result: Question = await res.json();

        return result;
    };

    public static fetchQuestionByPage = async (page: number) => {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
        };

        const res = await fetch(`${SERVER_URL}/api/question?page=${page}`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '获取问题失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to fetch question');
        }

        const result: Question[] = await res.json();

        return result;
    };

    public static fetchSingleQuestionAdmin = async (id: string) => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
        };

        const res = await fetch(`${SERVER_URL}/api/question/admin/${id}`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '获取单个问题失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to fetch question');
        }

        const result: Question = await res.json();

        return result;
    };

    public static updateQuestion = async (input: Question) => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('token', Cookie.getCookie('token'));

        const body = JSON.stringify(input, null, 4);

        const requestOptions: RequestInit = {
            method: 'PUT',
            headers: myHeaders,
            body,
        };

        const res = await fetch(`${SERVER_URL}/api/question`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '更新问题失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to update question');
        }

        const result: string = await res.text();

        return result;
    };

    public static swapQuestion = async (page: number, from: number, to: number) => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('token', Cookie.getCookie('token'));

        const body = { page, from, to };

        const requestOptions: RequestInit = {
            method: 'PATCH',
            headers: myHeaders,
            body: JSON.stringify(body),
        };

        const res = await fetch(`${SERVER_URL}/api/question`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '更新问题失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to update question');
        }
    };
}

export interface Question {
    page: number;
    id: number;
    content: Value;
    type: string;
    values: Value[];
    condition: Object[] | undefined;
    required: boolean | undefined;
    answer: Answer | undefined;
}
export interface Answer {
    all_points?: number;
    sub_points?: number;
    answer: string;
}

export interface Value {
    content: string;
    title: string;
}

// export interface Question {
//     id: number;
//     content: Value;
//     type: number;
//     values: Value[];
//     condition: string | undefined;
//     answer: string | undefined;
//     all_points: number | undefined;
//     sub_points: number | undefined;
//     required: boolean | undefined;
// }

// export interface StringifyQuestionProps {
//     id: number;
//     content: Value;
//     type: string;
//     values: Value[];
//     condition: string | undefined;
//     answer: Answer | undefined;
//     required: boolean;
// }
