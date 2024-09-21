'use client';

import { ActionIcon, Button, Card, Center, Container, Group, Space, Stack, Text, Title } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { IconGripHorizontal } from '@tabler/icons-react';
import cx from 'clsx';
import Question from '@/app/(root)/backstage/editor/[id]/components/question';
import EditCard from '@/app/(root)/backstage/editor/[id]/components/EditCard';
import QuestionApi, { Page, QuestionContent, QuestionProps } from '@/api/QuestionApi';
import SurveyApi from '@/api/SurveyApi';
import classes from './DndTable.module.css';
import ClickToEdit from '@/components/ClickToEdit';

export default function SurveyPage({ params }: { params: { id: number } }) {
    const [questions, setQuestions] = useState<Page | undefined>(undefined);
    const [answers, setAnswers] = useState<Map<string, string>>(new Map());
    const questionsProps = useRef(new Map<string, QuestionProps>());
    const [done, setDone] = useState(false);
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

    function updateMap<K, V>(
        map: Map<K, V>,
        key: K,
        value?: V,
        setMap?: React.Dispatch<React.SetStateAction<Map<K, V>>> | React.MutableRefObject<Map<K, V>>
    ): V | undefined {
        if (setMap) {
            if (typeof setMap === 'function') {
                const newMap = new Map(map);
                newMap.set(key, value as V);
                setMap(newMap);
            } else {
                setMap.current.set(key, value as V);
            }
            return undefined;
        }
        return map.get(key);
    }

    const getAnswerSetter = (id: string) => (value: string) => {
        updateMap(answers, id, value, setAnswers);
    };

    const getAnswerGetter = (id: string) => updateMap(answers, id, undefined);

    const getPropsSetter = (id: string) => (value: QuestionProps) => {
        updateMap(questionsProps.current, id, value, questionsProps);
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const updatedQuestions = Array.from(questions?.content || []);
        const [movedQuestion] = updatedQuestions.splice(result.source.index, 1);
        updatedQuestions.splice(result.destination.index, 0, movedQuestion);

        setQuestions((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                content: updatedQuestions,
            };
        });

        savePage();
    };

    useEffect(() => {
        setDone(false);
        SurveyApi.getSurvey(params.id).then((res) => {
            fetchPage(res.page);
        });
    }, [params.id]);

    function fetchPage(page: string | undefined | null) {
        if (page == null) {
            return;
        }
        savePage();
        setDone(false);

        QuestionApi.fetchPage(page).then((response) => {
            setQuestions(response);
            setDone(true);
        });
    }

    async function createPage() {
        if (questions == null) {
            return;
        }
        // create new page
        const newPageId: string = await QuestionApi.createPage();
        // get all pages
        const nextPage: Page | null = questions.next == null ?
          null : await QuestionApi.fetchPage(questions.next);
        const thisPage: Page = questions;
        const newPage: Page = await QuestionApi.fetchPage(newPageId);
        // update index
        thisPage.next = newPageId;
        newPage.next = nextPage?.id || null;
        newPage.previous = thisPage.id;
        savePageByPage(thisPage);
        setQuestions(thisPage);
        savePageByPage(newPage);
        if (nextPage) {
            nextPage.previous = newPageId;
            savePageByPage(nextPage);
        }

        notifications.show({
            title: '新建页面成功',
            message: '新建页面成功',
            color: 'green',
        });
    }

    function savePage() {
        if (questions == null) {
            return;
        }

        savePageByPage(questions, true);
    }
    function savePageByPage(page: Page, showNotification: boolean = false) {
        QuestionApi.updatePage(page).then(() => {
            if (showNotification) {
                notifications.show({
                    title: '保存页面成功',
                    message: '保存页面成功',
                    color: 'green',
                });
            }
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
        } else {
            notifications.show({
                title: '题目类型错误',
                message: '请选择题目类型',
                color: 'red',
            });
            return;
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

    return (
        <Stack>
            <Center>
                <Title>编辑页面</Title>
            </Center>
            {!done ? (
                <Center>
                    <Text size="md">加载中...</Text>
                </Center>
            ) : (
                <Container maw={1600} w="90%">
                    <ClickToEdit
                      alwaysShowBar
                      content={questions?.title || ''}
                      onSave={title => {
                        if (questions) {
                            const newQuestions = { ...questions, title };
                            setQuestions(newQuestions);
                            savePageByPage(questions);
                        }
                    }} />
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="questions-list" direction="vertical">
                            {(droppableProvided) => (
                                <Stack
                                  {...droppableProvided.droppableProps}
                                  ref={droppableProvided.innerRef}
                                >
                                    {questions?.content.map((questionId, index) => (
                                        <Draggable
                                          key={questionId}
                                          draggableId={questionId}
                                          index={index}
                                        >
                                            {(draggableProvided, snapshot) => (
                                                <Card
                                                  ref={draggableProvided.innerRef}
                                                  {...draggableProvided.draggableProps}
                                                  className={cx(classes.item, {
                                                        [classes.itemDragging]:
                                                        snapshot.isDragging,
                                                    })}
                                                  withBorder
                                                  radius="md"
                                                >
                                                    <Stack>
                                                        <ActionIcon {...draggableProvided.dragHandleProps} variant="subtle" color="gray">
                                                            <IconGripHorizontal />
                                                        </ActionIcon>
                                                        <Question
                                                          id={questionId}
                                                          value={getAnswerGetter(questionId)}
                                                          setValue={getAnswerSetter(questionId)}
                                                          setProps={getPropsSetter(questionId)}
                                                          checkAccess={() => true}
                                                        />
                                                    </Stack>
                                                </Card>
                                            )}
                                        </Draggable>
                                    ))}
                                    {droppableProvided.placeholder}
                                </Stack>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <Space h={20} />

                    <Stack>
                        <Button.Group>
                            <Button
                              variant="light"
                              disabled={questions?.previous == null}
                              // loading={}
                              onClick={() => fetchPage(questions?.previous)}
                              fullWidth
                            >
                                上一页
                            </Button>
                            <Button
                              variant="light"
                              disabled={questions?.next == null}
                              // loading={loading}
                              onClick={() => fetchPage(questions?.next)}
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
                            <Button onClick={savePage}>保存页面</Button>
                        </Group>
                    </Stack>
                    <Space h={20} />

                    {showNewQuestion && (
                        <Card
                          style={{
                                backgroundColor: 'rgba(185, 190, 185, 0.3)',
                            }}
                          radius="md"
                        >
                            <EditCard
                              question={newQuestionObject}
                              setQuestion={setNewQuestionObject}
                              cancel={() => setShowNewQuestion(false)}
                              save={saveNewQuestion}
                            />
                        </Card>
                    )}
                </Container>
            )}
        </Stack>
    );
}
