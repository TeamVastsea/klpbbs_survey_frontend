import { useState } from 'react';
import { Checkbox, Group, Space, Stack, Text } from '@mantine/core';
import classes from './MultipleChoice.module.css';
import { ChoiceProps } from '@/app/survey/components/SingleChoice';

export function MultipleChoice(props: ChoiceProps) {
    const [value, setValue] = useState<string[]>([]);
    const data = props.choice;

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
              value={value}
              onChange={setValue}
              // label="Pick multiple options"
              // description="Choose one or more options"
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
