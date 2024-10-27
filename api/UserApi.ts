import { notifications } from '@mantine/notifications';
import { SERVER_URL } from '@/api/BackendApi';

export default class UserApi {
    public static async getToken(token: string): Promise<string> {
        const requestOptions: RequestInit = {
            method: 'GET',
        };

        const res = await fetch(`${SERVER_URL}/api/oauth?token=${token}`, requestOptions);

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

    public static async invalidateToken(token: string) {
        const myHeaders = new Headers();
        myHeaders.append('token', token);

        const requestOptions: RequestInit = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow',
        };

        fetch(`${SERVER_URL}/api/user`, requestOptions)
          .then(() => {})
          .catch((e) => notifications.show({
              title: '注销失败, 请将以下信息反馈给管理员',
              message: e.toString(),
              color: 'red',
          }));
    }

    public static async getUserInfo(token: string):
        Promise<{ uid: string, username: string, admin: boolean }> {
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
