import { Checkbox, Group, Space, Stack, Text } from '@mantine/core';
import classes from './MultipleChoice.module.css';
import { ChoiceProps } from './SingleChoice';

export function MultipleChoice(props: ChoiceProps) {
    const data = props.choice;

    function setValue(value: string[]) {
        props.setValue(JSON.stringify(value));
    }

    const cards = data.map(({ title, content }, index) => (
        <Checkbox.Card className={classes.root} radius="md" value={index.toString()} key={index}>
            <Group wrap="nowrap" align="flex-start">
                <Checkbox.Indicator />
                <div>
                    <Text className={classes.label}>{title}</Text>
                    <Text className={classes.description}>{content}</Text>
                </div>
            </Group>
        </Checkbox.Card>
    ));

    return (
        <>
            <Checkbox.Group
              value={props.value === undefined ? [] : JSON.parse(props.value)}
              onChange={setValue}
            >
                <Stack pt="md" gap="xs">
                    {cards}
                </Stack>
            </Checkbox.Group>

            <Space h={40} />

            {/*<Text fz="xs" mt="md">*/}
            {/*    CurrentValue: {value.join(', ') || '–'}*/}
            {/*</Text>*/}
        </>
    );
}
