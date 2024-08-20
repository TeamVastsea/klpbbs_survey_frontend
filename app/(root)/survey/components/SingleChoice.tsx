import { Group, Radio, Space, Stack, Text } from '@mantine/core';
import classes from './SingleChoice.module.css';
import type { InputProps, Value } from './generateQuestion';

export function SingleChoice(props: ChoiceProps) {
    const data = props.choice;

    const cards = data.map(({ title, content }, index) => (
        <Radio.Card className={classes.root} radius="md" value={index.toString()} key={index} disabled={props.disabled}>
            <Group wrap="nowrap" align="flex-start">
                <Radio.Indicator />
                <div>
                    <Text className={classes.label}>{title}</Text>
                    <Text className={classes.description}>{content}</Text>
                </div>
            </Group>
        </Radio.Card>
    ));

    return (
        <>
            <Radio.Group
              value={props.value}
              onChange={props.setValue}
            >
                <Stack pt="md" gap="xs">
                    {cards}
                </Stack>
            </Radio.Group>

            <Space h={40} />
        </>
    );
}

export interface ChoiceProps extends InputProps {
    choice: Value[];
}
