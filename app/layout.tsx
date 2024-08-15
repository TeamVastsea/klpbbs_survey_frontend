'use client';

import '@mantine/core/styles.css';
import React from 'react';
import {MantineProvider, ColorSchemeScript, AppShell, ScrollArea} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '../theme';
import '@mantine/notifications/styles.css';
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function RootLayout({ children }: { children: any }) {
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
      <body>
        <MantineProvider theme={theme}>
            <Notifications position="top-right" />
            <AppShell>
                <AppShell.Header h={56}>
                    <Header />
                </AppShell.Header>

                <AppShell.Main>
                    {/*<ScrollArea>*/}
                        {children}
                    {/*</ScrollArea>*/}
                </AppShell.Main>

                <AppShell.Footer mah={154}>
                    <Footer />
                </AppShell.Footer>
            </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
