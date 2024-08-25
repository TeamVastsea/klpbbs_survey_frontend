'use client';

import { Center, Space, Stack, Text, Title, Button } from '@mantine/core';
import { useState } from 'react';
import Scratch from '@/app/(root)/survey/[id]/completed/components/Scratch';

export default function CompletedPage() {
    const [buttonVisible, setButtonVisible] = useState(false);

    return (
        <>
            <Space h={20} />
            <Center>
                <Stack>
                    <Center>
                        <Title>感谢你完成了问卷!</Title>
                    </Center>
                    <Center>
                        <Text>在此处您可以进行一次刮刮乐抽奖</Text>
                    </Center>
                    <Center>
                        <Scratch onScratchComplete={() => setButtonVisible(true)} />
                    </Center>
                    {buttonVisible && (
                        <Center mt="md" h="100%">
                            <Button
                              onClick={() => {
                                    window.open('https://www.bilibili.com/video/BV1GJ411x7h7', '_blank');
                                }}
                            >
                                点击领取
                            </Button>
                        </Center>
                    )}
                </Stack>
            </Center>
        </>
    );
}
