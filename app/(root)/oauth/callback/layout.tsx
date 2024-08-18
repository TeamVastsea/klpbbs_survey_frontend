import { Suspense } from 'react';
import { Center } from '@mantine/core';

export default function CallbackPageLayout({ children }: { children: any }) {
    return (
        <Suspense fallback={<Center>Loading...</Center>}>
            {children}
        </Suspense>
    );
}
