'use client';

import { useEffect, useState } from 'react';
import { Center, Title, Stack } from '@mantine/core';
import { generateQuestion } from '@/app/survey/components/generateQuestion';
import questionsData from '@/app/survey/data/example.json';

export default function Survey() {
    const [questions, setQuestions] = useState<any[]>([]);

    useEffect(() => {
        // Parse the JSON data and set it to state
        setQuestions(questionsData);
    }, []);

    return (
        <Stack
          bg="var(--mantine-color-body)"
          align="stretch"
          justify="center"
          gap="md"
        >
            <Center>
                <Title>Survey</Title>
            </Center>
            <Center>
                <Stack>
                    {questions.map((question) => generateQuestion(question))}
                </Stack>
            </Center>
        </Stack>
    );
}
