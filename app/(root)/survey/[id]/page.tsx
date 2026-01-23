'use client';

import { Button, Container, Space, Stack } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import QuestionCard from '@/app/(root)/survey/[id]/components/question';
import QuestionApi, { Question } from '@/api/QuestionApi';
import { Cookie } from '@/components/cookie';
import SafeHTML from '@/components/SafeHTML';
import PageApi, { Page } from '@/api/PageApi';
import ScoreApi, { ScorePrompt } from '@/api/ScoreApi';
import Submits from '@/app/(root)/survey/[id]/components/submits';

export default function SurveyPage({ params }: { params: { id: number } }) {
    const [page, setPage] = useState<Page | undefined>(undefined);
    const [pageIndex, setPageIndex] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Map<number, string>>(new Map());
    const [answerId, setAnswerId] = useState<number | undefined>(undefined);
    const [submits, setSubmits] = useState<ScorePrompt[]>([]);
    const [opened, { open, close }] = useDisclosure(false);

    const router = useRouter();

    // const answerId = useRef(searchParams.get('answer'));

    async function save() {
        if (questions == null) {
            return false;
        }

        // 验证必填题
        let hasUnfilledRequired = false;
        const unfilledQuestions: string[] = [];

        for (const question of questions) {
            // 检查题目是否可见（满足条件）
            const isVisible = checkAccess(JSON.stringify(question.condition));

            // 如果题目可见且为必填题
            if (isVisible && question.required) {
                const answer = answers.get(question.id);

                // 检查答案是否为空
                if (!answer || answer.trim() === '' || answer === '[]') {
                    hasUnfilledRequired = true;
                    unfilledQuestions.push(question.content.title || `题目 ${question.id}`);
                }
            }
        }

        if (hasUnfilledRequired) {
            notifications.show({
                title: '请填写所有必填题',
                message: `以下必填题尚未完成：${unfilledQuestions.join('、')}`,
                color: 'red',
                autoClose: 5000,
            });
            return false;
        }

        try {
            const res = await ScoreApi.submitAnswer({
                id: answerId,
                survey: Number(params.id),
                content: Object.fromEntries(answers),
            });
            setAnswerId(res);
            return true;
        } catch (error) {
            return false;
        }
    }

    async function nextPage() {
        const saved = await save();
        if (!saved) {
            return;
        }

        if (questions == null) {
            return;
        }

        if (pageIndex < totalPage - 1) {
            setPageIndex(pageIndex + 1);
            return;
        }

        if (answerId === undefined) {
            return;
        }

        await ScoreApi.finishAnswer(answerId);

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

    const loadSubmit = (load: boolean, use: ScorePrompt) => {
        close();
        if (!load) {
            return;
        }

        const answerObject = JSON.parse(use.answer);
        const numberKeyedAnswerObject = new Map<number, string>(
            Object.entries(answerObject).map(([key, value]) => [Number(key), String(value)])
        );

        setAnswers(numberKeyedAnswerObject);
        setAnswerId(use.id);
    };

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

    useEffect(() => {
        ScoreApi.getAnswerList(Number(params.id)).then((answersSubmit) => {
            if (answersSubmit.length > 0) {
                setSubmits(answersSubmit);
                open();
            }
        });
    }, [params.id]);

    return (
        <Stack>
            <Container maw={1600} w="90%">
                <Stack>
                    <Space h={50} />
                    <SafeHTML content={page?.title || ''} />
                    <Submits submits={submits} opened={opened} onClose={loadSubmit} />
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
