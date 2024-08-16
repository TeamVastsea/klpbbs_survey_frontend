import { Suspense } from 'react';

export default function CallbackPageLayout({ children }: { children: any }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            {children}
        </Suspense>
    );
}
