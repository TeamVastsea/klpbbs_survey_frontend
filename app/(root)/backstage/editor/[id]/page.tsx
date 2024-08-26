'use client';

import { Button, Center, Container, Group, Space, Stack, Text, Title } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { notifications } from '@mantine/notifications';
import Question from '@/app/(root)/backstage/editor/[id]/components/question';
import { SERVER_URL } from '@/api/BackendApi';
import EditCard from '@/app/(root)/backstage/editor/[id]/components/EditCard';
import { Cookie } from '@/components/cookie';
import QuestionApi, { Page, QuestionContent, QuestionProps } from '@/api/QuestionApi';

export default function SurveyPage({ params }: { params: { id: number } }) {
    const [currentPage, setCurrentPage] = useState<string | null>(null);
    const [nextPage, setNextPage] = useState<string | null>(null);
    const [questions, setQuestions] = useState<PageResponse | undefined>(undefined);
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

    function save() {
        savePage();

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
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
        };

        fetch(`${SERVER_URL}/api/survey/${params.id}`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                const response: SurveyResponse = JSON.parse(result);
                setCurrentPage(response.page);
            })
            .catch((error) => {
                notifications.show({
                    title: '获取试题失败, 请将以下信息反馈给管理员',
                    message: error.toString(),
                    color: 'red',
                });
            });
    }, [params.id]);

    useEffect(() => {
        if (currentPage !== null) {
            const myHeaders = new Headers();
            myHeaders.append('token', Cookie.getCookie('token'));

            const requestOptions: RequestInit = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
            };

            fetch(`${SERVER_URL}/api/question?page=${currentPage}`, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    const response: PageResponse = JSON.parse(result);
                    setQuestions(response);
                    setNextPage(response.next);
                });
        }
    }, [currentPage]);

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
            answer: {
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
        const page: Page = {
            id: questions.id,
            title: questions.title,
            budge: questions.budge,
            content: questions.content,
            next: nextPage,
        };

        QuestionApi.updatePage(page).then((res) => {
            setQuestions(res);
            setNextPage(res.next);

            notifications.show({
                title: '更新页面成功',
                message: '更新页面成功',
                color: 'green',
            });
        });
    }

    return (
        <Stack>
            <Center>
                <Title>
                    编辑页面
                </Title>
            </Center>
            <Center>
                <Text>
                    当前问卷: {params.id}
                </Text>
            </Center>
            <Container maw={1600} w="90%">
                <Stack>
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
                </Stack>
                <Space h={50} />
                <Group>
                    <Button onClick={save}>{nextPage == null ? '提交' : '下一页'}</Button>
                    <Button onClick={newQuestion}>新建</Button>
                </Group>
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
        </Stack>
    );
}

interface SurveyResponse {
    id: number;
    title: string;
    budge: string;
    description: string;
    image: string;
    page: string;
    start_date: string;
    end_date: string;
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
