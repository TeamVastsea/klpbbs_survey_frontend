import { Button, Card, Center, Container, Image, Space, Text } from '@mantine/core';
import { Cookie } from '@/components/cookie';

export default function UserInfoCard(props: UserInfoCardProps) {
    const id_str = props.id.padStart(9, '0');
    const avatar_url = `https://user.klpbbs.com/data/avatar/${id_str.substring(0, 3)}/${id_str.substring(3, 5)}/${id_str.substring(5, 7)}/${id_str.substring(7, 9)}_avatar_big.jpg`;

    function logOut() {
        // remove cookie
        Cookie.clearCookie('token');

        window.location.href = '/oauth';
    }

    return (
        <Container w="100%">
            <Card
              padding="xl"
              component="a"
              withBorder
            >
                <Card.Section>
                    <Image
                      src={avatar_url}
                      h={300}
                    />
                </Card.Section>

                <Center>
                    <Text fw={500} size="lg" mt="md">
                        请确认用户信息
                    </Text>
                </Center>

                <Center>
                    <Text mt="xs" c="dimmed" size="sm">
                        用户名：{props.username}
                    </Text>
                </Center>

                <Center>
                    <Text mt="xs" c="dimmed" size="sm">
                        用户ID：{props.id}
                    </Text>
                </Center>

                <Space h={10} />
                <Button fullWidth>
                    确认是我
                </Button>
                <Center>
                    <Text mt="xs" c="dimmed" size="sm" td="underline" style={{ cursor: 'pointer' }} onClick={logOut}>
                        这不是你? 返回登陆
                    </Text>
                </Center>
            </Card>
        </Container>
    );
}

export interface UserInfoCardProps {
    username: string,
    id: string,
}
