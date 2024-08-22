'use client';

import { Center, Container, SimpleGrid, Space, Stack, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { min } from '@floating-ui/utils'; // Only import the min function
import BadgeCard from '@/app/(root)/backstage/components/BadgeCard';
import SurveyApi, { SurveyInfo } from '@/api/SurveyApi';

export default function EditorPage() {
    const [surveys, setSurveys] = useState<SurveyInfo[]>([]); // Use SurveyInfo[] type

    // Fetch survey list on component mount
    useEffect(() => {
        SurveyApi.getList(0, 10, '') // Fetch the first page, 10 surveys
            .then(r => setSurveys(r))
            .catch(error => console.error('Failed to fetch surveys:', error));
    }, []);

    return (
        <Stack>
            <Space h={50} />
            <Center>
                <Title>所有问卷</Title>
            </Center>
            <Space h={50} />
            <Container w="80%">
                <SimpleGrid
                  cols={{
                      base: 1,
                      sm: min(2, surveys.length),
                      lg: min(3, surveys.length),
                }}
                >
                    {surveys.map((survey: SurveyInfo) => (
                        <Center key={survey.id}>
                            <BadgeCard survey={survey} showBadge />
                        </Center>
                    ))}
                </SimpleGrid>
            </Container>
        </Stack>
    );
}
