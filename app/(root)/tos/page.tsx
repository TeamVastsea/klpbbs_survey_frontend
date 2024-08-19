'use client';

import React from 'react';
import { Container, Title, Space, Center, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function TosPage() {
    const router = useRouter();

    return (
        <Container w="90%">
            <Space h="md" />
            <Stack>
                <Stack>
                    <Center>
                        <Title>
                            服务条款
                        </Title>
                    </Center>
                    <Center>
                        <Title order={4}>
                            Terms of Service (TOS)
                        </Title>
                    </Center>
                </Stack>
                <Space h="xs" />
                <Title order={3} onClick={() => router.push('/tos/PrivacyPolicy')} style={{ cursor: 'pointer' }}>
                    隐私政策
                    <Title order={4}>Privacy Policy (PP)</Title>
                </Title>
                <Title order={3} onClick={() => router.push('/tos/EULA')} style={{ cursor: 'pointer' }}>
                    最终用户许可协议
                    <Title order={4}>End User License Agreement (EULA)</Title>
                </Title>
                <Title order={3} onClick={() => router.push('/tos/EULA')} style={{ cursor: 'pointer' }}>
                    苦力怕论坛总坛规
                    <Title order={4}>KLPBBS General Rules</Title>
                </Title>
                <Title order={3} onClick={() => router.push('/tos/OpenSourceLicense')} style={{ cursor: 'pointer' }}>
                    开源许可证
                    <Title order={4}>Open Source License</Title>
                </Title>
            </Stack>
        </Container>
    );
}
