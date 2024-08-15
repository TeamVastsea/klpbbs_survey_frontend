import React from 'react';
import { Text, Title } from '@mantine/core';
import { SingleChoice } from '@/app/survey/components/SingleChoice';
import { MultipleChoice } from '@/app/survey/components/MultipleChoice';
import { FileUpload } from '@/app/survey/components/FileUpload';
import { FillBlank } from '@/app/survey/components/FillBlank';

// eslint-disable-next-line max-len
export function generateQuestion(data: QuestionProps, value: string | undefined, setValue: (value: string) => void) {
    switch (data.type) {
        case 1:
            return (
                <div key={data.id}>
                    <Title order={3}>{`${data.content.title}`}</Title>
                    <p>{data.content.content}</p>
                    <FillBlank value={value} setValue={setValue} />
                </div>
            );
        case 2:
            return (
                <div key={data.id}>
                    <Title order={3}>{`${data.content.title}`}</Title>
                    <p>{data.content.content}</p>
                    <SingleChoice choice={data.values} value={value} setValue={setValue} />
                </div>
            );
        case 3:
            return (
                <div key={data.id}>
                    <Title order={3}>{`${data.content.title}`}</Title>
                    <p>{data.content.content}</p>
                    <MultipleChoice choice={data.values} value={value} setValue={setValue} />
                </div>
            );
        case 4:
            return (
                <div key={data.id}>
                    <Title order={3}>{`${data.content.title}`}</Title>
                    <p>{data.content.content}</p>
                    <FileUpload />
                </div>
            );
        default:
            return (
                <div>
                    <Text>Failed to fetch questions!</Text>
                </div>
            );
    }
}

export interface QuestionProps {
    id: string
    content: Value
    type: number
    values: Value[]
    condition: any
}

export interface Value {
    content: string
    title: string
}

export interface InputProps {
    value: string | undefined,
    setValue: (value: string) => void,
}
