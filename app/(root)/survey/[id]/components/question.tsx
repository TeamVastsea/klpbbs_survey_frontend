'use client';

import { generateQuestion, InputProps } from '@/app/(root)/survey/components/generateQuestion';
import type { Question } from '@/api/QuestionApi';

export default function Question(props: PageQuestionProps) {
    return (
        <>
            {props.checkAccess(JSON.stringify(props.question.condition)) ?
                generateQuestion(props.question, props.value, props.setValue, props.disabled)
                : null}
        </>
    );
}

export interface PageQuestionProps extends InputProps {
    question: Question,
    checkAccess: (ruleStr: string) => boolean,
    setProps: (value: Question) => void,
    disabled?: boolean,
}
