'use client';

import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { generateQuestion, QuestionProps } from '@/app/survey/components/generateQuestion';

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

        fetch(`https://wj.klpbbs.cn/api/question/${props.id}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                const response: QuestionProps = JSON.parse(result);
                setQuestion(response);
            })
            .catch(error => notifications.show({ title: 'Error', message: error.toString(), color: 'red' }));
    }, []);

    return (
        <>
            {question ? generateQuestion(question) : null}
        </>
    );
}

export interface PageQuestionProps {
    id: string,
}
