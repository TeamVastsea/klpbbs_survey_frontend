'use client';

import { Button, Center, Container, Group, Space, Stack, Text, Title } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useSearchParams } from 'next/navigation';
import Question from '@/app/(root)/backstage/editor/[id]/components/question';
import { SERVER_URL } from '@/api/BackendApi';
import EditCard from '@/app/(root)/backstage/editor/[id]/components/EditCard';
import { Cookie } from '@/components/cookie';
import QuestionApi, { QuestionContent, QuestionProps } from '@/api/QuestionApi';

export default function SurveyPage({ params }: { params: { id: number } }) {
    const [currentPage, setCurrentPage] = useState<number | null>(null);
    const [nextPage, setNextPage] = useState<number | null>(null);
    const [questions, setQuestions] = useState<PageResponse | undefined>(undefined);
    const [answers, setAnswers] = useState<Map<string, string>>(new Map());
    const searchParams = useSearchParams();
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

    const answerId: string | null = searchParams.get('answer');

    function save() {
        const myHeaders = new Headers();
        myHeaders.append('token', Cookie.getCookie('token'));
        myHeaders.append('Content-Type', 'application/json');

        const answerObject: any = {};
        answers.forEach((value, key) => {
            answerObject[key] = value;
        });

        const surveyID = Number(params.id);
        const raw: SaveRequest = {
            survey: surveyID,
            content: answerObject,
        };

        if (answerId) {
            raw.id = answerId;
        }

        let flag = false;
        for (const q of questions?.content || []) {
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
            return;
        }

        const bodyContent = JSON.stringify(raw);

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: bodyContent,
            redirect: 'follow',
        };

        fetch(`${SERVER_URL}/api/answer`, requestOptions)
            .then((response) => response.text())
            .then(() => {
                notifications.show({
                    title: '提交答案成功',
                    message: '答案已成功提交',
                    color: 'green',
                });
            })
            .catch((e) => {
                notifications.show({
                    title: '提交答案失败, 请将以下信息反馈给管理员',
                    message: e.toString(),
                    color: 'red',
                });
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
        myHeaders.append('token', '111');

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
            myHeaders.append('token', '111');

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
                ? JSON.parse(newQuestionObject.condition)
                : undefined,
            required: newQuestionObject.required,
            answer: newQuestionObject.answer
                ? JSON.parse(newQuestionObject.answer)
                : undefined,
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
    page: number;
    start_date: string;
    end_date: string;
}

export interface PageResponse {
    id: string;
    title: string;
    budge: string;
    content: string[];
    next: number | null;
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

interface SaveRequest {
    survey: number;
    content: any;
    id?: string;
    complete?: boolean;
}
