import { FileInput, rem, Space } from '@mantine/core';
import { IconFileCv } from '@tabler/icons-react';

export function FileUpload() {
    const icon = <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;

    return (
        <>
            <FileInput
              leftSection={icon}
              // label="Attach your file"
              leftSectionPointerEvents="none"
            />

            <Space h={40} />
        </>
    );
}
