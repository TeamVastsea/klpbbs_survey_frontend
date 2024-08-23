'use client';

import { useState } from 'react';
import { Button, Center, Divider, Group, Modal, Stack, Text, Title, Container, Paper } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import developerList from './data/developers.json';
import examinerList from './data/examiners.json';
import organizationList from './data/organizations.json';
import DeveloperCard from './components/PeopleCard';

interface DeveloperListProps {
    name: string;
    badges: string[];
    links: {
        name: string;
        url: string;
    }[];
    logo: string;
}

export default function AboutPage() {
    const [selectedDeveloper, setSelectedDeveloper] = useState<DeveloperListProps | null>(null);
    const [opened, { open, close }] = useDisclosure(false);

    const handleDeveloperClick = (developer: DeveloperListProps) => {
        setSelectedDeveloper(developer);
        open();
    };

    const renderSection = (title: string, list: DeveloperListProps[]) => (
        <Center>
            <Paper shadow="sm" radius="lg" p="xl" withBorder style={{ minWidth: 350 }}>
                <Stack>
                    <Center>
                        <Title order={2}>{title}</Title>
                    </Center>
                    <Stack gap="md">
                        {list.map((developer, index) => (
                            <Stack key={index}>
                                <Group style={{ width: '100%' }}>
                                    <Text ta="left" style={{ flexGrow: 1 }}>{developer.name}</Text>
                                    <Button variant="subtle" onClick={() => handleDeveloperClick(developer)}>
                                        <IconInfoCircle size={20} />
                                        &nbsp;查看详情
                                    </Button>
                                </Group>
                                {index < list.length - 1 && <Divider />}
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </Paper>
        </Center>
    );

    return (
        <Center style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
            <Container size="md" style={{ paddingBottom: '1rem' }}>
                <Center>
                    <Title>关于我们</Title>
                </Center>
                <Center>
                    <Text fw={700}>(排名不分先后)</Text>
                </Center>

                <Divider my="lg" size="xl" />

                <Stack>
                    {renderSection('🔧 开发', developerList)}
                    {renderSection('✍️ 题目编写', examinerList)}
                    {renderSection('🏢 组织', organizationList)}

                    {selectedDeveloper && (
                        <Modal opened={opened} onClose={close} title="详细信息">
                            <DeveloperCard
                              name={selectedDeveloper.name}
                              badges={selectedDeveloper.badges}
                              links={selectedDeveloper.links}
                              logo={selectedDeveloper.logo}
                            />
                        </Modal>
                    )}

                    <Center>
                        <Text>同时感谢所有为本项目及问卷作出贡献的人</Text>
                    </Center>
                </Stack>
            </Container>
        </Center>
    );
}
