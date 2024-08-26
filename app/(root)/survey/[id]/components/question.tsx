'use client';

import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { generateQuestion, InputProps } from '@/app/(root)/survey/components/generateQuestion';
import { SERVER_URL } from '@/api/BackendApi';
import { QuestionProps } from '@/api/QuestionApi';
import { Cookie } from '@/components/cookie';

export default function Question(props: PageQuestionProps) {
    const [question, setQuestion] = useState<QuestionProps | undefined>(undefined);

    useEffect(() => {
        console.log(props.id, props.value);

        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

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
                    title: '获取题目失败, 请将以下信息反馈给管理员',
                    message: error.toString(),
                    color: 'red',
                })
            );
    }, [props.id]);

    return (
        <>
            {question ?
                props.checkAccess(question.condition as string) ?
                    generateQuestion(question, props.value, props.setValue, props.disabled) : null
                : null}
        </>
    );
}

export interface PageQuestionProps extends InputProps {
    id: string,
    checkAccess: (ruleStr: string) => boolean,
    setProps: (value: QuestionProps) => void,
    disabled?: boolean,
}
