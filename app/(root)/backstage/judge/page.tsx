'use client';

import { Button, Center, Input, Stack, Title } from '@mantine/core';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SurveyPage() {
    const [answerId, setAnswerId] = useState<number | undefined>(undefined);
    const router = useRouter();

    return (
        <Center>
            <Stack w="90%">
                <Center>
                    <Title>
                        阅卷系统
                    </Title>
                </Center>
                <Center h="100%">
                    <Stack>
                        <Input.Wrapper label="请输入 Answer ID 以跳转">
                            <Input
                              onChange={(e) => setAnswerId(parseInt(e.currentTarget.value, 10))}
                            />
                        </Input.Wrapper>
                        <Center>
                            <Button
                              onClick={() => {
                                    router.push(`/backstage/judge/${answerId}`);
                                }}
                            >
                                确认跳转至 {answerId}
                            </Button>
                        </Center>
                    </Stack>
                </Center>
            </Stack>
        </Center>

    );
}
