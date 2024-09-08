'use client';

import { Center, Container, Stack, Text, Title } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { IconGripHorizontal } from '@tabler/icons-react';
import cx from 'clsx';
import Question from '@/app/(root)/backstage/editor/[id]/components/question';
import QuestionApi, { Page, QuestionProps } from '@/api/QuestionApi';
import SurveyApi from '@/api/SurveyApi';
import classes from './DndTable.module.css';

export default function SurveyPage({ params }: { params: { id: number } }) {
    const [questions, setQuestions] = useState<Page | undefined>(undefined);
    const [answers, setAnswers] = useState<Map<string, string>>(new Map());
    const questionsProps = useRef(new Map<string, QuestionProps>());
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
        SurveyApi.getSurvey(params.id).then((res) => {
            fetchPage(res.page);
        });
    }, [params.id]);

    function fetchPage(page: string) {
        QuestionApi.fetchPage(page).then((response) => {
            setQuestions(response);
            setDone(true);
        });
    }

    function savePage() {
        if (questions == null) return;

        QuestionApi.updatePage(questions).then(() => {
            notifications.show({
                title: '保存页面成功',
                message: '页面顺序已更新',
                color: 'green',
            });
        });
    }

    return (
        <Stack>
            <Center>
                <Title>编辑页面</Title>
            </Center>
            {!done ? (
                <Center>
                    <Text size="md">Loading...</Text>
                </Center>
            ) : (
                <>
                    <Container maw={1600} w="90%">
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
                                                    <div
                                                      ref={draggableProvided.innerRef}
                                                      {...draggableProvided.draggableProps}
                                                      className={cx(classes.item, {
                                                            [classes.itemDragging]:
                                                            snapshot.isDragging,
                                                        })}
                                                    >
                                                        <Stack>
                                                            <div
                                                              {...draggableProvided.dragHandleProps}
                                                              className={classes.dragHandle}
                                                            >
                                                                <IconGripHorizontal />
                                                            </div>
                                                            <Question
                                                              id={questionId}
                                                              value={getAnswerGetter(questionId)}
                                                              setValue={getAnswerSetter(questionId)}
                                                              setProps={getPropsSetter(questionId)}
                                                              checkAccess={() => true}
                                                            />
                                                        </Stack>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {droppableProvided.placeholder}
                                    </Stack>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Container>
                </>
            )}
        </Stack>
    );
}
