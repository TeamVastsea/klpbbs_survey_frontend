import { Cookie } from '@/components/cookie';
import { SERVER_URL } from '@/api/BackendApi';

export default class RefreshCacheApi {
    public static refreshCache = async (type?: string): Promise<void> => {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const queryParams = type ? `?type=${encodeURIComponent(type)}` : '?type=Both';

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
        };

        const res = await fetch(`${SERVER_URL}/api/refresh${queryParams}`, requestOptions);

        if (!res.ok) {
            throw new Error('Failed to refresh cache');
        }
    };
}
