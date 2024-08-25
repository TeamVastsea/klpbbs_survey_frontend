'use client';

import { Button, Container, Space, Stack, Title } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useSearchParams } from 'next/navigation';
import Question from '@/app/(root)/survey/[id]/components/question';
import QuestionApi, { PageResponse, QuestionProps } from '@/api/QuestionApi';
import AnswerApi, { SaveRequest } from '@/api/AnswerApi';
import SurveyApi from '@/api/SurveyApi';

export default function SurveyPage({ params }: { params: { id: number } }) {
    const [currentPage, setCurrentPage] = useState<string | null>(null);
    const [nextPage, setNextPage] = useState<string | null>(null);
    const [questions, setQuestions] = useState<PageResponse | undefined>(undefined);
    const [answers, setAnswers] = useState<Map<string, string>>(new Map());
    const searchParams = useSearchParams();
    const questionsProps = useRef(new Map<string, QuestionProps>());

    const answerId = useRef(searchParams.get('answer'));

    function save() {
        const answerObject: any = {};
        answers.forEach((value, key) => {
            answerObject[key] = value;
        });

        const surveyID = Number(params.id);
        const raw: SaveRequest = {
            survey: surveyID,
            content: answerObject,
        };

        if (answerId.current != null) {
            raw.id = Number(answerId.current);
        }

        let flag = false;
        for (const q of questions?.content || []) {
            if ((!answers.has(q) || answers.get(q) === undefined)
                && checkAccess(questionsProps.current.get(q)?.condition || null)
                && questionsProps.current.get(q)?.required) {
                flag = true;
            }
        }
        if (flag) {
            notifications.show({
                title: '请填写所有题目',
                message: '请填写所有题目后再提交',
                color: 'red',
            });
            return;
        }

        AnswerApi.submitAnswer(raw)
            .then((result) => {
                answerId.current = result.toString();
            });

        if (nextPage !== null) {
            setCurrentPage(nextPage);
        }
    }

    const getAnswerSetter = (id: string) => (value: string) => {
        const newAnswers = new Map(answers);
        newAnswers.set(id, value);
        setAnswers(newAnswers);
    };

    const getAnswerGetter = (id: string) => answers.get(id) || undefined;

    const getPropsSetter = (id: string) => (value: QuestionProps) => {
        questionsProps.current.set(id, value);
    };

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

    useEffect(() => {
        SurveyApi.getSurvey(params.id)
            .then((result) => {
                setCurrentPage(result.page);
            }
        );
    }, [params.id]);

    useEffect(() => {
        if (currentPage !== null) {
            QuestionApi.fetchPage(currentPage)
                .then((response) => {
                    const pageResponse: PageResponse = {
                        id: response.id,
                        title: response.title,
                        budge: '',
                        content: response.content,
                        next: response.next,
                    };
                    setQuestions(pageResponse);
                    setNextPage(response.next);
                });
        }
    }, [currentPage]);

    return (
        <Stack>
            <Container maw={1600} w="90%">
                <Space h={100} />
                <Title>{questions?.title}</Title>
                {questions?.content.map((question, index) => (
                    <Question
                      id={question}
                      key={index}
                      value={getAnswerGetter(question)}
                      setValue={getAnswerSetter(question)}
                      setProps={getPropsSetter(question)}
                      checkAccess={checkAccess}
                    />
                ))}
                <Space h={50} />
                <Button onClick={save}>{nextPage == null ? '提交' : '下一页'}</Button>
                <Space h={180} />
            </Container>
        </Stack>
    );
}

export type ConditionType = 'and' | 'or' | 'not';

export interface Condition {
    id: string;
    value: any;
}

export interface Rule {
    type: ConditionType;
    conditions: Condition[];
}
