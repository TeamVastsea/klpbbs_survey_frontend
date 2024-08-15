'use client';

import { Center, Title, Stack, Text, Divider } from '@mantine/core';
import { SingleChoice } from '@/app/survey/components/SingleChoice';
import { MultipleChoice } from '@/app/survey/components/MultipleChoice';
import { FileUpload } from '@/app/survey/components/FileUpload';
import { FillBlank } from '@/app/survey/components/FillBlank';

export default function Survey() {
    return (
        <>
            <Stack
              bg="var(--mantine-color-body)"
              align="stretch"
              justify="center"
              gap="md"
            >
                <Center>
                    <Title>Survey</Title>
                </Center>
                <Center>
                    <Stack>
                        <Stack>
                            <Text>单选题</Text>
                            <SingleChoice />
                        </Stack>

                        <Divider my="md" />

                        <Stack>
                            <Text>多选题</Text>
                            <MultipleChoice />
                        </Stack>

                        <Divider my="md" />

                        <Stack>
                            <Text>简答题</Text>
                            <FillBlank />
                        </Stack>

                        <Divider my="md" />

                        <Stack>
                            <Text>文件上传题</Text>
                            <FileUpload />
                        </Stack>
                    </Stack>
                </Center>
            </Stack>
        </>

    );
}
