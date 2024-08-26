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
import AdminApi from '@/api/AdminApi';

export default function JudgeSinglePage({ params }: { params: { answerId: number } }) {
    const { answerId } = params;
    const [, setAnswer] = useState<AnswerInfo | null>(null);
    const [userAnswer, setUserAnswer] = useState<Map<string, string>>(new Map());
    const [scores, setScores] = useState<Map<string, number>>(new Map());
    const [totalScore, setTotalScore] = useState<number | null>(null);
    const [userScore, setUserScore] = useState<number | null>(null);
    const [page, setPage] = useState<Page | null>(null);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [judgeTime, setJudgeTime] = useState<string>('');
    const [judgeId, setJudgeId] = useState<number>(0);
    const [judgeName, setJudgeName] = useState<string>('');
    const questionsProps = useRef(new Map<string, QuestionProps>());

    useEffect(() => {
        AnswerApi.getAnswer(answerId)
            .then((res) => {
                setAnswer(res);
                setUserAnswer(new Map(Object.entries(res.answers)));
                setCompleted(res.completed);
                SurveyApi.getSurvey(res.survey)
                    .then((res2) => {
                        fetchPage(res2.page);
                    });
            });
    }, []);

    function fetchPage(nextPage: string) {
        QuestionApi.fetchPage(nextPage)
            .then((res) => {
                setPage(res);
                return JudgeApi.doJudge(answerId.toString());
            })
            .then((res) => {
                const scoreMap = new Map(Object.entries(res.scores));
                setScores(scoreMap);
                setTotalScore(res.full);
                setUserScore(res.user);
                setCompleted(res.completed);
                setJudgeTime(res.judge_time);
                setJudgeId(res.judge);
                return AdminApi.getAdminInfo(res.judge);
            })
            .then((res) => {
                setJudgeName(res.username);
            });
    }

    const getAnswerGetter = (id: string) => userAnswer.get(id) || undefined;

    const getPropsSetter = (id: string) => (value: QuestionProps) => {
        questionsProps.current.set(id, value);
    };

    function switchNextPage() {
        setLoading(true);
        if (page?.next == null) {
            setLoading(false);
            return;
        }

        fetchPage(page.next);
        setLoading(false);
    }

    function switchPrevPage() {
        setLoading(true);
        if (page?.previous == null) {
            setLoading(false);
            return;
        }

        fetchPage(page.previous);
        setLoading(false);
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
                            阅卷人: {judgeName}
                        </Text>
                        <Text c="gray">
                            &nbsp;(UID: {judgeId})
                        </Text>
                    </Center>
                    <Center>
                        <Text>
                            阅卷时间: {judgeTime.split('.')[0].replace('T', ' ')}
                        </Text>
                    </Center>
                </Alert>
            </Center>
            <Container maw={1600} w="90%">
                <Stack>
                    <Center>
                        <Title>{page?.title}</Title>
                    </Center>
                    {page?.content.map(question => (
                        <Question
                          id={question}
                          key={question}
                          value={getAnswerGetter(question)}
                          setValue={() => {}}
                          setProps={getPropsSetter(question)}
                          checkAccess={checkAccess}
                          score={scores.get(question)}
                          disabled
                        />
                    ))}
                </Stack>
                <Space h={50} />
                <Stack>
                    <Space>
                        <Button.Group>
                            <Button
                              variant="light"
                              disabled={page?.previous == null}
                              loading={loading}
                              onClick={switchPrevPage}
                              fullWidth
                            >
                                上一页
                            </Button>
                            <Button
                              variant="light"
                              disabled={page?.next == null}
                              loading={loading}
                              onClick={switchNextPage}
                              fullWidth
                            >
                                下一页
                            </Button>
                        </Button.Group>
                    </Space>
                    <Button color="green" disabled={completed} loading={loading}>
                        提交
                    </Button>
                </Stack>
                <Space h={180} />
            </Container>
        </Stack>

    );
}

interface Condition {
    id: string;
    value: any;
}
