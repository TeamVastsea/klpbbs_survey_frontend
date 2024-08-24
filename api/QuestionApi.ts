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
            throw new Error('Failed to create question sheet');
        }

        const result: string = await res.text();

        return result;
    };
}
