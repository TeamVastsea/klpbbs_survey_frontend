import { Cookie } from '@/components/cookie';

export default class SurveyApi {
    public static getList = async (page: number = 0, size: number = 10, search: string = '') => {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
        };

        const res = await fetch(`https://wj.klpbbs.cn/api/survey?page=${page}&size=${size}&search=${search}`, requestOptions);

        const result: SurveyInfo[] = JSON.parse(await res.text());

        return result;
    };

    public static getSurvey = async (id: number) => {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
        };

        const res = await fetch(`https://wj.klpbbs.cn/api/survey/${id}`, requestOptions);

        const result: SurveyInfo = JSON.parse(await res.text());

        return result;
    };
}

export interface SurveyInfo {
    id: number;
    title: string;
    budge: string;
    description: string;
    image: string;
    page: number;
    start_date: string;
    end_date: string;
}
