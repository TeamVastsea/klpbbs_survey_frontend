import { notifications } from '@mantine/notifications';
import { Cookie } from '@/components/cookie';
import { SERVER_URL } from '@/api/BackendApi';

export default class PageApi {
    public static fetchPage = async (page: number) => {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
        };

        const res = await fetch(`${SERVER_URL}/api/page/${page}`, requestOptions);

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

    public static fetchPageByIndex = async (survey: number, index: number) => {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
        };

        const res = await fetch(`${SERVER_URL}/api/page?survey=${survey}&index=${index}`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '获取页面失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to fetch question');
        }

        const result: IndexPageResponse = await res.json();

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

        const res = await fetch(`${SERVER_URL}/api/page`, requestOptions);

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

    public static newPage =
        async (title: string, survey: number, index: number): Promise<string> => {
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('token', Cookie.getCookie('token'));

            const body = JSON.stringify({ title, survey, index });

            const requestOptions: RequestInit = {
                method: 'POST',
                headers: myHeaders,
                body,
            };

            const res = await fetch(`${SERVER_URL}/api/page`, requestOptions);

            if (!res.ok) {
                notifications.show({
                    title: '创建页面失败, 请将以下信息反馈给管理员',
                    message: `${res.statusText}: ${await res.text()}`,
                    color: 'red',
                });

                throw new Error('Failed to create new page');
            }

            return res.text();
        };
}

export interface IndexPageResponse {
    data: Page;
    total: number;
}

export interface Page {
    id: number;
    title: string;
    survey: string;
}
