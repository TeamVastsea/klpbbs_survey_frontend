'use client';

import { useState } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import {
  Button,
  Center,
  Container,
  Divider,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import PeopleCard, { Person } from './components/PeopleCard';
import developerList from './data/developers.json';
import examinerList from './data/examiners.json';
import organizationList from './data/organizations.json';

export default function AboutPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const showPerson = (person: Person) => {
    setSelectedPerson(person);
    open();
  };

  const renderSection = (title: string, people: Person[]) => (
    <Paper shadow="sm" radius="lg" p="xl" withBorder miw={350}>
      <Stack>
        <Title order={2} ta="center">
          {title}
        </Title>
        {people.map((person, index) => (
          <Stack key={person.name} gap="md">
            <Group>
              <Text style={{ flexGrow: 1 }}>{person.name}</Text>
              <Button variant="subtle" onClick={() => showPerson(person)}>
                <IconInfoCircle size={20} />
                &nbsp;查看详情
              </Button>
            </Group>
            {index < people.length - 1 && <Divider />}
          </Stack>
        ))}
      </Stack>
    </Paper>
  );

  return (
    <Container size="md" py="xl">
      <Stack>
        <Title ta="center">关于我们</Title>
        <Text ta="center" fw={700}>
          （排名不分先后）
        </Text>
        <Divider size="xl" />
        <Center>{renderSection('🔧 开发', developerList)}</Center>
        <Center>{renderSection('✍️ 题目编写', examinerList)}</Center>
        <Center>{renderSection('🏢 组织', organizationList)}</Center>
        <Text ta="center">同时感谢所有为本项目及问卷作出贡献的人</Text>
      </Stack>

      <Modal opened={opened} onClose={close} title="详细信息">
        {selectedPerson && <PeopleCard {...selectedPerson} />}
      </Modal>
    </Container>
  );
}
