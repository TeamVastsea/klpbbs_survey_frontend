'use client';

import { Avatar, Button, Center, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { IconChecklist, IconEdit, IconFilePlus, IconRefresh } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { Cookie } from '@/components/cookie';
import RefreshCacheApi from '@/api/RefreshCacheApi';
import logo from '@/public/favicon.svg';

export default function Backstage() {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userNameFromCookie = Cookie.getCookie('username') || 'unknown';
            setUserName(decodeURI(userNameFromCookie));
        }
    }, []);

    const handleNavigation = (path: string) => {
        window.location.href = path;
    };

    const handleRefresh = async () => {
        await RefreshCacheApi.refreshCache()
            .then(() => {
                notifications.show({
                    title: '刷新数据库缓存成功',
                    message: '问卷信息成功刷新',
                    color: 'green',
                });
            })
            .catch((error) => {
                notifications.show({
                    title: '刷新数据库缓存失败',
                    message: error.toString(),
                    color: 'red',
                });
            });
    };

    return (
        <>
            <Center>
                <Stack w="80%">
                    <Group>
                        <Avatar
                          src={logo.src}
                          alt="logo"
                          w={100}
                          h={100}
                          radius="sm"
                        />
                        <Stack>
                            <Title>
                                问卷系统
                            </Title>
                            <Title>
                                后台管理界面
                            </Title>
                        </Stack>
                    </Group>
                    <Divider />
                    <Text
                      fw={900}
                      variant="gradient"
                      gradient={{
                            from: 'green',
                            to: 'cyan',
                            deg: 90,
                        }}>
                        尊敬的管理员 {userName}, 欢迎使用苦力怕论坛问卷系统后台管理界面！
                    </Text>
                    <Group>
                        <Divider
                          orientation="vertical"
                          size="lg"
                        />
                        <Stack>
                            <Text>
                                &#x2022; 在此, 您可以轻松创建、编辑和批改问卷
                            </Text>
                            <Text>
                                &#x2022; 为了确保数据安全和问卷隐私, 所有操作将被记录
                            </Text>
                            <Text fw={700}>
                                &#x2022; 请勿未经授权截取或分享后台信息, 如有违规, 将按规定处理
                            </Text>
                        </Stack>
                    </Group>
                    <Center h={400}>
                        <Stack w="60%">
                            <Button
                              size="xl"
                              leftSection={<IconFilePlus />}
                              onClick={() => handleNavigation('/backstage/new')}
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
                              onClick={() => handleNavigation('/backstage/judge')}
                            >
                                批改问卷
                            </Button>
                            <Button
                              size="xl"
                              leftSection={<IconRefresh />}
                              onClick={handleRefresh}
                            >
                                刷新缓存
                            </Button>
                        </Stack>
                    </Center>
                </Stack>
            </Center>
        </>
    );
}
