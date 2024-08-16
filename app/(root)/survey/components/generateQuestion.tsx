import React from 'react';
import { Title, Text } from '@mantine/core';
import { SingleChoice } from './SingleChoice';
import { MultipleChoice } from './MultipleChoice';
import { FileUpload } from './FileUpload';
import { FillBlank } from './FillBlank';

export function generateQuestion(data: QuestionProps) {
    switch (data.type) {
        case 1:
            return (
                <div key={data.id}>
                    <Title order={3}>{`${data.content.title}`}</Title>
                    <p>{data.content.content}</p>
                    <FillBlank />
                </div>
            );
        case 2:
            return (
                <div key={data.id}>
                    <Title order={3}>{`${data.content.title}`}</Title>
                    <p>{data.content.content}</p>
                    <SingleChoice choice={data.values} />
                </div>
            );
        case 3:
            return (
                <div key={data.id}>
                    <Title order={3}>{`${data.content.title}`}</Title>
                    <p>{data.content.content}</p>
                    <MultipleChoice choice={data.values} />
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