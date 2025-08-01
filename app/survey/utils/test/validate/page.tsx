'use client';

import { Container, Space, Title } from '@mantine/core';
import ValidateTester from '../../ValidateTester';

export default function ValidateTestPage() {
  return (
    <Container size="xl">
      <Title order={1} ta="center" my="xl">
        问卷验证测试页面
      </Title>
      <Space h="xl" />
      <ValidateTester />
    </Container>
  );
}
