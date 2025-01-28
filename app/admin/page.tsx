'use client';

import {
  Button,
  Card,
  Center,
  Divider,
  Group,
  Image,
  Progress,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Title
} from "@mantine/core";
import {useRouter} from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  return (
    <Center>
      <Stack w="60%">
        <Space h={50}/>
        <Center>
          <Title>后台管理</Title>
        </Center>
        <Group>
          <Divider
            orientation="vertical"
            size="lg"
          />
          <Stack>
            <Text>
              &#x2022; 在此, 您可以轻松创建、编辑和批改问卷
            </Text>
            <Text>
              &#x2022; 为了确保数据安全和问卷隐私, 所有操作将被记录
            </Text>
            <Text fw={700}>
              &#x2022; 请勿未经授权截取或分享后台信息, 如有违规, 将按规定处理
            </Text>
          </Stack>
        </Group>

        <Space h={50}/>

        <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }}>
          <Card withBorder>
            <Stack>
              <Text size="lg" fw={500}>问卷管理</Text>

              <Image src="/survey.svg" />

              <Text>共{}个问卷，{}个可用</Text>

              <Button onClick={() => router.push("/admin/survey")}>进入</Button>
            </Stack>
          </Card>
          <Card withBorder>
            <Stack>
              <Text size="lg" fw={500}>结果统计</Text>

              <Image src="/judge.svg"/>

              <Group justify="flex-end" align="center" grow>
                <Progress value={50} />
                <Text>{}/{}个提交</Text>
              </Group>

              <Button onClick={() => router.push("/admin/score")}>进入</Button>
            </Stack>
          </Card>
          <Card withBorder>
            <Stack>
              <Text size="lg" fw={500}>用户管理</Text>

              <Image src="/user.svg"/>

              <Text>{}个用户</Text>

              <Button onClick={() => router.push("/admin/user")}>进入</Button>
            </Stack>
          </Card>
        </SimpleGrid>
      </Stack>
    </Center>
  );
}
