import { Group, Radio, Stack, Text } from '@mantine/core';
import { QuestionProps } from '@/components/Question/Question';
import classes from './SingleChoiceQuestion.module.css';

export default function SingleChoiceQuestion(props: QuestionProps) {
  const getCardColor = (index: number) => {
    if (!props.showCorrectAnswer || !props.question.answer) {
      return undefined;
    }

    const option = index.toString();
    const userSelected = props.value === option;
    const isCorrect = props.question.answer.answer === option;

    if (userSelected && !isCorrect) {
      return 'rgba(255, 0, 0, 0.1)';
    }
    if (userSelected && isCorrect) {
      return 'rgba(0, 0, 255, 0.1)';
    }
    if (!userSelected && isCorrect) {
      return 'rgba(0, 255, 0, 0.1)';
    }
    return undefined;
  };

  return (
    <>
      <Radio.Group value={props.value} onChange={props.setValue}>
        <Stack pt="md" gap="xs">
          {props.question.values.map((choice, index) => (
            <Radio.Card
              className={classes.root}
              radius="md"
              value={index.toString()}
              key={index}
              disabled={props.disabled}
              style={{ backgroundColor: getCardColor(index) }}
            >
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
