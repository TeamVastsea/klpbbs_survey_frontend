'use client';

import React, { useEffect, useState } from 'react';
import Watermark from '@/app/(root)/backstage/components/Watermark';
import { Cookie } from '@/components/cookie';

export default function BackStageLayout({ children }: { children: React.ReactNode }) {
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userNameFromCookie = Cookie.getCookie('username') || '';
            const userIdFromCookie = Cookie.getCookie('uid') || '';

            setUserName(decodeURI(userNameFromCookie));
            setUserId(userIdFromCookie);
        }
    }, []);

    return (
        <div>
            <Watermark
              text={`${userName} ${userId}`}
              fontSize={20}
              gap={5}
            >
                {children}
            </Watermark>
        </div>
    );
}
