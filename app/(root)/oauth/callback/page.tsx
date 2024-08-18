'use client';

import { Center, Stack, Space } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import UserInfoCard from './components/UserInfoCard';
import { Cookie } from '@/components/cookie';

export default function CallbackPage() {
    const searchParams = useSearchParams();

    const state = searchParams.get('state');
    const token = searchParams.get('token');

    fetch(`https://wj.klpbbs.cn/api/oauth?state=${state}&token=${token}`)
        .then(() => {
            notifications.show({
                title: '账户激活成功',
                message: undefined,
                color: 'green',
            });
        })
        .then(() => {
            fetch(`https://wj.klpbbs.cn/api/user?token=${state}`)
                .then(response => response.text())
                .then(result => {
                    const user = JSON.parse(result);

                    Cookie.setCookie('uid', user.uid, 7);
                    Cookie.setCookie('username', user.username, 7);
                });
        })
        .catch(e => {
            notifications.show({
                title: '账户激活失败，请将以下信息反馈给管理员',
                message: e.toString(),
                color: 'red',
            });
        });

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
