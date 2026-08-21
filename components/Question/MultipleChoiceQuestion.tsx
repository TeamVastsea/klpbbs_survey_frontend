import { Checkbox, Group, Stack, Text } from '@mantine/core';
import { QuestionProps } from '@/components/Question/Question';
import classes from './MultipleChoiceQuestion.module.css';

export default function MultipleChoiceQuestion(props: QuestionProps) {
  const parseSelection = (value: string): string[] => {
    if (!value) {
      return [];
    }
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const getCardColor = (index: number) => {
    if (!props.showCorrectAnswer || !props.question.answer) {
      return undefined;
    }

    const option = index.toString();
    const userSelected = parseSelection(props.value).includes(option);
    const isCorrect = parseSelection(props.question.answer.answer).includes(option);

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
      <Checkbox.Group
        value={parseSelection(props.value)}
        onChange={(value) => props.setValue(JSON.stringify(value))}
      >
        <Stack pt="md" gap="xs">
          {props.question.values.map((choice, index) => (
            <Checkbox.Card
              className={classes.root}
              radius="md"
              value={index.toString()}
              key={index}
              disabled={props.disabled}
              style={{ backgroundColor: getCardColor(index) }}
            >
              <Group wrap="nowrap" align="flex-start">
                <Checkbox.Indicator />
                <div>
                  <Text className={classes.label}>{choice.title}</Text>
                  <Text className={classes.description}>{choice.content}</Text>
                </div>
              </Group>
            </Checkbox.Card>
          ))}
        </Stack>
      </Checkbox.Group>
    </>
  );
}
