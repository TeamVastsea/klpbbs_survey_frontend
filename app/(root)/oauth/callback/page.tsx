'use client';

import { Center, Stack, Space } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { toKeyAlias } from '@babel/types';
import UserInfoCard from './components/UserInfoCard';
import { Cookie } from '@/components/cookie';

export default function CallbackPage() {
    const searchParams = useSearchParams();

    const token = searchParams.get('token');

    fetch(`https://wj.klpbbs.cn/api/user?token=${token}`)
        .then(response => response.text())
        .then(result => {
            const user = JSON.parse(result);

            Cookie.setCookie('uid', user.uid, 7);
            Cookie.setCookie('username', user.username, 7);
        })
        .catch(
            error => console.log('error', error)
        );

    const uid = Cookie.getCookie('uid');
    const username = Cookie.getCookie('username');

    return (
        <Center>
            <Stack>
                <Space h={100} />
                <UserInfoCard id={uid} username={username} />
                <Space h={100} />
            </Stack>
        </Center>
    );
}
