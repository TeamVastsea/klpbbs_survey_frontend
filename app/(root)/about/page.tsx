'use client';

import { useState } from 'react';
import { Button, Center, Divider, Group, Modal, Stack, Text, Title } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import developerList from './data/data.json';
import DeveloperCard from './components/DeveloperCard';

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

    return (
        <Center style={{ paddingTop: '2rem' }}>
            <Stack>
                <Center>
                    <Stack gap="md" style={{ width: '100%' }}>
                        <Center>
                            <Title>关于我们</Title>
                        </Center>
                        <Stack>
                            <Center>
                                <Text>这里是我们全部的开发人员</Text>
                            </Center>
                            <Center>
                                <Text fw={700}>(排名不分先后)</Text>
                            </Center>
                        </Stack>
                        {developerList.map((developer, index) => (
                            <Stack key={index}>
                                <Group grow style={{ width: '100%' }}>
                                    <Text ta="left">{developer.name}</Text>
                                    <Button variant="subtle" onClick={() => handleDeveloperClick(developer)}>
                                        <IconInfoCircle size={20} />
                                    </Button>
                                </Group>
                                {index < developerList.length - 1 && <Divider />}
                            </Stack>
                        ))}
                    </Stack>
                </Center>

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
            </Stack>
        </Center>
    );
}
