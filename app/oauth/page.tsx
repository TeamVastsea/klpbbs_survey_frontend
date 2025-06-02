import { Center, Space, Stack } from '@mantine/core';
import { LoginBanner } from '@/app/oauth/conponents/LoginBanner';

export default function OAuthPage() {
  return (
    <Center>
      <Stack>
        <Space h={100} />
        <LoginBanner />
        <Space h={100} />
      </Stack>
    </Center>
  );
}
