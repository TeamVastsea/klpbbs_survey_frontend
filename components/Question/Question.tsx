import { Group, Text, Title } from '@mantine/core';
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
      {props.showCorrectAnswer && props.question.answer && (
        <Group mt="sm">
          <Text>标准答案：{props.question.answer.answer}</Text>
          <Text>用户回答：{props.value || '未作答'}</Text>
          <Text>得分：{props.score ?? 0}</Text>
          <Text>满分：{props.question.answer.all_points ?? 0}</Text>
          {props.question.answer.sub_points !== undefined && (
            <Text>部分分：{props.question.answer.sub_points}</Text>
          )}
        </Group>
      )}
    </div>
  );
}

export interface QuestionProps {
  question: Question;
  value: string;
  setValue: (value: string) => void;
  editable?: boolean;
  disabled?: boolean;
  showCorrectAnswer?: boolean;
  score?: number;
}
