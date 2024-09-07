'use client';

import { Card, Image, Text, Badge, Button, Modal, ActionIcon, Space, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings2 } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SurveyBasicContentsEditor from './SurveyBasicContentsEditor'; // Correct import
import { SurveyInfo } from '@/api/SurveyApi';

export default function BadgeCard({ survey, showBadge, routeAdmin }: BadgeCardProps) {
    const [opened, { open, close }] = useDisclosure();
    const [editingSurvey, setEditingSurvey] = useState<SurveyInfo>(survey);
    const router = useRouter();

    const handleEdit = () => {
        setEditingSurvey(survey);
        open();
    };

    return (
        <>
            <Card withBorder w={292.5}>
                <Card.Section h={150}>
                    <Image
                      src={survey.image}
                      alt={survey.title}
                      h={150}
                      w={292.5}
                    />
                </Card.Section>

                {showBadge && (
                    <ActionIcon
                      onClick={handleEdit}
                      style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                        }}
                      size="lg"
                    >
                        <IconSettings2 />
                    </ActionIcon>
                )}

                <Space h="md" />

                <Group justify="space-between">
                    <Text size="25px" fw={700}>
                        {survey.title}
                    </Text>

                    <Badge variant="light">
                        {survey.budge}
                    </Badge>
                </Group>

                <Space h="md" />

                <iframe width="100%" style={{ border: 'none' }} title="111" srcDoc={survey.description} />

                <Button
                  fullWidth
                  mt="md"
                  radius="md"
                  onClick={() => {
                        router.push(routeAdmin ? `/backstage/editor/${survey.id}` : `/survey/${survey.id}`);
                    }}
                >
                    查看详情
                </Button>
            </Card>

            <Modal opened={opened} onClose={close} title={`编辑 ${survey.title} 基本信息`}>
                <SurveyBasicContentsEditor
                  survey={editingSurvey} // Pass only `survey`
                />
            </Modal>
        </>
    );
}

interface BadgeCardProps {
    survey: SurveyInfo;
    routeAdmin: boolean;
    showBadge?: boolean;
}
