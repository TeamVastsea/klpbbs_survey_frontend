'use client';

import { Container, Title, Space } from '@mantine/core';
import VisibilityTester from '../../VisibilityTester';

export default function VisibilityTestPage() {
  return (
    <Container size="xl">
      <Title order={1} ta="center" my="xl">问卷条件显示测试页面</Title>
      <Space h="xl" />
      <VisibilityTester />
    </Container>
  );
}
