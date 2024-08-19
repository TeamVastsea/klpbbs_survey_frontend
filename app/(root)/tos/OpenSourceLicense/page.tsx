'use client';

import React from 'react';
import { Container } from '@mantine/core';
import EULAContent from './contents.mdx';

export default function OpenSourceLicensePage() {
    return (
        <Container w="90%">
            <EULAContent />
        </Container>
    );
}
