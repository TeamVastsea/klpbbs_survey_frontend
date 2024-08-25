'use client';

import React, { useEffect, useState } from 'react';
import { Center, Text } from '@mantine/core';
import Watermark from '@/app/(root)/backstage/components/Watermark';
import { Cookie } from '@/components/cookie';
import Tools from '@/app/(root)/backstage/components/Tools';

export default function BackStageLayout({ children }: { children: React.ReactNode }) {
    const [userName, setUserName] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userNameFromCookie = Cookie.getCookie('username') || 'Default';
            const userIdFromCookie = Cookie.getCookie('uid') || 'Default';

            setUserName(decodeURI(userNameFromCookie));
            setUserId(userIdFromCookie);
        }
    }, []);

    if (userName === null || userId === null) {
        return (
            <Center>
                <Text>
                    Loading...
                </Text>
            </Center>
        );
    }

    return (
        <Watermark
          text={`${userName} ${userId}`}
          fontSize={40}
          gap={200}
        >
            <>
                {children}
                <Tools />
            </>
        </Watermark>
    );
}
