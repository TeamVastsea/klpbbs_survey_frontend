import { Cookie } from '@/components/cookie';
import { SERVER_URL } from '@/api/BackendApi';

export default class SurveyApi {
    public static getList = async (page: number = 0, size: number = 10, search: string = '') => {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
        };

        const res = await fetch(`${SERVER_URL}/api/survey?page=${page}&size=${size}&search=${search}`, requestOptions);

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

        const res = await fetch(`${SERVER_URL}/api/survey/${id}`, requestOptions);

        const result: SurveyInfo = JSON.parse(await res.text());

        return result;
    };

    public static editSurvey = async (survey: SurveyInfo) => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(survey),
        };

        const res = await fetch(`${SERVER_URL}/api/survey`, requestOptions);

        if (!res.ok) {
            throw new Error('Failed to edit survey');
        }

        const result: SurveyInfo = await res.json();
        return result;
    };

    public static newSurvey = async (survey: NewSurveyInfo) => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(survey),
        };

        const res = await fetch(`${SERVER_URL}/api/survey`, requestOptions);

        if (!res.ok) {
            throw new Error('Failed to create new survey');
        }

        const result: string = await res.text();
        console.log(result);
        return result;
    };
}

export type NewSurveyInfo = Omit<SurveyInfo, 'id'>;

export interface SurveyInfo {
    id: number;
    title: string;
    budge: string;
    description: string;
    image: string;
    page: string;
    start_date: string;
    end_date: string;
    allow_submit: boolean;
    allow_view: boolean;
    allow_judge: boolean;
    allow_re_submit: boolean;
}
