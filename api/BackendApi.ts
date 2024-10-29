import { notifications } from '@mantine/notifications';
import { Cookie } from '@/components/cookie';

// export const SERVER_URL = 'https://wj.klpbbs.cn';
export const SERVER_URL = 'http://127.0.0.1:25000';

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
