import { Card, Image, Text, Badge, Button, Modal, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings2 } from '@tabler/icons-react';
import { SurveyInfo } from '@/api/SurveyApi';

export default function BadgeCard({ survey, showBadge }: BadgeCardProps) {
    const [opened, { open, close }] = useDisclosure();

    return (
        <>
            <Card withBorder w={390}>
                <Card.Section h={200}>
                    <Image src={survey.image} alt={survey.title} h={200} w={390} />
                </Card.Section>

                {showBadge && (
                    <ActionIcon onClick={open} style={{ position: 'absolute', top: 10, right: 10 }} size="lg">
                        <IconSettings2 />
                    </ActionIcon>
                )}

                <Text size="lg" mt="md">
                    {survey.title}
                </Text>

                <Badge variant="light">
                    {survey.budge}
                </Badge>

                <Text size="sm" mt="md">
                    {survey.description}
                </Text>

                <Button fullWidth mt="md" radius="md">
                    查看详情
                </Button>
            </Card>

            <Modal opened={opened} onClose={close} title={`编辑 ${survey.title}`}>

            </Modal>
        </>
    );
}
interface BadgeCardProps {
    survey: SurveyInfo;
    showBadge: boolean | undefined;
}
