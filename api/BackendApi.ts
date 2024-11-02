import { notifications } from '@mantine/notifications';
import { Cookie } from '@/components/cookie';

export const SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_URL === undefined ?
    'https://wj.klpbbs.cn' : process.env.NEXT_PUBLIC_BACKEND_URL;

export const handleError = (errorMessage: string, status: number) => {
    if (status === 401) {
        Cookie.clearAllCookies();
        window.location.href = '/';
        notifications.show({
            title: '登录失效',
            message: '请重新登录',
            color: 'red',
        });
        return true;
    }

    return false;
};
