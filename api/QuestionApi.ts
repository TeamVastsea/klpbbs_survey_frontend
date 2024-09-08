import { notifications } from '@mantine/notifications';
import { Cookie } from '@/components/cookie';
import { SERVER_URL } from '@/api/BackendApi';

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
            notifications.show({
                title: '创建页面失败, 请将以下信息反馈给管理员',
                message: `${res.statusText} ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to fetch question');
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

    public static fetchPage = async (page: string) => {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
        };

        const res = await fetch(`${SERVER_URL}/api/question?page=${page}`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '获取页面失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to fetch question');
        }

        const result: Page = await res.json();

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

        const result: QuestionProps = await res.json();

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

        const result: QuestionProps = await res.json();

        return result;
    };

    public static updatePage = async (input: Page): Promise<String> => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('token', Cookie.getCookie('token'));

        const body = JSON.stringify(input);

        const requestOptions: RequestInit = {
            method: 'PUT',
            headers: myHeaders,
            body,
        };

        const res = await fetch(`${SERVER_URL}/api/question/sheet`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '更新页面失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to update question');
        }

        return res.text();
    };

    public static updateQuestion = async (input: StringifyQuestionProps) => {
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
    all_points: number | undefined;
    sub_points: number | undefined;
    answer: string;
}

export interface Page {
    id: string;
    title: string;
    budge: string;
    content: Array<string>;
    next: string | null;
    previous: string | null;
}

export interface Value {
    content: string;
    title: string;
}

export interface QuestionProps {
    id: string;
    content: Value;
    type: number;
    values: Value[];
    condition: string | undefined;
    answer: string | undefined;
    all_points: number | undefined;
    sub_points: number | undefined;
    required: boolean | undefined;
}

export interface StringifyQuestionProps {
    id: string;
    content: Value;
    type: string;
    values: Value[];
    condition: string | undefined;
    answer: Answer | undefined;
    required: boolean;
}

export interface PageResponse {
    id: string;
    title: string;
    budge: string;
    content: string[];
    next: string | null;
    previous: string | null;
}
