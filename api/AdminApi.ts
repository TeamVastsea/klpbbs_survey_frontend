import { notifications } from '@mantine/notifications';
import { Cookie } from '@/components/cookie';
import { SERVER_URL } from '@/api/BackendApi';

export default class AdminApi {
    public static async getAdminInfo(id: number): Promise<any> {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
        };

        const res = await fetch(`${SERVER_URL}/api/admin?id=${id?.toString()}`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '获取管理信息失败, 请将以下信息反馈给管理员',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to get admin info');
        }

        return res.json();
    }

    public static async getAdminTokenInfo(): Promise<TokenQueryResponse<AdminInfo>> {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
        };

        const result: Response = await fetch(`${SERVER_URL}/api/token/admin`, requestOptions);

        if (!result.ok) {
            return {
                ok: false,
                result: {
                    id: 0,
                    username: 'unknown',
                    disabled: true,
                },
            };
        }

        const info: AdminInfo = await result.json();

        return {
            ok: true,
            result: info,
        };
    }

    public static async getTokenInfo(): Promise<TokenQueryResponse<UserInfo>> {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
        };

        const result: Response = await fetch(`${SERVER_URL}/api/token`, requestOptions);

        if (!result.ok) {
            return {
              ok: false,
              result: {
                uid: '0',
                username: 'unknown',
              },
            };
        }

        const info: UserInfo = await result.json();

        return {
            ok: true,
            result: info,
        };
    }
}

export interface TokenQueryResponse<T> {
    ok: boolean;
    result: T
}

export interface AdminInfo {
    id: number;
    username: string;
    disabled: boolean;
}

export interface UserInfo {
    uid: string;
    username: string;
}
