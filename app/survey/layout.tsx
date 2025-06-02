'use client';

import { Center, Space, Stack, Title } from '@mantine/core';
import OAuthPage from '@/app/oauth/page';
import { useUser } from '@/data/use-user';

export default function SurveyLayout({ children }: { children: any }) {
  const user = useUser();

  return (
    <>
      {user.isLoggedIn ? (
        children
      ) : (
        <Stack>
          <Space h={50} />
          <Center>
            <Title>请先登录</Title>
          </Center>
          <OAuthPage />
        </Stack>
      )}
    </>
  );
}
