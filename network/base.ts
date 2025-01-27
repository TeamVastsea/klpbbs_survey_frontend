'use client';

import {notifications} from "@mantine/notifications";

export const SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_URL === undefined ?
  '' : process.env.NEXT_PUBLIC_BACKEND_URL;

export function baseFetcher<T>(
  url: string,
  method: string,
  useToken: boolean,
  body?: string,
  params?: URLSearchParams,
  needParse: boolean = true,
  contentType: string = 'text/plain;charset=UTF-8'
): () => Promise<T> {
  return async () => {
    let requestUrl = SERVER_URL + url;
    if (params !== undefined) {
      requestUrl += `?${params.toString()}`;
    }

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', contentType);

    if (useToken) {
      const token = localStorage.getItem("token");
      if (token == null || token === '') {
        errorHandler(401, 'Token not found', url);
        throw new Error('Token not found');
      }
      myHeaders.set('token', token);
    }

    const requestOptions: RequestInit = {
      method,
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

    if (!needParse) {
      return responseText as unknown as T;
    }


    return JSON.parse(responseText) as T;
  };
}

export function errorHandler(code: number, message: string, _path: string) {
  switch (code) {
    case 400: // Invalid params
      notifications.show({title: '参数错误', message, color: 'red'});
      break;
    case 401: // Invalid token
      if (!location.href.endsWith('/oauth') && !location.href.endsWith('/')) {
        notifications.show({title: '登录无效', message: '请先登录', color: 'red'});
      }
      break;
    case 403: // Permission denied
      notifications.show({title: '权限不足', message: '请联系管理员', color: 'red'});
      break;
    case 404: // Not found
      notifications.show({title: '资源不存在', message, color: 'red'});
      break;
    case 429: // Too many requests
      break;
    case 500: // Panic or database error
      notifications.show({title: '服务器错误', message: '请稍后再试', color: 'red'});
      break;
    default:

  }
}
