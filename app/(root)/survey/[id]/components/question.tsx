'use client';

import { useEffect, useState } from 'react';
import { generateQuestion, InputProps } from '@/app/(root)/survey/components/generateQuestion';
import QuestionApi, { QuestionProps } from '@/api/QuestionApi';

export default function Question(props: PageQuestionProps) {
    const [question, setQuestion] = useState<QuestionProps | undefined>(undefined);

    useEffect(() => {
        QuestionApi.fetchSingleQuestion(props.id)
            .then((response) => {
                setQuestion(response);
                props.setProps(response);
            });
    }, [props.id]);

    return (
        <>
            {question ?
                props.checkAccess(question.condition as string) ?
                    generateQuestion(question, props.value, props.setValue, props.disabled) : null
                : null}
        </>
    );
}

export interface PageQuestionProps extends InputProps {
    id: string,
    checkAccess: (ruleStr: string) => boolean,
    setProps: (value: QuestionProps) => void,
    disabled?: boolean,
}
