import { Text, Title, Button, Image, Space, Container, SimpleGrid } from '@mantine/core';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import image from './logo.png';
import classes from './LoginBanner.module.css';
import { Cookie } from '@/components/cookie';
import UserApi from '@/api/UserApi';

export function LoginBanner() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    function getLogin() {
        setLoading(true);

        UserApi.getToken()
            .then(result => {
                Cookie.setCookie('token', result, 7);
                window.location.href = `https://klpbbs.com/plugin.php?id=klpbbs_api:oauth2&appid=4474a21e0077bcd413dd975e5c9aacc339e1fd54&state=${result}`;
            });
    }

    return (
        <Container w="100%">
            <div className={classes.wrapper}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <Container w={256} className={classes.loginBannerImage}>
                        <Image src={image.src} w="100%" />
                    </Container>
                    <div className={classes.body}>
                        <Title className={classes.title}>
                            苦力怕论坛
                        </Title>
                        <Text fw={500} fz="lg" mb={5}>
                            请授权我们获取您的苦力怕论坛信息
                        </Text>
                        <Text fz="sm" c="dimmed">
                            您的信息仅用于确认您的身份，我们不会将您的信息用于任何其他目的或与任何第三方共享。详细请参见我们的
                            <Text c="blue" td="underline" onClick={() => router.push('/tos')} style={{ cursor: 'pointer' }} component="span" inherit>
                                服务条款
                            </Text>
                        </Text>
                        <Space h={30} />
                        <Button w="100%" onClick={getLogin} loading={loading}>登录</Button>
                    </div>
                </SimpleGrid>
            </div>
        </Container>
    );
}
