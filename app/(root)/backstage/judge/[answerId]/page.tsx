'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Center, Container, Group, Space, Stack, Text, Title } from '@mantine/core';
import { IconCheck, IconInfoCircle, IconX } from '@tabler/icons-react';
import AnswerApi, { AnswerInfo } from '@/api/AnswerApi';
import QuestionApi, { Page, QuestionProps } from '@/api/QuestionApi';
import SurveyApi from '@/api/SurveyApi';
import { Rule } from '@/app/(root)/survey/[id]/page';
import Question from '@/app/(root)/backstage/judge/[answerId]/components/questions';
import JudgeApi from '@/api/JudgeApi';
import { green } from 'next/dist/lib/picocolors';

export default function JudgeSinglePage({ params }: { params: { answerId: number } }) {
    const { answerId } = params;
    const [, setAnswer] = useState<AnswerInfo | null>(null);
    const [userAnswer, setUserAnswer] = useState<Map<string, string>>(new Map());
    const [scores, setScores] = useState<Map<string, number>>(new Map());
    const [totalScore, setTotalScore] = useState<number | null>(null);
    const [userScore, setUserScore] = useState<number | null>(null);
    const [page, setPage] = useState<Page | null>(null);
    const [currentPage, setCurrentPage] = useState<string | null>(null);
    const [nextPage, setNextPage] = useState<string | null>(null);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const questionsProps = useRef(new Map<string, QuestionProps>());

    useEffect(() => {
        AnswerApi.getAnswer(answerId)
            .then((res) => {
                setAnswer(res);
                setUserAnswer(new Map(Object.entries(res.answers)));
                setCompleted(res.completed);
                SurveyApi.getSurvey(res.survey)
                    .then((res2) => {
                        setCurrentPage(res2.page);
                    });
            });
    }, []);

    useEffect(() => {
        if (currentPage == null) {
            return;
        }
        QuestionApi.fetchPage(currentPage)
            .then((res) => {
                setNextPage(res.next);
                setPage(res);
                return JudgeApi.doJudge(answerId.toString());
            })
            .then((res) => {
                const scoreMap = new Map(Object.entries(res.scores));
                setScores(scoreMap);
                setTotalScore(res.full);
                setUserScore(res.user);
                setCompleted(res.completed);
            });
    }, [currentPage]);

    const getAnswerGetter = (id: string) => userAnswer.get(id) || undefined;

    const getPropsSetter = (id: string) => (value: QuestionProps) => {
        questionsProps.current.set(id, value);
    };

    function switchNextPage() {
        setLoading(true);
        if (nextPage == null) {
            save();
            setLoading(false);
            return;
        }

        setCurrentPage(nextPage);
        setLoading(false);
    }

    function save() {
        JudgeApi.confirmJudge(answerId.toString()).then(() => {
            setCompleted(true);
        });
    }

    function checkAccess(ruleStr: string | null): boolean {
        if (ruleStr == null) {
            return true;
        }

        const rules: Rule[] = JSON.parse(ruleStr);

        for (const rule of rules) {
            const results = rule.conditions.map((condition: Condition) => {
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

    return (
        <Stack>
            <Center>
                <Title>
                    阅卷系统
                </Title>
            </Center>
            <Center>
                <Alert
                  variant="light"
                  color={completed ? 'green' : 'blue'}
                  title={
                    <Group gap={5}>
                        {completed ? <IconCheck /> : <IconInfoCircle />}
                        <Text>当前问卷状态</Text>
                    </Group>
                  }
                  w={370}
                >
                    <Center>
                        <Text>
                            当前问卷: {answerId}
                        </Text>
                    </Center>
                    <Center>
                        <Text>
                            用户得分: {userScore} / {totalScore}
                        </Text>
                    </Center>
                    <Center>
                        <Group gap={1} c={completed ? 'green' : 'red'}>
                            {completed ? <IconCheck size={16} /> : <IconX size={16} />}
                            {completed ? '已阅卷' : '待阅卷'}
                        </Group>
                    </Center>
                    <Center>
                        <Text>
                            最后一次阅卷人: TestPerson
                        </Text>
                        <Text c="gray">
                            &nbsp;(UID: 123456)
                        </Text>
                    </Center>
                    <Center>
                        <Text>
                            最后阅卷时间: 2021-10-10 10:10:10
                        </Text>
                    </Center>
                </Alert>
            </Center>
            <Container maw={1600} w="90%">
                <Stack>
                    <Center>
                        <Title>{page?.title}</Title>
                    </Center>
                    {page?.content.map((question, index) => (
                        <Question
                          id={question}
                          key={index}
                          value={getAnswerGetter(question)}
                          setValue={() => {}}
                          setProps={getPropsSetter(question)}
                          checkAccess={checkAccess}
                          score={scores.get(question)}
                          disabled />
                    ))}
                </Stack>
                <Space h={50} />
                <Button loading={loading} disabled={nextPage == null && completed} onClick={switchNextPage}>{nextPage == null ? '提交' : '下一页'}</Button>
                <Space h={180} />
            </Container>
        </Stack>

    );
}

interface Condition {
    id: string;
    value: any;
}
