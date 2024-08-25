import { Textarea } from '@mantine/core';
import React, { useRef } from 'react';
import type { InputProps } from './generateQuestion';

export function FillBlank(props: InputProps) {
    const ref = useRef<HTMLTextAreaElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.setValue(event.currentTarget.value);
    };

    return (
        <>
            <Textarea
              autosize
              value={props.value}
              minRows={2}
              maxRows={4}
              ref={ref}
              onChange={handleChange}
              disabled={props.disabled}
            />
        </>
    );
}
