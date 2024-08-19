'use client';

import React from 'react';
import { Container, Title, Space, Center, Stack, Text } from '@mantine/core';
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
                    <Text size="lg" fw={700}>Privacy Policy (PP)</Text>
                </Title>
                <Title order={3} onClick={() => router.push('/tos/EULA')} style={{ cursor: 'pointer' }}>
                    最终用户许可协议
                    <Text size="lg" fw={700}>End User License Agreement (EULA)</Text>
                </Title>
                <Title order={3} onClick={() => window.open('https://klpbbs.com/thread-65605-1-1.html', '_blank')} style={{ cursor: 'pointer' }}>
                    苦力怕论坛总坛规
                    <Text size="lg" fw={700}>KLPBBS General Rules</Text>
                </Title>
                <Title order={3} onClick={() => router.push('/tos/OpenSourceLicense')} style={{ cursor: 'pointer' }}>
                    开源许可证
                    <Text size="lg" fw={700}>Open Source License (OSL)</Text>
                </Title>
            </Stack>
        </Container>
    );
}
