import { Textarea } from '@mantine/core';

export function FillBlank() {
    return (
        <>
            <Textarea
              label="Autosize with 4 rows max"
              placeholder="Autosize with 4 rows max"
              autosize
              minRows={2}
              maxRows={4}
            />
        </>
    );
}
