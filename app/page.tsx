'use client';

import {
    Badge,
    Button,
    Card,
    Center,
    Container,
    Group,
    Image,
    SimpleGrid,
    Space,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import classes from '@/app/oauth/components/LoginBanner.module.css';

type Survey = {
    title: string;
    version: string;
    description: string;
    image: string;
    link: string;
};

export default function HomePage() {
    const router = useRouter();

    const surveyCard = (survey: Survey) => (
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          key={survey.title}
          style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                maxWidth: '100%', // Ensure the card doesn't exceed the grid item's width
                width: '340px',
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

    const surveys: Survey[] = [
        {
            title: '内群卷卷',
            version: '2.0船新版本',
            description: '你好，欢迎参加内群入群问卷，我们希望了解你的需求，以便更好地为你服务。',
            image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png',
            link: 'oauth',
        },
        {
            title: '我爱雪球',
            version: '可爱喵',
            description: '最喜欢 nya 了',
            image: 'https://avatars.githubusercontent.com/u/97330394?v=4',
            link: 'https://github.com/SnowballXueQiu',
        },
        {
            title: 'Test',
            version: 'Test',
            description: 'Test',
            image: 'https://placehold.co/400x400',
            link: 'https://github.com/SnowballXueQiu',
        },
    ];

    return (
        <div style={{
            scrollSnapType: 'y mandatory',
            overflowY: 'scroll',
            height: '100vh',
        }}>
            <Center style={{
                minHeight: '100vh',
                scrollSnapAlign: 'start',
            }}>
                <SimpleGrid
                  cols={{
                    base: 1,
                    sm: 2,
                }}
                  spacing="lg"
                  style={{
                    maxWidth: '80%',
                    width: '100%',
                }}>
                    <Stack justify="center">
                        <Title className={classes.title}>
                            <Text span c="#008D57" inherit>苦</Text>
                            <Text span c="#13AE67" inherit>力</Text>
                            <Text span c="#089946" inherit>怕</Text>
                            论坛
                        </Title>
                        <Title>
                            &#62; 问卷系统
                        </Title>
                        <Text fw={500} fz="lg">
                            收集更好的数据，作出更好的决策。
                        </Text>
                        <Space h="md" />
                        <Group>
                            <Button
                              color="blue"
                              radius="md"
                              onClick={() => {
                                    router.push('https://github.com/orgs/TeamVastsea/teams/klpbbs_survey');
                                }}
                            >
                                Github链接
                            </Button>
                            <Button
                              color="gray"
                              radius="md"
                              onClick={() => {
                                    router.push('#');
                                }}
                            >
                                进入工作台
                            </Button>
                        </Group>
                    </Stack>

                    <Container>
                        <Image
                          src="https://data.klpbbs.com/file/tc/img/2024/08/12/66b96cbee4ef7.png"
                          alt="KLPBBS logo"
                          className={classes.image}
                          style={{
                                maxWidth: 380,
                                margin: '0 auto',
                            }}
                        />
                    </Container>
                </SimpleGrid>
            </Center>

            <Center style={{
                minHeight: '100vh',
                scrollSnapAlign: 'start',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Title>现有问卷</Title>
                <SimpleGrid
                  cols={{
                        base: 1,
                        sm: 2,
                    }}
                  spacing="lg"
                  style={{
                        maxWidth: '80%',
                        width: '100%',
                        marginTop: '1rem',
                    }}
                >
                    {surveys.map((survey) => (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                        }}>
                            {surveyCard(survey)}
                        </div>
                    ))}
                </SimpleGrid>
            </Center>
        </div>
    );
}
