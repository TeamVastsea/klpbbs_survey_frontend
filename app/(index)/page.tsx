'use client';

import { Button, Center, Container, Group, Image, SimpleGrid, Space, Stack, Text, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { min } from '@floating-ui/utils';
import classes from '@/styles/common.module.css';
import SurveyCard from '@/components/SurveyCard';
import Footer from '@/components/Footer';

export type Survey = {
    title: string;
    version: string;
    description: string;
    image: string;
    link: string;
};

export default function HomePage() {
    const router = useRouter();

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
        <>
            <div
              style={{
                  scrollSnapType: 'y mandatory',
                  overflowY: 'scroll',
                  height: '100vh',
                }}
            >
                <Center
                  style={{
                        minHeight: '100vh',
                        scrollSnapAlign: 'start',
                        scrollSnapStop: 'always',
                    }}
                >
                    <SimpleGrid
                      cols={{ base: 1, sm: 2 }}
                      spacing="lg"
                      style={{ maxWidth: '80%', width: '100%' }}
                    >
                        <Stack justify="center">
                            <Title className={classes.title}>
                                <Text span c="#008D57" inherit>苦</Text>
                                <Text span c="#13AE67" inherit>力</Text>
                                <Text span c="#089946" inherit>怕</Text>
                                论坛
                            </Title>
                            <Title>&#62; 问卷系统</Title>
                            <Text fw={500} fz="lg">收集更好的数据，作出更好的决策。</Text>
                            <Space h="md" />
                            <Group>
                                <Button
                                  color="blue"
                                  radius="md"
                                  onClick={() => router.push('https://github.com/orgs/TeamVastsea/teams/klpbbs_survey')}
                                >
                                    Github
                                </Button>
                                <Button
                                  color="gray"
                                  radius="md"
                                  onClick={() => router.push('/oauth')}
                                >
                                    立即使用
                                </Button>
                            </Group>
                        </Stack>

                        <Container>
                            <Image
                              src="favicon.svg"
                              alt="KLPBBS logo"
                              className={classes.image}
                              style={{ maxWidth: 380, margin: '0 auto' }}
                            />
                        </Container>
                    </SimpleGrid>
                </Center>

                <Center
                  style={{
                        minHeight: '100vh',
                        scrollSnapAlign: 'start',
                        scrollSnapStop: 'always',
                    }}
                  pb={120}
                >
                    <Stack>
                        <Center>
                            <Title>现有问卷</Title>
                        </Center>
                        <Center>
                            <SimpleGrid
                              w="100%"
                              cols={{
                                  base: 1,
                                  md: min(surveys.length, 2),
                                  lg: min(surveys.length, 4),
                            }}
                              spacing={{ base: 'lg', lg: 'xl' }}
                            >
                                {surveys.map((survey, index) => (
                                    <Center key={index}>
                                        <SurveyCard survey={survey} />
                                    </Center>
                                ))}
                            </SimpleGrid>
                        </Center>
                    </Stack>
                </Center>
            </div>
        </>
    );
}
