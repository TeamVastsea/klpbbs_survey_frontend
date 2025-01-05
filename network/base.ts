import {useLocalStorage} from "@mantine/hooks";

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
      myHeaders.append('token', token);
    }

    const requestOptions: RequestInit = {
      method: method,
      headers: myHeaders,
      redirect: 'follow',
      body: method === "GET" ? undefined : body,
    };

    const res = await fetch(requestUrl, requestOptions);

    if (!res.ok) {
      errorHandler(res.status, await res.text());
    }

    const responseText = await res.text();
    return JSON.parse(responseText) as T;
  };
}

export function errorHandler(code: number, message: string) {
  // TODO: Implement error handling
}
