'use client';

import { Card, Image, Text, Badge, Button, Modal, ActionIcon, ScrollArea, Space, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings2 } from '@tabler/icons-react';
import { SurveyInfo } from '@/api/SurveyApi';

export default function BadgeCard({ survey, showBadge }: BadgeCardProps) {
    const [opened, { open, close }] = useDisclosure();

    console.log(survey);
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
                      onClick={open}
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

                <ScrollArea h={150}>
                    {survey.description}
                </ScrollArea>

                <Button
                  fullWidth
                  mt="md"
                  radius="md"
                  onClick={() => {
                        window.location.href = `/backstage/editor/${survey.id}`;
                  }}
                >
                    查看详情
                </Button>
            </Card>

            <Modal opened={opened} onClose={close} title={`编辑 ${survey.title} 基本信息`}>
            </Modal>
        </>
    );
}

interface BadgeCardProps {
    survey: SurveyInfo;
    showBadge: boolean | undefined;
}
