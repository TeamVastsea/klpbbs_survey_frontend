'use client';

import { ActionIcon, Badge, Button, Card, Group, Image, Modal, ScrollArea, Space, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings2 } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SurveyBasicContentsEditor from './SurveyBasicContentsEditor';
import { SurveyInfo } from '@/api/SurveyApi';
import SafeHTML from '@/components/SafeHTML';

export default function BadgeCard({ survey, showBadge, routeAdmin }: BadgeCardProps) {
    const [opened, { open, close }] = useDisclosure();
    const [editingSurvey, setEditingSurvey] = useState<SurveyInfo>(survey);
    const router = useRouter();

    const handleEdit = () => {
        setEditingSurvey(survey);
        open();
    };

    const checkValid = () => {
        const startDate = Date.parse(survey.start_date);
        const endDate = Date.parse(survey.end_date);
        const now = Date.now();

        if (startDate > now || endDate < now) {
            return ValidResult.InValid;
        }
        if (!survey.allow_re_submit) {
            return ValidResult.NoReSubmit;
        }

        return ValidResult.Valid;
    };

    enum ValidResult {
        Valid,
        NoReSubmit,
        InValid,
    }

    const getValidBadge = () => {
        const result = checkValid();
        switch (result) {
            case ValidResult.NoReSubmit:
                return (<Badge variant="light" color="yellow">禁止重复提交</Badge>);
            case ValidResult.InValid:
                return (<Badge variant="light" color="red">过期</Badge>);
            default:
                return null;
        }
    };

    return (
        <>
            <Card withBorder w={292.5}>
                <Card.Section h={150}>
                    <Image src={survey.image} alt={survey.title} h={150} w={292.5} />
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

                    <Group>
                        {survey.budge === '          ' ? <></> : <Badge variant="light">{survey.budge}</Badge>}
                        {getValidBadge()}
                    </Group>
                </Group>

                <Space h="md" />

                {/* <iframe
                  width="100%"
                  style={{ border: 'none' }}
                  title="description"
                  srcDoc={survey.description}
                  sandbox="allow-popups"
                /> */}
                <ScrollArea h={150}>
                    <SafeHTML content={survey.description} />
                </ScrollArea>

                <Button
                  fullWidth
                  mt="md"
                  radius="md"
                  color={checkValid() === ValidResult.InValid ? 'red' : 'blue'}
                  onClick={() => {
                        router.push(routeAdmin ? `/backstage/editor/${survey.id}` : `/survey/${survey.id}`);
                    }}
                >
                    查看详情
                </Button>
            </Card>

            <Modal opened={opened} onClose={close} title={`编辑 ${survey.title} 基本信息`}>
                <SurveyBasicContentsEditor survey={editingSurvey} />
            </Modal>
        </>
    );
}

interface BadgeCardProps {
    survey: SurveyInfo;
    routeAdmin: boolean;
    showBadge?: boolean;
}
