import { Card, Image, Text, Badge, Button } from '@mantine/core';
import { SurveyInfo } from '@/api/SurveyApi';

export default function BadgeCard({ survey }: { survey: SurveyInfo }) {
    return (
        <Card withBorder w={390}>
            <Card.Section h={200}>
                <Image src={survey.image} alt={survey.title} h={200} w={390} />
            </Card.Section>

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
    );
}
