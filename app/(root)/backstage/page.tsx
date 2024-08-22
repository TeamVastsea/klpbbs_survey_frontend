'use client';

import Watermark from '@/app/(root)/backstage/components/Watermark';

export default function Backstage() {
    return (
            <div>
                <h1>Backstage</h1>
                <a href="/backstage/editor">editor</a>
                <br />
                <a href="/backstage/judge">judge</a>
            </div>
    );
}
