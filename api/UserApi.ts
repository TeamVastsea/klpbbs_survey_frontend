import { notifications } from '@mantine/notifications';
import { SERVER_URL } from '@/api/BackendApi';
import { Cookie } from '@/components/cookie';

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
        Promise<{ uid: string, username: string, admin: boolean, source: string }> {
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

        return res.json();
    }

    public static async getOtherUserInfo(uid: string):
        Promise<{ uid: string, username: string, admin: boolean }> {
        if (uid === null) {
            return {
                uid: '',
                username: '',
                admin: false,
            };
        }

        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
        };

        const res = await fetch(`${SERVER_URL}/api/user/${uid}`, requestOptions);

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

    public static async register(username: string, password: string) {
        const requestOptions: RequestInit = {
            method: 'POST',
        };

        const res = await fetch(`${SERVER_URL}/api/user/password?username=${username}&password=${password}`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '注册失败',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to get judge result');
        }
    }

    public static async login(username: string, password: string) {
        const requestOptions: RequestInit = {
            method: 'GET',
        };

        const res = await fetch(`${SERVER_URL}/api/user/password?username=${username}&password=${password}`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '登录失败',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to get judge result');
        }

        return res.text();
    }

    public static async changePassword(old_password: string, new_password: string, id: string) {
        const requestOptions: RequestInit = {
            method: 'PUT',
        };

        const res = await fetch(`${SERVER_URL}/api/user/password?old=${old_password}&new=${new_password}&id=${id}`, requestOptions);

        if (!res.ok) {
            notifications.show({
                title: '注册失败',
                message: `${res.statusText}: ${await res.text()}`,
                color: 'red',
            });

            throw new Error('Failed to get judge result');
        }
    }
}
