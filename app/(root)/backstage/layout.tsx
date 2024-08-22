'use client';

import React from 'react';
import Watermark from '@/app/(root)/backstage/components/Watermark';
import { Cookie } from '@/components/cookie';

export default function BackStageLayout({ children }: { children: React.ReactNode }) {
    const userName = decodeURI(Cookie.getCookie('username') || '');
    const userId = Cookie.getCookie('uid') || '';

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
