'use client';

import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript, AppShell } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { theme } from '@/theme';
import '@mantine/notifications/styles.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { NavbarList } from '@/components/NavbarList';

export default function RootLayout({ children }: { children: any }) {
    const [opened, { toggle }] = useDisclosure();

    return (
    <html lang="en">
        <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
          <title>苦力怕论坛 | 问卷系统</title>
        </head>
        <body style={{
        overflow: 'hidden',
        }}>
        <MantineProvider theme={theme}>
            <Notifications position="top-right" />
            <AppShell
              header={{ height: 60 }}
              aside={{ width: 0, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            >
                <AppShell.Header>
                    <Header opened={opened} toggle={toggle} />
                </AppShell.Header>

                <AppShell.Main>
                  {children}
                </AppShell.Main>
                <AppShell.Footer mah={120}>
                  <Footer />
                </AppShell.Footer>

                <AppShell.Aside>
                    <NavbarList />
                </AppShell.Aside>
            </AppShell>
        </MantineProvider>
        </body>
    </html>
    );
}
