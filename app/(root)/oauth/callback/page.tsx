'use client';

import { Center, Stack, Space } from '@mantine/core';
import UserInfoCard from './components/UserInfoCard';
import { Cookie } from '@/components/cookie';

export default function CallbackPage() {
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
