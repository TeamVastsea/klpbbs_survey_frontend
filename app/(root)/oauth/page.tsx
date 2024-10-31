'use client';

import { Center, Space, Stack } from '@mantine/core';
import { LoginBanner } from './components/LoginBanner';
import PasswordBanner from '@/app/(root)/oauth/components/PasswordBanner';

export default function OAuthPage() {
    return (
        <Center>
            <Stack>
                <Space h={100} />
                <LoginBanner />
                <Space h={30} />
                <PasswordBanner />
                <Space h={50} />
            </Stack>
        </Center>
    );
}
