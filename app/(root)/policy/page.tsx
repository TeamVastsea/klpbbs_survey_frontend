'use client';

import React from 'react';
import { Container } from '@mantine/core';
import PolicyContent from './contents.mdx';

export default function PolicyPage() {
    return (
        <Container w="90%">
            <PolicyContent />
        </Container>
    );
}
