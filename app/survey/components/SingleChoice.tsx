import { useState } from 'react';
import { Group, Radio, Stack, Text } from '@mantine/core';
import classes from './SingleChoice.module.css';

interface Choice {
    title: string;
    content: string;
}

interface SingleChoiceProps {
    data: Choice[];
}

export function SingleChoice({ data }: SingleChoiceProps) {
    const [value, setValue] = useState<string | null>(null);

    const cards = data.map((item) => (
        <Radio.Card className={classes.root} radius="md" value={item.title} key={item.title}>
            <Group wrap="nowrap" align="flex-start">
                <Radio.Indicator />
                <div>
                    <Text className={classes.label}>{item.title}</Text>
                    <Text className={classes.description}>{item.content}</Text>
                </div>
            </Group>
        </Radio.Card>
    ));

    return (
        <>
            <Radio.Group
              value={value}
              onChange={setValue}
              label="Pick one option"
              description="Choose an option"
            >
                <Stack pt="md" gap="xs">
                    {cards}
                </Stack>
            </Radio.Group>

            <Text fz="xs" mt="md">
                CurrentValue: {value || '–'}
            </Text>
        </>
    );
}
