'use client';

import { useEffect, useState } from 'react';
import {Center, Title, Stack, Space} from '@mantine/core';
import { generateQuestion } from '@/app/survey/components/generateQuestion';
import questionsData from '@/app/survey/data/example.json';

export default function Survey() {
    const [questions, setQuestions] = useState<any[]>([]);

    useEffect(() => {
        setQuestions(questionsData);
    }, []);

    return (
        <Stack
          bg="var(--mantine-color-body)"
          align="stretch"
          justify="center"
          gap="md"
          style={{ padding: '20px 0' }}
        >
            <Center>
                <Title>Survey</Title>
            </Center>
            <Center>
                <Stack style={{ width: '340px' }}>
                    {questions.map((question) => generateQuestion(question))}
                </Stack>
            </Center>
            <Space h={100} />
        </Stack>
    );
}
