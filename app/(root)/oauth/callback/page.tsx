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

    const state = searchParams.get('state');
    const token = searchParams.get('token');

    UserApi.activateToken(state as string, token as string)
        .then(() => {
            UserApi.getUserInfo(state as string)
                .then((result) => {
                    Cookie.clearAllCookies();
                    const user = result;

                    Cookie.setCookie('status', 'ok', 7);
                    Cookie.setCookie('uid', user.uid, 7);
                    Cookie.setCookie('username', user.username, 7);
                    Cookie.setCookie('token', state as string, 7);

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
                    { !loading && <UserInfoCard uid={uid} username={username} /> }
                    <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm', blur: 2 }} />
                </Box>
                <Space h={100} />
            </Stack>
        </Center>
    );
}
