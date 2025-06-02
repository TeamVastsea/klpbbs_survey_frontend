import { Group, Radio, Stack, Text } from '@mantine/core';
import { QuestionProps } from '@/components/Question/Question';
import classes from './SingleChoiceQuestion.module.css';

export default function SingleChoiceQuestion(props: QuestionProps) {
  return (
    <>
      <Radio.Group value={props.value} onChange={props.setValue}>
        <Stack pt="md" gap="xs">
          {props.question.values.map((choice, index) => (
            <Radio.Card className={classes.root} radius="md" value={index.toString()} key={index}>
              <Group wrap="nowrap" align="flex-start">
                <Radio.Indicator />
                <div>
                  <Text className={classes.label}>{choice.title}</Text>
                  <Text className={classes.description}>{choice.content}</Text>
                </div>
              </Group>
            </Radio.Card>
          ))}
        </Stack>
      </Radio.Group>
    </>
  );
}
