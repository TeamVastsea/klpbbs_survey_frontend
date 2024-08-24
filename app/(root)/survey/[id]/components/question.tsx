'use client';

import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { generateQuestion, InputProps, QuestionProps } from '@/app/(root)/survey/components/generateQuestion';
import { SERVER_URL } from '@/api/BackendApi';

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

        fetch(`${SERVER_URL}/api/question/${props.id}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                const response: QuestionProps = JSON.parse(result);
                setQuestion(response);
                props.setProps(response);
            })
            .catch(error =>
                notifications.show({
                    title: '获取题目失败，请将以下信息反馈给管理员',
                    message: error.toString(),
                    color: 'red',
                })
            );
    }, [props.id]);

    return (
        <>
            {question ?
                props.checkAccess(question.condition as string) ?
                    generateQuestion(question, props.value, props.setValue) : null
                : null}
        </>
    );
}

export interface PageQuestionProps extends InputProps {
    id: string,
    checkAccess: (ruleStr: string) => boolean,
    setProps: (value: QuestionProps) => void,
}
