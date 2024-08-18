'use client';

import { Center, Stack, Space, LoadingOverlay, Box } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import UserInfoCard from './components/UserInfoCard';
import { Cookie } from '@/components/cookie';

export default function CallbackPage() {
    const searchParams = useSearchParams();

    const [username, setUsername] = useState('');
    const [uid, setUid] = useState('');
    const [loading, setLoading] = useState(true);

    const state = searchParams.get('state');
    const token = searchParams.get('token');

    fetch(`https://wj.klpbbs.cn/api/oauth?state=${state}&token=${token}`)
        .then(() => {
            const myHeaders = new Headers();
            myHeaders.append('token', state as string);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
            };

            fetch('https://wj.klpbbs.cn/api/user', requestOptions)
                .then(response => response.text())
                .then(result => {
                    const user = JSON.parse(result);

                    Cookie.setCookie('status', 'ok', 7);
                    Cookie.setCookie('uid', user.uid, 7);
                    Cookie.setCookie('username', user.username, 7);

                    setUid(user.uid);
                    setUsername(user.username);
                    setLoading(false);
                })
                .catch(e => {
                    notifications.show({
                        title: '获取用户信息失败，请将以下信息反馈给管理员',
                        message: e.toString(),
                        color: 'red',
                    });
                });
        })
        .catch(e => {
            notifications.show({
                title: '账户激活失败，请将以下信息反馈给管理员',
                message: e.toString(),
                color: 'red',
            });
        });

    return (
        <Center>
            <Stack>
                <Space h={100} />
                <Box pos="relative">
                    <UserInfoCard id={uid} username={username} />
                    <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm', blur: 2 }} />
                </Box>
                <Space h={100} />
            </Stack>
        </Center>
    );
}
