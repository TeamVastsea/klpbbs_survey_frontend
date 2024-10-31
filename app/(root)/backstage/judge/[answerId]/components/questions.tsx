'use client';

import { Group, Space, Stack, Text } from '@mantine/core';
import { generateQuestion, InputProps } from '@/app/(root)/survey/components/generateQuestion';
import { Question } from '@/api/QuestionApi';

export default function QuestionCard(props: PageQuestionProps) {
    return (
        <Stack>
            {!props.checkAccess(JSON.stringify(props.question.condition))
                ? '(隐藏题目, 用户无需作答)'
                : null}
            {generateQuestion(props.question, props.value, props.setValue, true)}
            {props.question.answer?.answer &&
                <Group>
                    <Text>标准答案：{props.question.answer.answer}</Text>
                    <Text>用户选择：{props.value}</Text>
                    <Text>得分：{props.score}</Text>
                    {props.question.answer.all_points &&
                        <Text>满分：{props.question.answer.all_points}</Text>}
                    {props.question.answer.sub_points &&
                        <Text>半分：{props.question.answer.sub_points}</Text>}
                </Group>}
            <Space h={40} />
        </Stack>
    );
}

export interface PageQuestionProps extends InputProps {
    question: Question,
    checkAccess: (ruleStr: string) => boolean,
    score?: number,
}
