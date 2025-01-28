'use client';

import {Box, Center, Space, Stack} from '@mantine/core';
import {useSearchParams} from 'next/navigation';
import UserInfoCard from './components/UserInfoCard';
import {useUser} from "@/data/use-user";
import {useEffect} from "react";
import {notifications} from "@mantine/notifications";
import UserNetwork from "@/network/user";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const user = useUser();
  const token = searchParams.get('token');

  useEffect(() => {
    UserNetwork.login(token as string)
      .then(() => {
        user.mutate()
          .then((data) => {
            if (data) {
              notifications.show({
                title: '登录成功',
                message: `欢迎回来，${data.username}`,
                color: 'teal',
              });
            } else {
              notifications.show({
                title: '登录失败',
                message: '请重试',
                color: 'red',
              })
            }
          });
      })
  }, [token]);

  return (
    <Center>
      <Stack>
        <Space h={100}/>
        <Box pos="relative">
          <UserInfoCard uid={user.user?.uid || ''} username={user.user?.username || ''} loggedIn={user.isLoggedIn}/>
        </Box>
        <Space h={100}/>
      </Stack>
    </Center>
  );
}
