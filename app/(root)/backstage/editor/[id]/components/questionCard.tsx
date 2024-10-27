'use client';

import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { Stack } from '@mantine/core';
import QuestionApi from '@/api/QuestionApi';
import { PageQuestionProps } from '@/app/(root)/survey/[id]/components/question';
import EditCard from '@/app/(root)/backstage/editor/[id]/components/EditCard';

export default function QuestionCard(props: PageQuestionProps) {
    const [question, setQuestion] = useState(props.question);

    function save() {
        if (!question) {
            return;
        }

        QuestionApi.updateQuestion(question).then(() => {
            notifications.show({
                title: '保存成功',
                message: '题目保存成功',
                color: 'green',
            });
        });
    }

    return (
        <Stack gap="xs">
            <EditCard question={question} setQuestion={setQuestion} save={save} />
        </Stack>
    );
}
