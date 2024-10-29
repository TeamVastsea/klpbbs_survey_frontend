'use client';

import React, { useEffect, useState } from 'react';
import { Alert, Button, Center, Container, Group, Space, Stack, Text, Title } from '@mantine/core';
import { IconCheck, IconInfoCircle, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import ScoreApi, { Score } from '@/api/ScoreApi';
import QuestionApi, { Question } from '@/api/QuestionApi';
import { Rule } from '@/app/(root)/survey/[id]/page';
import QuestionCard from '@/app/(root)/backstage/judge/[answerId]/components/questions';
import JudgeApi from '@/api/JudgeApi';
import SafeHTML from '@/components/SafeHTML';
import PageApi, { Page } from '@/api/PageApi';
import UserApi from '@/api/UserApi';
import { Cookie } from '@/components/cookie';

export default function JudgeSinglePage({ params }: { params: { answerId: number } }) {
    const { answerId } = params;
    const [answer, setAnswer] = useState<Score | null>(null);
    const [userAnswer, setUserAnswer] = useState<Map<number, string>>(new Map());
    const [scores, setScores] = useState<Map<number, number>>(new Map());
    const [pageIndex, setPageIndex] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [page, setPage] = useState<Page | undefined>(undefined);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [judge, setJudge] = useState('');

    useEffect(() => {
        ScoreApi.getAnswer(answerId)
            .then((res) => {
                setAnswer(res);
                setUserAnswer(new Map(Object.entries(JSON.parse(res.answer))
                    .map(([key, value]) => [Number(key), String(value)])));
                setScores(new Map(Object.entries(JSON.parse(res.scores || '{}'))
                    .map(([key, value]) => [Number(key), Number(value)])));
                setCompleted(res.judge != null);
            });
    }, [answerId]);

    useEffect(() => {
        if (answer == null) {
            return;
        }

        PageApi.fetchPageByIndex(answer.survey, pageIndex)
            .then((res) => {
                setPage(res.data);
                setTotalPage(res.total);
                QuestionApi.fetchQuestionByPage(res.data.id)
                    .then((result) => {
                        setQuestions(result);
                        setLoading(false);
                    });
            });
    }, [answer, pageIndex]);

    useEffect(() => {
        if (answer == null || answer.judge === undefined) {
            return;
        }
        UserApi.getOtherUserInfo(answer.judge)
            .then((res) => {
                setJudge(res.username);
            });
    }, [answer?.judge]);

    const getAnswerGetter = (id: number) => userAnswer.get(id) || undefined;

    function switchNextPage() {
        setLoading(true);

        if (pageIndex >= totalPage - 1) {
            setLoading(false);
            return;
        }

        setPageIndex(pageIndex + 1);
    }

    function switchPrevPage() {
        setLoading(true);
        if (pageIndex <= 0) {
            setLoading(false);
            return;
        }

        setPageIndex(pageIndex - 1);
    }

    function checkAccess(ruleStr: string | null): boolean {
        if (ruleStr == null) {
            return true;
        }

        const rules: Rule[] = JSON.parse(ruleStr);

        const equals = (condition: any, user: any) => {
            if (condition instanceof Array) {
                const answerArray: string[] = JSON.parse(user);

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

    function save() {
        setLoading(true);
        JudgeApi.confirmJudge(answerId.toString()).then(() => {
            setCompleted(true);
            setLoading(false);

            setAnswer({
                ...answer,
                judge: Cookie.getCookie('uid'),
                judge_time: new Date().toISOString(),
            } as Score);
        });
    }

    return (
      <Stack>
        <Center>
          <Title>阅卷系统</Title>
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
              <Text>当前问卷: {answerId}</Text>
            </Center>
            <Center>
              <Text>
                用户得分: {answer?.user_scores} / {answer?.full_scores}
              </Text>
            </Center>
            <Center>
              <Group gap={1} c={completed ? 'green' : 'red'}>
                {completed ? <IconCheck size={16} /> : <IconX size={16} />}
                {completed ? '已阅卷' : '待阅卷'}
              </Group>
            </Center>
            <Center>
              <Text>阅卷人: {judge}</Text>
              <Text c="gray">&nbsp;(UID: {answer?.judge})</Text>
            </Center>
            <Center>
              <Text>阅卷时间: {answer?.judge_time}</Text>
            </Center>
          </Alert>
        </Center>
        <Container maw={1600} w="90%">
          <Stack>
            <SafeHTML content={page?.title || ''} />
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                value={getAnswerGetter(question.id)}
                setValue={() => {}}
                checkAccess={checkAccess}
                score={scores.get(question.id)}
              />
            ))}
          </Stack>
          <Space h={50} />
          <Stack>
            <Space>
              <Button.Group>
                <Button
                  variant="light"
                  disabled={pageIndex <= 0}
                  loading={loading}
                  onClick={switchPrevPage}
                  fullWidth
                >
                  上一页
                </Button>
                <Button
                  variant="light"
                  disabled={pageIndex >= totalPage - 1}
                  loading={loading}
                  onClick={switchNextPage}
                  fullWidth
                >
                  下一页
                </Button>
              </Button.Group>
            </Space>
              <Button.Group>
                  <Button color="green" disabled={answer?.judge != null} onClick={save} fullWidth>
                      提交
                  </Button>
                  <Button
                    onClick={() => {
                      ScoreApi.judgeAnswer(answerId).then((res) => {
                          setAnswer(res);
                          setUserAnswer(new Map(Object.entries(JSON.parse(res.answer))
                              .map(([key, value]) => [Number(key), String(value)])));
                          setCompleted(res.judge != null);
                          notifications.show({
                                title: '重新阅卷成功',
                                message: '已重新阅卷',
                                color: 'green',
                          });
                      });
                    }}
                    fullWidth
                    disabled={answer?.judge != null}>
                      重新阅卷
                  </Button>
              </Button.Group>
          </Stack>
          <Space h={180} />
        </Container>
      </Stack>
    );
}
