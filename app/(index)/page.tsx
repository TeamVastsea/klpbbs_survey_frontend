'use client';

import {
    Avatar,
    Button,
    Center,
    Container,
    Group,
    Image,
    SimpleGrid,
    Space,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import classes from '@/styles/common.module.css';
import mainPageImage from '@/public/main-page.svg';
import github from '@/public/github.svg';
import { Cookie } from '@/components/cookie';

export type Survey = {
    title: string;
    version: string;
    description: string;
    image: string;
    link: string;
};

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        const adminAccessDenied = sessionStorage.getItem('adminAccessDenied');
        if (adminAccessDenied === 'true') {
            notifications.show({
                title: '您不是管理员',
                message: '您的操作已被记录, 若您为管理员, 请登录您的管理员账号',
                color: 'red',
            });
            sessionStorage.setItem('adminAccessDenied', 'false');
        }
    }, []);

    const handleButtonClick = () => {
        const status = Cookie.getCookie('status');
        if (status === 'ok') {
            router.push('/list');
        } else {
            router.push('/oauth');
        }
    };

    return (
        <>
            <Center
              style={{
                    height: 'calc(100vh - 60px - 56px)',
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                }}
            >
                <SimpleGrid
                  cols={{ base: 1, sm: 2 }}
                  spacing="lg"
                  style={{ maxWidth: '80%', width: '100%' }}
                >
                    <Center>
                        <Stack justify="center">
                            <Title className={classes.title}>
                                <Text span c="#008D57" inherit>
                                    苦
                                </Text>
                                <Text span c="#13AE67" inherit>
                                    力
                                </Text>
                                <Text span c="#089946" inherit>
                                    怕
                                </Text>
                                论坛
                            </Title>
                            <Title>&#62; 问卷系统</Title>
                            <Text fw={500} fz="lg">
                                收集更好的数据，作出更好的决策。
                            </Text>
                            <Space h="md" />

                            <Group>
                                <Button
                                  color="blue"
                                  component="a"
                                  href="https://github.com/TeamVastsea"
                                  target="_blank"
                                >
                                    <Group gap="xs">
                                        <Avatar
                                          src={github.src}
                                          alt="GitHub"
                                          size="1.1rem"
                                        />
                                        GitHub
                                    </Group>
                                </Button>
                                <Button color="gray" onClick={handleButtonClick}>
                                    立即使用
                                </Button>
                            </Group>
                        </Stack>
                    </Center>
                    <Container className={classes.imageContainer}>
                        <Image
                          src={mainPageImage.src}
                          alt="Main Page Image"
                          className={classes.image}
                          style={{ maxWidth: 380, margin: '0 auto' }}
                        />
                    </Container>
                </SimpleGrid>
            </Center>
        </>
    );
}
