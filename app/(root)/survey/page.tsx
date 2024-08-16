'use client';

import { useEffect, useState } from 'react';
import { Center, Title, Stack } from '@mantine/core';
import { generateQuestion } from './components/generateQuestion';
import questionsData from './data/example.json';

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
        </Stack>
    );
}
