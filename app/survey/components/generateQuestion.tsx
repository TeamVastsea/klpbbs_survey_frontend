import React from 'react';
import { SingleChoice } from '@/app/survey/components/SingleChoice';
import { MultipleChoice } from '@/app/survey/components/MultipleChoice';
import { FileUpload } from '@/app/survey/components/FileUpload';
import { FillBlank } from '@/app/survey/components/FillBlank';

interface QuestionData {
    id: number;
    type: number;
    title: string;
    description: string;
    values?: string[];
}

export function generateQuestion(data: QuestionData) {
    const parsedValues = data.values ? data.values.map((v) => JSON.parse(v)) : [];

    switch (data.type) {
        case 1:
            return (
                <div key={data.id}>
                    <h3>{data.title}</h3>
                    <p>{data.description}</p>
                    <FillBlank />
                </div>
            );
        case 2:
            return (
                <div key={data.id}>
                    <h3>{data.title}</h3>
                    <p>{data.description}</p>
                    <SingleChoice data={parsedValues} />
                </div>
            );
        case 3:
            return (
                <div key={data.id}>
                    <h3>{data.title}</h3>
                    <p>{data.description}</p>
                    <MultipleChoice data={parsedValues} />
                </div>
            );
        case 4:
            return (
                <div key={data.id}>
                    <h3>{data.title}</h3>
                    <p>{data.description}</p>
                    <FileUpload />
                </div>
            );
        default:
            return null;
    }
}
