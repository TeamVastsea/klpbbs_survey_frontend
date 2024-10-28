import React from 'react';
import { Title, Text } from '@mantine/core';
import { SingleChoice } from '@/app/(root)/survey/components/SingleChoice';
import { MultipleChoice } from '@/app/(root)/survey/components/MultipleChoice';
import { FileUpload } from '@/app/(root)/survey/components/FileUpload';
import { FillBlank } from '@/app/(root)/survey/components/FillBlank';
import { Question } from '@/api/QuestionApi';

export function generateQuestion(
    data: Question,
    value: string | undefined,
    setValue: (value: string) => void,
    isDisable: boolean = false,
) {
    const titleContent = (
        <Title order={3}>
            {`${data.content.title}`}
            {data.required && <span style={{ color: 'red' }}> *</span>}
        </Title>
    );

    switch (data.type) {
        case 'Text':
            return (
                <div key={data.id}>
                    {titleContent}
                    <p>{data.content.content}</p>
                    <FillBlank
                      value={value}
                      setValue={setValue}
                      disabled={isDisable}
                    />
                </div>
            );
        case 'SingleChoice':
            return (
                <div key={data.id}>
                    {titleContent}
                    <p>{data.content.content}</p>
                    <SingleChoice
                      choice={data.values}
                      value={value}
                      setValue={setValue}
                      disabled={isDisable}
                    />
                </div>
            );
        case 'MultipleChoice':
            return (
                <div key={data.id}>
                    {titleContent}
                    <p>{data.content.content}</p>
                    <MultipleChoice
                      choice={data.values}
                      value={value}
                      setValue={setValue}
                      disabled={isDisable}
                    />
                </div>
            );
        case 'File':
            return (
                <div key={data.id}>
                    {titleContent}
                    <p>{data.content.content}</p>
                    <FileUpload
                      disabled={isDisable}
                    />
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

export interface InputProps {
    value: string | undefined,
    setValue: (value: string) => void,
    disabled?: boolean;
}
