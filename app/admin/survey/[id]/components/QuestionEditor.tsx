import { useState } from 'react';
import { Input } from '@mantine/core';
import { useFocusWithin } from '@mantine/hooks';
import MultipleChoiceQuestion from '@/components/Question/MultipleChoiceQuestion';
import SingleChoiceQuestion from '@/components/Question/SingleChoiceQuestion';
import TextQuestion from '@/components/Question/TextQuestion';
import { Question } from '@/model/question';

export default function QuestionEditor(props: QuestionEditorProps) {
  const [title, setTitle] = useState(props.question.content.title);
  const { ref } = useFocusWithin({
    onBlur: () => {
      props.onSave(props.question);
    },
  });

  return (
    <div ref={ref}>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      <p>{props.question.content.content}</p>
      {props.question.type === 'Text' && <TextQuestion {...props} value="" setValue={() => {}} />}
      {props.question.type === 'SingleChoice' && (
        <SingleChoiceQuestion {...props} value="" setValue={() => {}} />
      )}
      {props.question.type === 'MultipleChoice' && (
        <MultipleChoiceQuestion {...props} value="" setValue={() => {}} />
      )}
    </div>
  );
}

export interface QuestionEditorProps {
  question: Question;
  onSave: (question: Question) => void;
}
