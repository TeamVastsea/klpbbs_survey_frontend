import {QuestionProps} from "@/components/Question/Question";
import {Checkbox, Group, Stack, Text} from "@mantine/core";
import classes from "./MultipleChoiceQuestion.module.css";

export default function MultipleChoiceQuestion(props: QuestionProps) {
  return (
    <>
      <Checkbox.Group
        value={props.value === undefined || props.value === '' ? [] : JSON.parse(props.value)}
        onChange={(value) => props.setValue(JSON.stringify(value))}
      >
        <Stack pt="md" gap="xs">
          {
            props.question.values.map((choice, index) => (
              <Checkbox.Card className={classes.root} radius="md" value={index.toString()} key={index}>
                <Group wrap="nowrap" align="flex-start">
                  <Checkbox.Indicator />
                  <div>
                    <Text className={classes.label}>{choice.title}</Text>
                    <Text className={classes.description}>{choice.content}</Text>
                  </div>
                </Group>
              </Checkbox.Card>
            ))
          }
        </Stack>
      </Checkbox.Group>
    </>
  );
}
