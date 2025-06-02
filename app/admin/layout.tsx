'use client';

import { useRouter } from 'next/navigation';
import { Button, Center, Space, Stack, Title } from '@mantine/core';
import Watermark from '@/app/admin/components/Watermark';
import { useUser } from '@/data/use-user';

export default function SurveyLayout({ children }: { children: any }) {
  const user = useUser();
  const router = useRouter();

  return (
    <>
      {user.isLoggedIn && user.user?.admin ? (
        <Watermark text={`${user.user.username} ${user.user.uid}`} fontSize={40} gap={200}>
          {children}
        </Watermark>
      ) : (
        <Stack align="center">
          <Space h={50} />
          <Center>
            <Title>本页面仅限管理员访问</Title>
          </Center>
          <Button onClick={() => router.push('/')}>返回首页</Button>
        </Stack>
      )}
    </>
  );
}
