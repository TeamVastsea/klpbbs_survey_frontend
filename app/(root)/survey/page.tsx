'use client';

import { Center, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SurveyPage() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push('/list');
        }, 1000);
    }, []);

    return (
        <Center>
            <Text>
                正在重定向至 /list ...
            </Text>
        </Center>
    );
}
