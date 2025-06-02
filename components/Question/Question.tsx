import { Title } from '@mantine/core';
import MultipleChoiceQuestion from '@/components/Question/MultipleChoiceQuestion';
import SingleChoiceQuestion from '@/components/Question/SingleChoiceQuestion';
import TextQuestion from '@/components/Question/TextQuestion';
import type { Question } from '@/model/question';

export default function Question(props: QuestionProps) {
  return (
    <div>
      <Title order={3}>
        {`${props.question.content.title}`}
        {props.question.required && <span style={{ color: 'red' }}> *</span>}
      </Title>
      <p>{props.question.content.content}</p>
      {props.question.type === 'Text' && <TextQuestion {...props} />}
      {props.question.type === 'SingleChoice' && <SingleChoiceQuestion {...props} />}
      {props.question.type === 'MultipleChoice' && <MultipleChoiceQuestion {...props} />}
    </div>
  );
}

export interface QuestionProps {
  question: Question;
  value: string;
  setValue: (value: string) => void;
  editable?: boolean;
}
