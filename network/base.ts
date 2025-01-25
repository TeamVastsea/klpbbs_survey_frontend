'use client';

import {useLocalStorage} from "@mantine/hooks";
import {useRouter} from "next/navigation";
import {notifications} from "@mantine/notifications";

export const SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_URL === undefined ?
  '' : process.env.NEXT_PUBLIC_BACKEND_URL;

export function baseFetcher<T>(
  url: string,
  method: string,
  useToken: boolean,
  body?: string,
  params?: URLSearchParams
): () => Promise<T> {
  return async () => {
    let requestUrl = SERVER_URL + url;
    if (params !== undefined) {
      requestUrl += '?' + params.toString();
    }

    const myHeaders = new Headers();

    if (useToken) {
      const [token, ] = useLocalStorage({
        key: 'token',
        defaultValue: '',
      });
      if (token == undefined && token === '') {
        errorHandler(401, 'Token not found', url);
        throw new Error('Token not found');
      }
      myHeaders.append('token', token);
    }

    const requestOptions: RequestInit = {
      method: method,
      headers: myHeaders,
      redirect: 'follow',
      body: method === "GET" ? undefined : body,
    };

    const res = await fetch(requestUrl, requestOptions);
    const responseText = await res.text();

    if (!res.ok) {
      errorHandler(res.status, responseText, url);
      throw new Error(responseText);
    }

    return JSON.parse(responseText) as T;
  };
}

export function errorHandler(code: number, message: string, path: string) {
  const router = useRouter();

  switch (code) {
    case 400: // Invalid params
      console.error('Invalid params on ' + path + ': ' + message);
      notifications.show({title: '参数错误', message: message, color: 'red'});
      break;
    case 401: // Invalid token
      console.error('Invalid token on ' + path + ': ' + message);
      notifications.show({title: '登录无效', message: '请先登录', color: 'red'});
      router.push('/login');
      break;
    case 403: // Permission denied
      console.error('No permission on ' + path + ': ' + message);
      notifications.show({title: '权限不足', message: '请联系管理员', color: 'red'});
      break;
    case 404: // Not found
      console.error('Not found request to ' + path + ': ' + message);
      break;
    case 429: // Too many requests
      console.error('Too many requests on ' + path + ': ' + message);
      break;
    case 500: // Panic or database error
      console.error('Internal server error on ' + path + ': ' + message);
      notifications.show({title: '服务器错误', message: '请稍后再试', color: 'red'});
      break;
    default:
      console.error('Unknown error on ' + path + ': ' + message);
  }
}
