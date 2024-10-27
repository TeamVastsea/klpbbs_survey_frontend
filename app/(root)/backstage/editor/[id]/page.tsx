'use client';

import {
    ActionIcon,
    Button,
    Card,
    Center,
    Container,
    Group,
    Space,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { IconGripHorizontal } from '@tabler/icons-react';
import cx from 'clsx';
import QuestionCard from '@/app/(root)/backstage/editor/[id]/components/questionCard';
import EditCard from '@/app/(root)/backstage/editor/[id]/components/EditCard';
import QuestionApi, { Question } from '@/api/QuestionApi';
import classes from './DndTable.module.css';
import ClickToEdit from '@/components/ClickToEdit';
import PageApi, { Page } from '@/api/PageApi';

export default function SurveyPage({ params }: { params: { id: string } }) {
    const [page, setPage] = useState<Page | undefined>(undefined);
    const [pageIndex, setPageIndex] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Map<number, string>>(new Map());
    const questionsProps = useRef(new Map<number, Question>());
    const [done, setDone] = useState(false);
    const [showNewQuestion, setShowNewQuestion] = useState(false);
    const [newQuestionObject, setNewQuestionObject] = useState<Question>({
        page: Number(params.id),
        answer: {
            answer: '',
            all_points: 0,
            sub_points: 0,
        },
        condition: [],
        content: {
            title: '',
            content: '',
        },
        id: 0,
        required: false,
        type: 'Text',
        values: [],
    });

    useEffect(() => {
        setDone(false);
        freshPage();
    }, [params.id, pageIndex]);

    const freshPage = () => {
        PageApi.fetchPageByIndex(Number(params.id), pageIndex)
            .then((response) => {
                setPage(response.data);
                setTotalPage(response.total);
                QuestionApi.fetchQuestionByPage(response.data.id).then((res) => {
                    setQuestions(res);
                    setDone(true);
                });
            });
    };

    const updateMap = <K, V>(
        map: Map<K, V>,
        key: K,
        value?: V,
        setMap?: React.Dispatch<React.SetStateAction<Map<K, V>>> | React.MutableRefObject<Map<K, V>>
    ) => {
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
    };

    const getAnswerSetter = (id: number) => (value: string) => {
        updateMap(answers, id, value, setAnswers);
    };

    const getAnswerGetter = (id: number) => updateMap(answers, id, undefined);

    const getPropsSetter = (id: number) => (value: Question) => {
        updateMap(questionsProps.current, id, value, questionsProps);
    };

    const handleDragEnd = (result: DropResult) => {
        if (page == null ||
            result.destination == null ||
            result.source.index === result.destination.index) {
            return;
        }

        setDone(false);
        setQuestions([]);

        QuestionApi.swapQuestion(page.id, result.source.index, result.destination.index)
            .then(() => {
                QuestionApi.fetchQuestionByPage(page.id).then((res) => {
                    setQuestions(res);
                    setDone(true);
                });
            }); // fresh page doesn't work here
    };

    async function createPage() {
        if (page == null) {
            return;
        }
        // create new page
        await PageApi.newPage('', Number(params.id), pageIndex);

        notifications.show({
            title: '新建页面成功',
            message: '新建页面成功',
            color: 'green',
        });
    }

    const newQuestion = () => {
        if (page == null) {
            return;
        }

        setNewQuestionObject({
            page: page.id,
            answer: {
                answer: '',
                all_points: 0,
                sub_points: 0,
            },
            condition: [],
            content: {
                title: '',
                content: '',
            },
            id: 0,
            required: false,
            type: 'Text',
            values: [],
        });

        setShowNewQuestion(true);
    };

    function saveNewQuestion() {
        if (page == null) {
            return;
        }

        setNewQuestionObject({
            ...newQuestionObject,
            page: page.id,
        });

        QuestionApi.createQuestion(newQuestionObject).then(() => {
            notifications.show({
                title: '创建题目成功',
                message: '创建题目成功',
                color: 'green',
            });
            setShowNewQuestion(false);
            freshPage();
        });
    }

    const savePage = () => {
        if (page == null) {
            return;
        }

        PageApi.updatePage(page).then(() => {
            notifications.show({
                title: '保存成功',
                message: '保存成功',
                color: 'green',
            });
        });
    };

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
                      content={page?.title || ''}
                      onSave={(title) => {
                            if (page) {
                                const newQuestions = { ...page, title };
                                setPage(newQuestions);
                                savePage();
                            }
                        }}
                    />
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="questions-list" direction="vertical">
                            {(droppableProvided) => (
                                <Stack
                                  ref={droppableProvided.innerRef}
                                  {...droppableProvided.droppableProps}>
                                    {questions.map((question, index) => (
                                        <Draggable
                                          key={question.id}
                                          draggableId={question.id.toString()}
                                          index={index}>
                                            {(draggableProvided, snapshot) => (
                                                <Card
                                                  ref={draggableProvided.innerRef}
                                                  {...draggableProvided.draggableProps}
                                                  className={cx(classes.item, {
                                                        [classes.itemDragging]: snapshot.isDragging,
                                                    })}
                                                  withBorder
                                                  radius="md"
                                                >
                                                    <Stack>
                                                        <ActionIcon
                                                          {...draggableProvided.dragHandleProps}
                                                          variant="subtle"
                                                          color="gray"
                                                        >
                                                            <IconGripHorizontal />
                                                        </ActionIcon>
                                                        <QuestionCard
                                                          question={question}
                                                          value={getAnswerGetter(question.id)}
                                                          setValue={getAnswerSetter(question.id)}
                                                          setProps={getPropsSetter(question.id)}
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
                              disabled={pageIndex > 0}
                                // loading={}
                              onClick={() => setPageIndex(pageIndex - 1)}
                              fullWidth
                            >
                                上一页
                            </Button>
                            <Button
                              variant="light"
                              disabled={pageIndex < totalPage - 1}
                                // loading={}
                              onClick={() => setPageIndex(pageIndex + 1)}
                              fullWidth
                            >
                                下一页
                            </Button>
                        </Button.Group>
                        <Group grow>
                            <Button onClick={createPage}>新建页面</Button>
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
