import { Text, Textarea } from '@mantine/core';
import React, { useRef, useState } from 'react';

export function FillBlank() {
    const [currentValue, setCurrentValue] = useState('');
    const ref = useRef<HTMLTextAreaElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentValue(event.currentTarget.value);
    };

    return (
        <>
            <Textarea
              label="Autosize with 4 rows max"
              placeholder="Autosize with 4 rows max"
              autosize
              minRows={2}
              maxRows={4}
              ref={ref}
              onChange={handleChange}
            />

            <Text fz="xs" mt="md">
                CurrentValue: {currentValue || '–'}
            </Text>
        </>
    );
}
