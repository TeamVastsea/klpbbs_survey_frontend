import { Textarea } from '@mantine/core';
import { QuestionProps } from '@/components/Question/Question';

export default function TextQuestion(props: QuestionProps) {
  return (
    <Textarea
      autosize
      value={props.value}
      minRows={2}
      maxRows={4}
      onChange={(event) => props.setValue(event.currentTarget.value)}
      // ref={ref}
      // disabled={props.disabled}
    />
  );
}
