import { Badge, Button, Card, Group, Image, Text } from '@mantine/core';
import { Survey } from '@/app/page';

export default function SurveyCard(props: SurveyCardProps) {
    const { survey } = props;

    return (
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          w={340}
          key={survey.title}
          style={{
                height: '100%',
                maxWidth: '100%', // Ensure the card doesn't exceed the grid item's width
            }}
        >
            <div style={{ flex: 1 }}> {/* Ensure this div takes available space */}
                <Card.Section>
                    <Image
                      src={survey.image}
                      height={160}
                      alt={survey.title}
                    />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>{survey.title}</Text>
                    <Badge color="pink">{survey.version}</Badge>
                </Group>

                <Text size="sm" c="dimmed">
                    {survey.description}
                </Text>
            </div>

            <Button
              color="blue"
              fullWidth
              mt="md"
              radius="md"
              style={{ marginTop: 'auto' }}
              component="a"
              href={survey.link}
              target="_blank"
              rel="noopener noreferrer"
            >
                现在参加
            </Button>
        </Card>
    );
}

export interface SurveyCardProps {
    survey: Survey
}
