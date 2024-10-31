'use client';

import { Center, Stack, Space, LoadingOverlay, Box } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import UserInfoCard from './components/UserInfoCard';
import { Cookie } from '@/components/cookie';
import UserApi from '@/api/UserApi';

export default function CallbackPage() {
    const searchParams = useSearchParams();

    const [username, setUsername] = useState('');
    const [uid, setUid] = useState('11');
    const [loading, setLoading] = useState(true);

    // const state = searchParams.get('state');
    const token = searchParams.get('token');

    UserApi.getToken(token as string)
        .then((credentials) => {
            UserApi.getUserInfo(credentials)
                .then((result) => {
                    Cookie.clearAllCookies();
                    const user = result;

                    Cookie.setCookie('status', 'ok', 7);
                    Cookie.setCookie('uid', user.uid, 7);
                    Cookie.setCookie('username', user.username, 7);
                    Cookie.setCookie('token', credentials, 7);
                    Cookie.setCookie('admin', user.admin ? 'true' : 'false', 7);

                    setUid(user.uid);
                    setUsername(user.username);
                    setLoading(false);
                });
        });

    return (
        <Center>
            <Stack>
                <Space h={100} />
                <Box pos="relative">
                    <UserInfoCard uid={uid} username={username} />
                    <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm', blur: 2 }} />
                </Box>
                <Space h={100} />
            </Stack>
        </Center>
    );
}
