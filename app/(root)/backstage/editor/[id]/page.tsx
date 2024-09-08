'use client';

import { Button, Center, Container, Group, Space, Stack, Text, Title } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { notifications } from '@mantine/notifications';
import Question from '@/app/(root)/backstage/editor/[id]/components/question';
import EditCard from '@/app/(root)/backstage/editor/[id]/components/EditCard';
import QuestionApi, { Page, QuestionContent, QuestionProps } from '@/api/QuestionApi';
import SurveyApi from '@/api/SurveyApi';

export default function SurveyPage({ params }: { params: { id: number } }) {
    const [questions, setQuestions] = useState<Page | undefined>(undefined);
    const [answers, setAnswers] = useState<Map<string, string>>(new Map());
    const questionsProps = useRef(new Map<string, QuestionProps>());
    const [showNewQuestion, setShowNewQuestion] = useState(false);
    const [newQuestionObject, setNewQuestionObject] = useState<QuestionProps>({
        all_points: 0,
        answer: '',
        condition: '',
        content: {
            title: '',
            content: '',
        },
        id: '',
        required: false,
        sub_points: 0,
        type: 0,
        values: [],
    });
    const [done, setDone] = useState(false);

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
        SurveyApi.getSurvey(params.id).then((res) => {
            fetchPage(res.page);
        });
    }, [params.id]);

    function fetchNextPage() {
        savePage();
        if (questions?.next == null) {
            return;
        }
        setDone(false);
        fetchPage(questions.next);
    }

    function fetchPrevPage() {
        savePage();
        if (questions?.previous == null) {
            return;
        }
        setDone(false);
        fetchPage(questions.previous);
    }

    function fetchPage(page: string) {
        QuestionApi.fetchPage(page)
            .then((response) => {
                setQuestions(response);
            })
            .then(() => {
                setDone(true);
            });
    }

    function newQuestion() {
        setNewQuestionObject({
            all_points: 0,
            answer: '',
            condition: '',
            content: {
                title: '',
                content: '',
            },
            id: '',
            required: false,
            sub_points: 0,
            type: 0,
            values: [],
        });

        setShowNewQuestion(true);
    }

    function saveNewQuestion() {
        let type = '';

        if (newQuestionObject.type === 1) {
            type = 'Text';
        } else if (newQuestionObject.type === 2) {
            type = 'SingleChoice';
        } else if (newQuestionObject.type === 3) {
            type = 'MultipleChoice';
        }

        const content: QuestionContent = {
            content: newQuestionObject.content,
            type,
            values: newQuestionObject.values,
            condition: newQuestionObject.condition
                ? JSON.parse(newQuestionObject.condition).toString()
                : undefined,
            required: newQuestionObject.required,
            answer: newQuestionObject.answer === undefined || newQuestionObject.answer === '' ?
                undefined : {
                answer: newQuestionObject.answer
                    ? JSON.parse(newQuestionObject.answer).toString()
                    : undefined,
                all_points: newQuestionObject.all_points,
                sub_points: newQuestionObject.sub_points,
            },
        };

        QuestionApi.createQuestion(content).then((res) => {
            notifications.show({
                title: '创建题目成功',
                message: '创建题目成功',
                color: 'green',
            });
            setShowNewQuestion(false);

            if (questions) {
                const newContent = questions.content;
                newContent?.push(res);
                setQuestions({
                    ...questions,
                    content: newContent,
                });
            }

            savePage();
        });
    }

    function savePage() {
        if (questions == null) {
            return;
        }

        savePageByPage(questions);
    }

    function savePageByPage(page: Page) {
        QuestionApi.updatePage(page).then((res) => {
            setQuestions(res);

            notifications.show({
                title: '保存页面成功',
                message: '保存页面成功',
                color: 'green',
            });
        });
    }

    async function createPage() {
        if (questions == null) {
            return;
        }

        const newPageId: string = await QuestionApi.createPage();
        const nextPage: Page | null = questions.next == null ?
            null : await QuestionApi.fetchPage(questions.next);
        const thisPage: Page = questions;
        const newPage: Page = await QuestionApi.fetchPage(newPageId);

        thisPage.next = newPageId;
        savePageByPage(thisPage);
        setQuestions(thisPage);

        newPage.previous = thisPage.id;
        newPage.next = nextPage?.id || null;
        savePageByPage(newPage);

        if (nextPage) {
            nextPage.previous = newPageId;
            savePageByPage(nextPage);
        }
    }

    return (
        <Stack>
            <Center>
                <Title>
                    编辑页面
                </Title>
            </Center>
            {!done
                ? (
                    <Center>
                        <Text size="md">
                            Loading...
                        </Text>
                    </Center>
                ) : (
                    <>
                        <Center>
                            <Text>
                                当前问卷: {params.id}
                            </Text>
                        </Center>
                        <Container maw={1600} w="90%">
                            <Stack>
                                {questions?.content.map(question => (
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
                                        // loading={}
                                      onClick={fetchPrevPage}
                                      fullWidth
                                    >
                                        上一页
                                    </Button>
                                    <Button
                                      variant="light"
                                      disabled={questions?.next == null}
                                        // loading={loading}
                                      onClick={fetchNextPage}
                                      fullWidth
                                    >
                                        下一页
                                    </Button>
                                </Button.Group>
                                <Group grow>
                                    <Button onClick={createPage}>
                                        新建页面
                                    </Button>
                                    <Button onClick={newQuestion}>新建问题</Button>
                                </Group>
                            </Stack>
                            {showNewQuestion && (
                                <>
                                    <Space h={20} />
                                    <div
                                      style={{
                                            backgroundColor: 'rgba(185, 190, 185, 0.3)',
                                            borderRadius: '10px',
                                            padding: '10px',
                                        }}
                                    >
                                        <EditCard
                                          question={newQuestionObject}
                                          setQuestion={setNewQuestionObject}
                                          cancel={() => setShowNewQuestion(false)}
                                          save={saveNewQuestion}
                                        />
                                    </div>
                                </>
                            )}
                            <Space h={180} />
                        </Container>
                    </>
                )
            }
        </Stack>
    );
}

export interface PageResponse {
    id: string;
    title: string;
    budge: string;
    content: string[];
    next: string | null;
}

type ConditionType = 'and' | 'or' | 'not';

interface Condition {
    id: string;
    value: any;
}

interface Rule {
    type: ConditionType;
    conditions: Condition[];
}
