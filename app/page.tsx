'use client';

import { Badge, Button, Card, Center, Group, Image, Space, Stack, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    return (
        <Center>
            <Stack>
                <Space h={100} />
                <Card shadow="sm" padding="lg" radius="md" withBorder w={300}>
                    <Card.Section>
                        <Image
                          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                          height={160}
                          alt="Norway"
                        />
                    </Card.Section>

                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={500}>内群卷卷</Text>
                        <Badge color="pink">2.0船新版本</Badge>
                    </Group>

                    <Text size="sm" c="dimmed">
                        你好，欢迎参加内群入群问卷，我们希望了解你的需求，以便更好地为你服务。
                    </Text>

                    <Button
                      color="blue"
                      fullWidth
                      mt="md"
                      radius="md"
                      onClick={() => { router.push('oauth'); }}>
                        现在参加
                    </Button>
                </Card>
            </Stack>
        </Center>
    );
}
