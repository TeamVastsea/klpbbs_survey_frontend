import { useState } from 'react';
import { Group, Radio, Stack, Text } from '@mantine/core';
import classes from './SingleChoice.module.css';

const data = [
    {
        name: '@mantine/core',
        description: 'Core components library: inputs, buttons, overlays, etc.',
    },
    {
        name: '@mantine/hooks',
        description: 'Collection of reusable hooks for React applications.',
    },
    {
        name: '@mantine/notifications',
        description: 'Notifications system',
    },
];

export function SingleChoice() {
    const [value, setValue] = useState<string | null>(null);

    const cards = data.map((item) => (
        <Radio.Card className={classes.root} radius="md" value={item.name} key={item.name}>
            <Group wrap="nowrap" align="flex-start">
                <Radio.Indicator />
                <div>
                    <Text className={classes.label}>{item.name}</Text>
                    <Text className={classes.description}>{item.description}</Text>
                </div>
            </Group>
        </Radio.Card>
    ));

    return (
        <>
            <Radio.Group
              value={value}
              onChange={setValue}
              label="Pick one package to install"
              description="Choose a package that you will need in your application"
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
