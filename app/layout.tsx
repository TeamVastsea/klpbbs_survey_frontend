'use client';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import React from 'react';
import {AppShell, ColorSchemeScript, mantineHtmlProps, MantineProvider, Space} from '@mantine/core';
import {theme} from '@/theme';
import {Notifications} from "@mantine/notifications";
import {useDisclosure} from "@mantine/hooks";
import Header from "@/app/components/Header";
import {ModalsProvider} from "@mantine/modals";
import Footer from "@/app/components/Footer";
import {NavbarList} from "@/app/components/NavbarList";

// export const metadata = {
//   title: 'KLPBBS 问卷',
//   description: '问卷系统',
// };

export default function RootLayout({children}: { children: any }) {
  const [opened, {toggle}] = useDisclosure();

  return (
    <html lang="en" {...mantineHtmlProps}>
    <head>
      <ColorSchemeScript/>
      <link rel="shortcut icon" href="/favicon.svg"/>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
      />
    </head>
    <body>
    <MantineProvider theme={theme}>
      <ModalsProvider modalProps={{centered: true}}>
        <Notifications/>
        <AppShell
          header={{height: 60}}
          aside={{width: 0, breakpoint: 'sm', collapsed: {mobile: !opened}}}
        >
          <AppShell.Header>
            <Header opened={opened} toggle={toggle}/>
          </AppShell.Header>

          <AppShell.Main>
            {children}
            <Space h={80}/>
          </AppShell.Main>
          <AppShell.Footer h={60}>
            <Footer />
          </AppShell.Footer>

          <AppShell.Aside>
            <NavbarList />
          </AppShell.Aside>
        </AppShell>
      </ModalsProvider>
    </MantineProvider>
    </body>
    </html>
  );
}
