import { Group, Space, Stack } from '@mantine/core';
import React from 'react';
import { useRouter } from 'next/navigation';
import classes from '@/components/Header.module.css';

interface Link {
    link: string;
    label: string;
}

const links: Link[] = [
    { link: '/', label: '首页' },
    { link: '/oauth', label: '登录' },
    { link: 'https://klpbbs.com', label: '主站' },
    { link: '/about', label: '关于' },
];

export function NavbarList() {
    const router = useRouter();

    const items = links.map((link) => (
        <a
          key={link.label}
          href={link.link}
          className={classes.link}
          onClick={() => router.push(link.link)}
          target={link.link.startsWith('http') ? '_blank' : '_self'}
          rel="noreferrer"
        >
            {link.label}
        </a>
    ));

    return (
        <Group>
            <Space w={10} />
            <Stack>
                <Space w={10} />
                {items}
            </Stack>
        </Group>
    );
}
