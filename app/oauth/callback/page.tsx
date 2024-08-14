'use client';

import {Card, Center, Stack, Text, Image, Space} from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import UserInfoCard from '@/app/oauth/callback/components/UserInfoCard';

export default function CallbackPage() {
    const searchParams = useSearchParams();

    const state = searchParams.get('state');
    const token = searchParams.get('token');

    return (
        <Center>
            <Stack>
                <Space h={100} />
                <UserInfoCard username="111" id="922084" />
                <Space h={100} />
            </Stack>
        </Center>
    );
}
