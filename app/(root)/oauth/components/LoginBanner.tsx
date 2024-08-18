import { Text, Title, Button, Image, Space, Container, SimpleGrid } from '@mantine/core';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import image from './logo.png';
import classes from './LoginBanner.module.css';
import { Cookie } from '@/components/cookie';

export function LoginBanner() {
    const [loading, setLoading] = useState(false);

    function getLogin() {
        setLoading(true);
        const requestOptions = {
            method: 'POST',
        };

        fetch('https://wj.klpbbs.cn/api/user', requestOptions)
            .then(response => response.text())
            .then(result => {
                //set cookie
                Cookie.setCookie('token', result, 7);

                window.location.href = `https://klpbbs.com/plugin.php?id=klpbbs_api:oauth2&appid=4474a21e0077bcd413dd975e5c9aacc339e1fd54&state=${result}`;
            })
            .catch((e) => {
                setLoading(false);
                notifications.show({
                    title: '登陆失败，请将以下信息反馈给管理员',
                    message: e.toString(),
                    color: 'red',
                });
            });
    }

    return (
        <Container w="100%">
            <div className={classes.wrapper}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <Container w={256}>
                        <Image src={image.src} className={classes.image} w="100%" />
                    </Container>
                    <div className={classes.body}>
                        <Title className={classes.title}>
                            苦力怕论坛
                        </Title>
                        <Text fw={500} fz="lg" mb={5}>
                            请授权我们登陆您的苦力怕论坛账号
                        </Text>
                        <Text fz="sm" c="dimmed">
                            您的账号仅用于确认您的身份，我们不会将您的账号用于任何其他目的或与任何第三方共享。详细请参见我们的
                            <Text c="blue" td="underline" style={{ cursor: 'pointer' }} component="span" inherit>
                                隐私政策
                            </Text>
                        </Text>
                        <Space h={30} />
                        <Button w="100%" onClick={getLogin} loading={loading}>登陆</Button>
                    </div>
                </SimpleGrid>
            </div>
        </Container>
    );
}
