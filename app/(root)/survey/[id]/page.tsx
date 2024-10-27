'use client';

import { Button, Container, Space, Stack } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useRouter, useSearchParams } from 'next/navigation';
import Question from '@/app/(root)/survey/[id]/components/question';
import QuestionApi, { PageResponse, Question } from '@/api/QuestionApi';
import AnswerApi, { SaveRequest } from '@/api/AnswerApi';
import SurveyApi from '@/api/SurveyApi';
import { Cookie } from '@/components/cookie';
import SafeHTML from '@/components/SafeHTML';

export default function SurveyPage({ params }: { params: { id: number } }) {
    const [questions, setQuestions] = useState<PageResponse | undefined>(undefined);
    const [answers, setAnswers] = useState<Map<string, string>>(new Map());
    const searchParams = useSearchParams();
    const questionsProps = useRef(new Map<string, Question>());

    const router = useRouter();

    const answerId = useRef(searchParams.get('answer'));

    function save(completed: boolean = false) {
        if (questions == null) {
            return false;
        }
        const answerObject: any = {};
        answers.forEach((value, key) => {
            answerObject[key] = value;
        });

        const surveyID = Number(params.id);
        const raw: SaveRequest = {
            survey: surveyID,
            content: answerObject,
            complete: completed,
        };

        if (answerId.current != null) {
            raw.id = Number(answerId.current);
        }

        let flag = false;
        for (const q of questions.content || []) {
            if (
                (!answers.has(q) || answers.get(q) === undefined) &&
                checkAccess(questionsProps.current.get(q)?.condition || null) &&
                questionsProps.current.get(q)?.required
            ) {
                flag = true;
            }
        }
        if (flag) {
            notifications.show({
                title: '请填写所有题目',
                message: '请填写所有题目后再提交',
                color: 'red',
            });
            return false;
        }

        AnswerApi.submitAnswer(raw).then((result) => {
            answerId.current = result.toString();
        });

        return true;
    }

    function nextPage() {
        let completed = false;
        if (questions?.next == null) {
            completed = true;
        }

        if (!save(completed)) {
            return;
        }

        if (questions == null) {
            return;
        }

        if (questions?.next !== null) {
            setPage(questions.next);
        }

        if (questions.next == null) {
            notifications.show({
                title: '提交成功',
                message: '试卷已成功提交',
                color: 'green',
            });

            router.push(`/survey/${params.id}/completed?fs=true`);
        }
    }

    function prevPage() {
        save();

        if (questions == null) {
            return;
        }

        if (questions?.previous !== null) {
            setPage(questions.previous);
        }
    }

    const getAnswerSetter = (id: string) => (value: string) => {
        const newAnswers = new Map(answers);
        newAnswers.set(id, value);
        setAnswers(newAnswers);
    };

    const getAnswerGetter = (id: string) => answers.get(id) || undefined;

    const getPropsSetter = (id: string) => (value: Question) => {
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

            if (
                (rule.type === 'and' && results.every(Boolean)) ||
                (rule.type === 'or' && results.some(Boolean)) ||
                (rule.type === 'not' && !results.every(Boolean))
            ) {
                return true;
            }
        }

        return false;
    }

    useEffect(() => {
        const status = Cookie.getCookie('status');
        if (status !== 'ok') {
            router.push('/oauth');
            return;
        }

        SurveyApi.getSurvey(params.id).then((result) => {
            setPage(result.page);
        });
    }, [params.id]);

    function setPage(page: string) {
        QuestionApi.fetchPage(page).then((response) => {
            const pageResponse: PageResponse = {
                previous: response.previous,
                id: response.id,
                title: response.title,
                badge: '',
                content: response.content,
                next: response.next,
            };
            setQuestions(pageResponse);
        });
    }

    return (
        <Stack>
            <Container maw={1600} w="90%">
                <Stack>
                    <Space h={50} />
                    {/* <iframe
                      width="100%"
                      style={{ border: 'none' }}
                      title="title"
                      srcDoc={questions?.title}
                      sandbox="allow-popups"
                    /> */}
                    <SafeHTML content={questions?.title || ''} />
                    {questions?.content.map((question) => (
                        <Question
                          id={question}
                          key={question}
                          value={getAnswerGetter(question)}
                          setValue={getAnswerSetter(question)}
                          setProps={getPropsSetter(question)}
                          checkAccess={checkAccess}
                        />
                    ))}
                </Stack>
                <Space h={50} />
                <Stack>
                    <Button.Group>
                        <Button
                          variant="light"
                          disabled={questions?.previous == null}
                          onClick={prevPage}
                          fullWidth
                        >
                            上一页
                        </Button>
                        <Button
                          variant={questions?.next == null ? 'filled' : 'light'}
                          onClick={nextPage}
                          fullWidth
                        >
                            {questions?.next == null ? '提交' : '下一页'}
                        </Button>
                    </Button.Group>
                </Stack>
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
