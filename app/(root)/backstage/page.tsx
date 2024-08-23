'use client';

import { Center, Divider, Stack, Title, Button, Text } from '@mantine/core';
import { IconFilePlus, IconEdit, IconChecklist } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Cookie } from '@/components/cookie';

export default function Backstage() {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userNameFromCookie = Cookie.getCookie('username') || 'unknown';
            setUserName(decodeURI(userNameFromCookie));
        }
    }, []);

    // 跳转到指定路径
    const handleNavigation = (path: string) => {
        window.location.href = path;
    };

    return (
        <>
            <Center>
                <Stack w="80%">
                    <Title>
                        问卷系统
                    </Title>
                    <Title>
                        后台管理界面
                    </Title>
                    <Divider />
                    <Text>
                        尊敬的管理员 {userName}, 您好!
                    </Text>
                    <Center h={400}>
                        <Stack w="60%">
                            <Button
                              size="xl"
                              leftSection={<IconFilePlus />}
                              onClick={() => handleNavigation('/editor/new')}
                            >
                                新建问卷
                            </Button>
                            <Button
                              size="xl"
                              leftSection={<IconEdit />}
                              onClick={() => handleNavigation('/backstage/editor')}
                            >
                                编辑问卷
                            </Button>
                            <Button
                              size="xl"
                              leftSection={<IconChecklist />}
                              onClick={() => handleNavigation('/editor/judge')}
                            >
                                批改问卷
                            </Button>
                        </Stack>
                    </Center>
                </Stack>
            </Center>
        </>
    );
}
