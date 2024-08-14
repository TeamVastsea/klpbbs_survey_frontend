'use client';

import { Card, Center, Space, Stack } from '@mantine/core';
import { LoginBanner } from '@/app/oauth/components/LoginBanner';

export default function OAuthPage() {
    return (
        <Center>
            <Stack>
                <Space h={100} />
                <LoginBanner />
                <Space h={100} />
            </Stack>
        </Center>
    );
}
