'use client';

import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { Card, Stack } from '@mantine/core';
import { QuestionProps } from '@/api/QuestionApi';
import { PageQuestionProps } from '@/app/(root)/survey/[id]/components/question';
import EditCard from '@/app/(root)/backstage/editor/[id]/components/EditCard';
import { SERVER_URL } from '@/api/BackendApi';
import { Cookie } from '@/components/cookie';

export default function Question(props: PageQuestionProps) {
    const [question, setQuestion] = useState<QuestionProps>();

    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
        };

        fetch(`${SERVER_URL}/api/question/admin/${props.id}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                const response: QuestionProps = JSON.parse(result);
                setQuestion(response);
                props.setProps(response);
            })
            .catch(error =>
                notifications.show({
                    title: '获取题目失败, 请将以下信息反馈给管理员',
                    message: error.toString(),
                    color: 'red',
                })
            );
    }, []);

    return (
        <Card withBorder>
            <Stack gap="xs">
                {question ?
                    <EditCard question={question} setQuestion={setQuestion} /> : null}
            </Stack>
        </Card>
    );
}
