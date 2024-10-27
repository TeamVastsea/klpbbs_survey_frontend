'use client';

import { useEffect, useState } from 'react';
import { Group, Space, Stack, Text } from '@mantine/core';
import { generateQuestion, InputProps } from '@/app/(root)/survey/components/generateQuestion';
import QuestionApi, { Question } from '@/api/QuestionApi';

export default function Question(props: PageQuestionProps) {
    const [question, setQuestion] = useState<Question | undefined>(undefined);

    useEffect(() => {
        QuestionApi.fetchSingleQuestionAdmin(props.id)
            .then((response) => {
                setQuestion(response);
                props.setProps(response);
            });
    }, [props.id]);

    return (
        <Stack>
            {question
                ? !props.checkAccess(question.condition as string)
                    ? '(隐藏题目, 用户无需作答)'
                    : null
                : null}
            {question ?
                generateQuestion(question, props.value, props.setValue, props.disabled)
                : null}
            {question?.answer ?
                <Group>
                    <Text>标准答案：{question.answer}</Text>
                    <Text>用户选择：{props.value}</Text>
                    <Text>得分：{props.score}</Text>
                </Group> : null}
            <Space h={40} />
        </Stack>
    );
}

export interface PageQuestionProps extends InputProps {
    id: string,
    checkAccess: (ruleStr: string) => boolean,
    setProps: (value: Question) => void,
    disabled: boolean,
    score?: number,
}
