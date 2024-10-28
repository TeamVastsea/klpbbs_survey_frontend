'use client';

import { Button, Container, Space, Stack } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import QuestionCard from '@/app/(root)/survey/[id]/components/question';
import QuestionApi, { Question } from '@/api/QuestionApi';
import { Cookie } from '@/components/cookie';
import SafeHTML from '@/components/SafeHTML';
import PageApi, { Page } from '@/api/PageApi';

export default function SurveyPage({ params }: { params: { id: number } }) {
    const [page, setPage] = useState<Page | undefined>(undefined);
    const [pageIndex, setPageIndex] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Map<number, string>>(new Map());

    const router = useRouter();

    // const answerId = useRef(searchParams.get('answer'));

    function save(completed: boolean = false) {
        // if (questions == null) {
        //     return false;
        // }
        // const answerObject: any = {};
        // answers.forEach((value, key) => {
        //     answerObject[key] = value;
        // });
        //
        // const surveyID = Number(params.id);
        // const raw: SaveRequest = {
        //     survey: surveyID,
        //     content: answerObject,
        //     complete: completed,
        // };
        //
        // if (answerId.current != null) {
        //     raw.id = Number(answerId.current);
        // }
        //
        // let flag = false;
        // for (const q of questions.content || []) {
        //     if (
        //         (!answers.has(q) || answers.get(q) === undefined) &&
        //         checkAccess(questionsProps.current.get(q)?.condition || null) &&
        //         questionsProps.current.get(q)?.required
        //     ) {
        //         flag = true;
        //     }
        // }
        // if (flag) {
        //     notifications.show({
        //         title: '请填写所有题目',
        //         message: '请填写所有题目后再提交',
        //         color: 'red',
        //     });
        //     return false;
        // }
        //
        // AnswerApi.submitAnswer(raw).then((result) => {
        //     answerId.current = result.toString();
        // });

        console.log(completed);

        return true;
    }

    function nextPage() {
        let completed = false;
        if (pageIndex >= totalPage - 1) {
            completed = true;
        }

        if (!save(completed)) {
            return;
        }

        if (questions == null) {
            return;
        }

        if (pageIndex < totalPage - 1) {
            setPageIndex(pageIndex + 1);
            return;
        }

        notifications.show({
            title: '提交成功',
            message: '试卷已成功提交',
            color: 'green',
        });

        router.push(`/survey/${params.id}/completed?fs=true`);
    }

    function prevPage() {
        save();

        if (pageIndex > 0) {
            setPageIndex(pageIndex - 1);
        }
    }

    const getAnswerSetter = (id: number) => (value: string) => {
        const newAnswers = new Map(answers);
        newAnswers.set(id, value);
        setAnswers(newAnswers);
    };

    const getAnswerGetter = (id: number) => answers.get(id) || undefined;

    // const getPropsSetter = (id: number) => (value: Question) => {
    //     questions.current.set(id, value);
    // };

    function checkAccess(ruleStr: string | null): boolean {
        if (ruleStr == null) {
            return true;
        }

        const rules: Rule[] = JSON.parse(ruleStr);

        const equals = (condition: any, answer: any) => {
            if (condition instanceof Array) {
                const answerArray: string[] = JSON.parse(answer);

                for (const conditionElement of condition) {
                    if (answerArray.includes(conditionElement)) {
                        return true;
                    }
                }

                return false;
            }

            return condition === answer;
        };

        for (const rule of rules) {
            const results = rule.conditions.map((condition) =>
                equals(condition.value, getAnswerGetter(condition.id)));

            if (
                (rule.type === 'and' && results.every(Boolean)) ||
                (rule.type === 'or' && results.some(Boolean)) ||
                (rule.type === 'not' && !results.every(Boolean))
            ) {
                return true;
            }
        }

        return rules.length === 0;
    }

    useEffect(() => {
        const status = Cookie.getCookie('status');
        if (status !== 'ok') {
            router.push('/oauth');
            return;
        }

        PageApi.fetchPageByIndex(Number(params.id), pageIndex).then((result) => {
            setPage(result.data);
            setTotalPage(result.total);

            QuestionApi.fetchQuestionByPage(result.data.id).then((res) => {
                setQuestions(res);
            });
        });
    }, [params.id, pageIndex]);

    return (
        <Stack>
            <Container maw={1600} w="90%">
                <Stack>
                    <Space h={50} />
                    <SafeHTML content={page?.title || ''} />
                    {questions?.map((question) => (
                        <QuestionCard
                          question={question}
                          key={question.id}
                          value={getAnswerGetter(question.id)}
                          setValue={getAnswerSetter(question.id)}
                          setProps={() => {}}
                          checkAccess={checkAccess}
                        />
                    ))}
                </Stack>
                <Space h={50} />
                <Stack>
                    <Button.Group>
                        <Button
                          variant="light"
                          disabled={pageIndex <= 0}
                          onClick={prevPage}
                          fullWidth
                        >
                            上一页
                        </Button>
                        <Button
                          variant={pageIndex >= totalPage - 1 ? 'filled' : 'light'}
                          onClick={nextPage}
                          fullWidth
                        >
                            {pageIndex >= totalPage - 1 ? '提交' : '下一页'}
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
    id: number;
    value: any;
}

export interface Rule {
    type: ConditionType;
    conditions: Condition[];
}
