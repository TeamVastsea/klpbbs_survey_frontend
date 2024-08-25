import { notifications } from '@mantine/notifications';
import { SERVER_URL } from '@/api/BackendApi';

export default class UserApi {
    public static async getToken(): Promise<string> {
        const myHeaders = new Headers();

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
        };

        const res = await fetch(`${SERVER_URL}/api/user`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '获取 token 失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to get token');
        }

        return res.text();
    }

    public static async activateToken(state: string, token: string): Promise<{}> {
        const myHeaders = new Headers();

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
        };

        const res = await fetch(`${SERVER_URL}/api/oauth?state=${state}&token=${token}`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '激活 token 失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to activate token');
        }

        return {};
    }

    public static async getUserInfo(token: string): Promise<{ uid: string, username: string }> {
        const myHeaders = new Headers();
        myHeaders.append('token', token);

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
        };

        const res = await fetch(`${SERVER_URL}/api/user`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '获取用户信息失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to get user info');
        }

        return JSON.parse(await res.text());
    }
}
