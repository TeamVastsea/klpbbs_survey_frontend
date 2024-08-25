'use client';

import { useEffect, useState } from 'react';
import { Group, Space, Stack, Text } from '@mantine/core';
import { generateQuestion, InputProps } from '@/app/(root)/survey/components/generateQuestion';
import QuestionApi, { QuestionProps } from '@/api/QuestionApi';

export default function Question(props: PageQuestionProps) {
    const [question, setQuestion] = useState<QuestionProps | undefined>(undefined);

    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append('token', '111');

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
        };

        // fetch(`${SERVER_URL}/api/question/admin/${props.id}`, requestOptions)
        //     .then(response => response.text())
        //     .then(result => {
        //         const response: QuestionProps = JSON.parse(result);
        //         setQuestion(response);
        //         props.setProps(response);
        //     })
        //     .catch(error =>
        //         notifications.show({
        //             title: '获取题目失败，请将以下信息反馈给管理员',
        //             message: error.toString(),
        //             color: 'red',
        //         })
        //     );
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
    setProps: (value: QuestionProps) => void,
    disabled: boolean,
    score?: number,
}
