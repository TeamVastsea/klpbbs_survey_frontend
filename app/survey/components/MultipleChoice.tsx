import { useState } from 'react';
import { Checkbox, Group, Stack, Text } from '@mantine/core';
import classes from './MultipleChoice.module.css';

const data = [
    {
        name: '@mantine/core',
        description: 'Core components library: inputs, buttons, overlays, etc.',
    },
    { name: '@mantine/hooks', description: 'Collection of reusable hooks for React applications.' },
    { name: '@mantine/notifications', description: 'Notifications system' },
];

export function MultipleChoice() {
    const [value, setValue] = useState<string[]>([]);

    const cards = data.map((item) => (
        <Checkbox.Card className={classes.root} radius="md" value={item.name} key={item.name}>
            <Group wrap="nowrap" align="flex-start">
                <Checkbox.Indicator />
                <div>
                    <Text className={classes.label}>{item.name}</Text>
                    <Text className={classes.description}>{item.description}</Text>
                </div>
            </Group>
        </Checkbox.Card>
    ));

    return (
        <>
            <Checkbox.Group
              value={value}
              onChange={setValue}
              label="Pick packages to install"
              description="Choose all packages that you will need in your application"
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
