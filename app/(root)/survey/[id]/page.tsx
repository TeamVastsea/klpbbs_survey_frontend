'use client';

import { Button, Container, Space, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import Question from '@/app/(root)/survey/[id]/components/question';

export default function SurveyPage({ params }: { params: { id: string } }) {
    const [questions, setQuestion] = useState<PageResponse | undefined>(undefined);
    const [answers, setAnswers] = useState<Map<string, string>>(new Map());

    const getAnswerSetter = (id: string) => (value: string) => {
        const newAnswers = new Map(answers);
        newAnswers.set(id, value);
        setAnswers(newAnswers);
    };

    type ConditionType = 'and' | 'or' | 'not';
    interface Condition {
        id: string;
        value: any;
    }
    interface Rule {
        type: ConditionType;
        conditions: Condition[];
    }

    function checkAccess(ruleStr: string | null): boolean {
        if (ruleStr == null) {
            return true;
        }

        const rules: Rule[] = JSON.parse(ruleStr);

        for (const rule of rules) {
            const results = rule.conditions.map((condition) => {
                if (condition.value instanceof Array) {
                    const value: string[] = JSON.parse(getAnswerGetter(condition.id) || '[]');
                    for (const v of condition.value) {
                        if (value.includes(v)) {
                            return true;
                        }
                    }

                    return false;
                }

                return getAnswerGetter(condition.id) === JSON.stringify(condition.value);
            });
            if ((rule.type === 'and' && results.every(Boolean)) ||
                (rule.type === 'or' && results.some(Boolean)) ||
                (rule.type === 'not' && !results.every(Boolean))) {
                return true;
            }
        }
        return false;
    }

    const getAnswerGetter = (id: string) => answers.get(id) || undefined;

    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append('token', '111');

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
        };

        fetch(`https://wj.klpbbs.cn/api/question?page=${params.id}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                const response: PageResponse = JSON.parse(result);
                setQuestion(response);
            })
            .catch(error => {
                notifications.show({ title: 'Error', message: error.toString(), color: 'red' });
            });
    }, []);

    return (
        <Stack>
            <Container maw={1600} w="90%">
                <Space h={100} />
                    {questions?.content.map((question, index) =>
                        <Question
                          id={question}
                          key={index}
                          value={getAnswerGetter(question)}
                          setValue={getAnswerSetter(question)}
                          checkAccess={checkAccess} />)}
                <Space h={50} />
                <Button>{questions?.next == null ? '提交' : '下一页'}</Button>
                <Space h={180} />
            </Container>
        </Stack>
    );
}

export interface PageResponse {
    id: string
    title: string
    content: string[]
    next: any
}
