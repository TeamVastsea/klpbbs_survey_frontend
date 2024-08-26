'use client';

import React, { useEffect, useState } from 'react';
import { Center, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { Cookie } from '@/components/cookie';
import AdminApi from '@/api/AdminApi';
import Watermark from '@/app/(root)/backstage/components/Watermark';
import Tools from '@/app/(root)/backstage/components/Tools';

export default function BackStageLayout({ children }: { children: React.ReactNode }) {
    const [userName, setUserName] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userNameFromCookie = Cookie.getCookie('username') || 'Default';
            const userIdFromCookie = Cookie.getCookie('uid') || 'Default';

            setUserName(decodeURI(userNameFromCookie));
            setUserId(userIdFromCookie);

            AdminApi.getAdminTokenInfo()
                .then((res) => {
                    if (!res.ok) {
                        sessionStorage.setItem('adminAccessDenied', 'true');
                        // router.push('/');
                    }

                    setUserId(res.result.id.toString());
                    setUserName(res.result.username);
                    setLoading(false);
                });
        }
    }, [router]);

    if (loading) {
        return (
            <Center>
                <Text>Loading...</Text>
            </Center>
        );
    }

    return (
        <Watermark text={`${userName} ${userId}`} fontSize={40} gap={200}>
            <>
                {children}
                <Tools />
            </>
        </Watermark>
    );
}
