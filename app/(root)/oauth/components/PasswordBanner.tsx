'use client';

import {
    Button,
    Card, Center,
    Container,
    Input,
    Space, Stack,
    Tabs,
    Text,
} from '@mantine/core';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconAddressBook,
  IconLogin,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import UserApi from '@/api/UserApi';
import { Cookie } from '@/components/cookie';

export default function LoginBanner() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const login = () => {
        setLoading(true);
        UserApi.login(username, password)
            .then((res) => {
                Cookie.setCookie('token', res, 7);
                UserApi.getUserInfo(res)
                    .then((result) => {
                        Cookie.setCookie('status', 'ok', 7);
                        Cookie.setCookie('uid', result.uid, 7);
                        Cookie.setCookie('username', result.username, 7);
                        Cookie.setCookie('admin', result.admin ? 'true' : 'false', 7);
                        Cookie.setCookie('source', result.source, 7);
                        router.push('/list');
                    });
            })
            .catch(() => { setLoading(false); });
    };

    const register = () => {
        setLoading(true);
        UserApi.register(username, password)
            .then(() => {
                notifications.show({
                    title: '注册成功',
                    message: '请登录',
                    color: 'green',
                });
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    return (
        <Container maw="100%" w={400}>
            <Card radius="md" withBorder w="100%">
                <Card.Section inheritPadding py="xs">
                    <Center>
                        <Text size="xl" fw={500}>帐号密码登录</Text>
                    </Center>

                </Card.Section>
                <Tabs variant="pills" defaultValue="login" w="100%">
                    <Tabs.List justify="center">
                        <Tabs.Tab value="login" leftSection={<IconLogin size={18} />}>
                            登录
                        </Tabs.Tab>
                        <Tabs.Tab value="register" leftSection={<IconAddressBook size={18} />}>
                            注册
                        </Tabs.Tab>
                    </Tabs.List>

                    <Space h={20} />

                    <Tabs.Panel value="login">
                        <Stack>
                            <Input.Wrapper label="用户名">
                                <Input
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)} />
                            </Input.Wrapper>
                            <Input.Wrapper label="密码">
                                <Input
                                  type="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)} />
                            </Input.Wrapper>

                            <Text fz="sm" c="dimmed">
                                注册或登录即代表您同意我们的
                                <Text
                                  c="blue"
                                  td="underline"
                                  onClick={() => router.push('/tos')}
                                  style={{ cursor: 'pointer' }}
                                  component="span"
                                  inherit
                                >
                                    服务条款
                                </Text>
                            </Text>

                            <Button loading={loading} onClick={login}>登录</Button>
                        </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="register">
                        <Stack>
                            <Input.Wrapper label="用户名">
                                <Input
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)} />
                            </Input.Wrapper>
                            <Input.Wrapper label="密码">
                                <Input
                                    type="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)} />
                            </Input.Wrapper>

                            <Text fz="sm" c="dimmed">
                                注册或登录即代表您同意我们的
                                <Text
                                  c="blue"
                                  td="underline"
                                  onClick={() => router.push('/tos')}
                                  style={{ cursor: 'pointer' }}
                                  component="span"
                                  inherit
                                >
                                    服务条款
                                </Text>
                            </Text>

                            <Button loading={loading} onClick={register}>注册</Button>
                        </Stack>
                    </Tabs.Panel>
                </Tabs>
            </Card>
        </Container>
    );
}
