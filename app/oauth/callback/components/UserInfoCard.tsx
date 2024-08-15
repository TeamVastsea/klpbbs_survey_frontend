import { Button, Card, Center, Container, Space, Text, Avatar } from '@mantine/core';
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
                    <br />
                    <Center
                      w={300}
                      h="auto"
                    >
                        <Avatar
                          src={avatar_url}
                          size="8rem"
                        />
                    </Center>
                </Card.Section>

                <Center>
                    <Text fw={500} size="lg" mt="md">
                        请确认用户信息
                    </Text>
                </Center>

                <Center>
                    <Text mt="xs" c="dimmed" size="sm">
                        UID：{props.id}
                    </Text>
                </Center>

                <Center>
                    <Text mt="xs" c="dimmed" size="sm">
                        用户名：{props.username}
                    </Text>
                </Center>

                <Space h={10} />
                <Button fullWidth>
                    确认是我
                </Button>
                <Center>
                    <Text mt="xs" c="dimmed" size="sm" style={{ cursor: 'pointer' }} onClick={logOut}>
                        这不是你? 重新登陆。
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
