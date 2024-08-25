import { FileInput, rem } from '@mantine/core';
import { IconFileCv } from '@tabler/icons-react';

export function FileUpload(props: { disabled: boolean }) {
    const icon = <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;

    return (
        <>
            <FileInput
              leftSection={icon}
              // label="Attach your file"
              leftSectionPointerEvents="none"
              disabled={props.disabled}
            />
        </>
    );
}
