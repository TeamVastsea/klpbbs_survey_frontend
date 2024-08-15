import { Space, Textarea } from '@mantine/core';
import React, { useRef } from 'react';
import { InputProps } from '@/app/survey/components/generateQuestion';

export function FillBlank(proos: InputProps) {
    const ref = useRef<HTMLTextAreaElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        proos.setValue(event.currentTarget.value);
    };

    return (
        <>
            <Textarea
              autosize
              value={proos.value}
              minRows={2}
              maxRows={4}
              ref={ref}
              onChange={handleChange}
            />

            <Space h={40} />
        </>
    );
}
