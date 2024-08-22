'use client';

import Watermark from '@/app/(root)/backstage/components/Watermark';

export default function JudgePage({ params }: { params: { id: number } }) {
    const { id } = params;
    console.log(id);

    return (
            <div>
                <h1>Judge</h1>
                <h2>{id}</h2>
            </div>

    );
}
