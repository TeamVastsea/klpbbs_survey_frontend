'use client';

import { useRouter } from 'next/navigation';
import {
  Avatar,
  Button,
  Card,
  Center,
  Container,
  LoadingOverlay,
  Space,
  Text,
} from '@mantine/core';

export default function UserInfoCard(props: UserInfoCardProps) {
  const router = useRouter();
  const id_str = props.uid.padStart(9, '0');
  const avatar_url = `https://user.klpbbs.com/data/avatar/${id_str.substring(0, 3)}/${id_str.substring(3, 5)}/${id_str.substring(5, 7)}/${id_str.substring(7, 9)}_avatar_big.jpg`;
  const redirect = localStorage?.getItem('redirect') || '/survey';

  return (
    <Container w="100%">
      <Card padding="xl" component="a" withBorder>
        <LoadingOverlay visible={!props.loggedIn} overlayProps={{ radius: 'sm', blur: 2 }} />
        <Card.Section>
          <br />
          <Center w={300} h="auto">
            <Avatar src={avatar_url} size="8rem" />
          </Center>
        </Card.Section>

        <Center>
          <Text fw={500} size="lg" mt="md">
            欢迎回来
          </Text>
        </Center>

        <Center>
          <Text mt="xs" c="dimmed" size="sm">
            UID：{props.uid}
          </Text>
        </Center>

        <Center>
          <Text mt="xs" c="dimmed" size="sm">
            用户名：{props.username}
          </Text>
        </Center>

        <Space h={10} />
        <Button fullWidth onClick={() => router.push(redirect)}>
          让我们开始吧
        </Button>
        {/*<Center>*/}
        {/*    <Text mt="xs" c="dimmed" size="sm" style={{ cursor: 'pointer' }} onClick={logOut}>*/}
        {/*        这不是你? 重新登录*/}
        {/*    </Text>*/}
        {/*</Center>*/}
      </Card>
    </Container>
  );
}

export interface UserInfoCardProps {
  uid: string;
  username: string;
  loggedIn: boolean;
}
