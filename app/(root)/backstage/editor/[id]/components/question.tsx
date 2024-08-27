'use client';

import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { Card, Stack } from '@mantine/core';
import QuestionApi, { QuestionProps, StringifyQuestionProps } from '@/api/QuestionApi';
import { PageQuestionProps } from '@/app/(root)/survey/[id]/components/question';
import EditCard from '@/app/(root)/backstage/editor/[id]/components/EditCard';

export default function Question(props: PageQuestionProps) {
    const [question, setQuestion] = useState<QuestionProps>();

    function mapType(type: number) {
        switch (type) {
            case 1:
                return 'Text';
            case 2:
                return 'SingleChoice';
            case 3:
                return 'MultipleChoice';
            default:
                return '';
        }
    }

    function save() {
        if (!question) {
            return;
        }

        const stringifyQuestion: StringifyQuestionProps = {
            answer: question.answer === undefined ? undefined : {
                answer: question.answer,
                all_points: question.all_points,
                sub_points: question.sub_points,
            },
            condition: question.condition,
            content: question.content,
            id: question.id,
            required: question.required === undefined ? false : question.required,
            type: mapType(question.type),
            values: question.values,
        };

        QuestionApi.updateQuestion(stringifyQuestion).then(() => {
            notifications.show({
                title: '保存成功',
                message: '题目保存成功',
                color: 'green',
            });
        });
    }

    useEffect(() => {
        QuestionApi.fetchSingleQuestionAdmin(props.id).then((response) => {
            setQuestion(response);
            props.setProps(response);
        });
    }, []);

    return (
        <Card withBorder>
            <Stack gap="xs">
                {question ?
                    <EditCard question={question} setQuestion={setQuestion} save={save} /> : null}
            </Stack>
        </Card>
    );
}
