import { useState } from 'react';
import { Checkbox, Group, Stack, Text } from '@mantine/core';
import classes from './MultipleChoice.module.css';

interface Choice {
    title: string;
    content: string;
}

interface MultipleChoiceProps {
    data: Choice[];
}

export function MultipleChoice({ data }: MultipleChoiceProps) {
    const [value, setValue] = useState<string[]>([]);

    const cards = data.map((item) => (
        <Checkbox.Card className={classes.root} radius="md" value={item.title} key={item.title}>
            <Group wrap="nowrap" align="flex-start">
                <Checkbox.Indicator />
                <div>
                    <Text className={classes.label}>{item.title}</Text>
                    <Text className={classes.description}>{item.content}</Text>
                </div>
            </Group>
        </Checkbox.Card>
    ));

    return (
        <>
            <Checkbox.Group
              value={value}
              onChange={setValue}
              label="Pick multiple options"
              description="Choose one or more options"
            >
                <Stack pt="md" gap="xs">
                    {cards}
                </Stack>
            </Checkbox.Group>

            <Text fz="xs" mt="md">
                CurrentValue: {value.join(', ') || '–'}
            </Text>
        </>
    );
}
